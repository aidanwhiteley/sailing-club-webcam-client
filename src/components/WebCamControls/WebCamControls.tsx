import Compass from '../../components/Compass/Compass'
import MoveSizeRange from '../../components/MoveSizeRange/MoveSizeRange'
import StandardPresets from '../../components/Presets/StandardPresets'
import ZoomIn from '../../components/Zoom/ZoomIn'
import ZoomOut from '../../components/Zoom/ZoomOut'
import QueueDisplay from '../../components/Queue/QueueDisplay'
import QueueTimeProgress from '../../components/Queue/QueueTimeProgress'
import { useState } from "react";
import { NotLoggedOnError, PersonalPresetAction, WebCamCommand } from '../../apis/HttpDataApis'
import NotLoggedOn from '../NotLoggedOn/NotLoggedOn'
import Waiting from '../Waiting/Waiting'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useSubscription, useStompClient } from "react-stomp-hooks"
import { getWebCamStatus } from '../../apis/HttpDataApis'
import { useQuery } from '@tanstack/react-query'
import { WebcamQueueEntry, WebcamPersonalPreset } from '../../apis/HttpDataApis'
import { webCamApiCall } from '../../apis/HttpDataApis'
import { useMutation } from '@tanstack/react-query'
import { formatMoveToPreset, formatMove } from '../../utils/WebCamUrlPrametersFormatter'
import PresonalPresetEdit from '../PersonalPresetEdit/PersonalPresetEdit'

export type ControlType = 'preset' | 'zoom' | 'compass';
export type ControlClickedProps = (controlType: ControlType, value?: string) => void;

type WebcamPageAndQueue = {
    readonly queue: WebcamQueueEntry[],
    readonly personalPresets: WebcamPersonalPreset[],
    readonly pageUsers: string[],
    readonly serverTimeNow: number,
    readonly usersRemovedFromQueue: string[]
};

function WebCamControls(props: { toggleView: () => void }) {

    const [lastClickedControlWasPreset, setLastClickedControlWasPreset] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebcamPageAndQueue>({} as WebcamPageAndQueue);
    const [moveAmount, setMoveAmount] = useState(5);
    const [controlErrMsg, setControlErrMsg] = useState('');
    const [presetEditDisplay, setPresetEditDisplay] = useState(0);
    const [presetCrudMessage, setPresetCrudMessage] = useState('');

    const mutation = useMutation({
        mutationFn: (command: { typeid: string, parm1: string, parm2: string }) => webCamApiCall(command),
        onError() {
            setControlErrMsg('There was an error calling to the webcam. Please try again later');
        },
    })

    const handleControlClicked = (controlType: ControlType, value?: string) => {

        setControlErrMsg('');
        setPresetCrudMessage('');

        if (controlType === 'preset') {
            setLastClickedControlWasPreset(true);
            if (value === 'preset-personal-1-edit') {
                setPresetEditDisplay(1);
                if (webCamStatus?.personalPresets && webCamStatus.personalPresets[0]) {
                    const command: WebCamCommand = { typeid: 'preset', parm1: '' + webCamStatus.personalPresets[0].webcamPresetIndex, parm2: 'none' };
                    mutation.mutate(command);
                }
            } else if (value === 'preset-personal-2-edit') {
                setPresetEditDisplay(2);
                if (webCamStatus?.personalPresets && webCamStatus.personalPresets[1]) {
                    const command: WebCamCommand = { typeid: 'preset', parm1: '' + webCamStatus.personalPresets[1].webcamPresetIndex, parm2: 'none' };
                    mutation.mutate(command);
                }
            } else {
                mutation.mutate(formatMoveToPreset(value!, webCamStatus!));
            }
        } else {
            if (controlType === 'compass') {
                mutation.mutate(formatMove(value!, moveAmount));
            } else if (controlType === 'zoom') {
                const zoomIn = (value === 'in') ? 'true' : 'false';
                const command: WebCamCommand = { typeid: 'zoom', parm1: zoomIn, parm2: 'none' };
                mutation.mutate(command);
            }
            setLastClickedControlWasPreset(false);
        }

    }

    // Initial data loaded over HTTP as we want to store the current user's username and personal presets. 
    const { isLoading: userDataIsLoading, isError: userDataIsError, data: webCamStatus, error: userDataError } = useQuery({
        queryKey: ['getWebCamStatus'],
        queryFn: getWebCamStatus,
        retry: 0
    })

    const stompClient = useStompClient();
    // We dont try subscribing to the websocket message topic until we know the user is an SYC member
    useSubscription(
        webCamStatus && webCamStatus.userName ? ["/topic/webcam"] : [],
        message => handleReceivedWebsocketMessage(JSON.parse(message.body))
    );

    const handleReceivedWebsocketMessage = (message: WebcamPageAndQueue) => {
        //console.log('Websocket received: ' + JSON.stringify(message));
        // if (message && message.usersRemovedFromQueue.length > 0) {
        //     console.log('Saw following users removed from webcam control queue: ' + message.usersRemovedFromQueue)
        // }
        setLastMessage(message);
        sendKeepAliveMessage();
    }

    const handleMoveAmountClicked = (amount: number) => {
        setMoveAmount(amount);
        setPresetCrudMessage('');
    }

    const handlePresetDisplay = (preset: number) => {
        setPresetEditDisplay(preset);
    }

    const handlePresetCrudMessage = (message: PersonalPresetAction) => {
        function formatDisplayMaessage(message: PersonalPresetAction) {
            switch (message) {
                case 'create': return 'Your personal preset has been created as requested';
                case 'update': return 'Your selected personal preset has been updated OK';
                case 'delete': return 'Your selected personal preset has now been deleted';
                default: return '';
            }
        }
        setPresetCrudMessage(formatDisplayMaessage(message));
    }

    const sendKeepAliveMessage = () => {
        if (stompClient) {
            stompClient.publish({
                destination: "/webcam/chat",
                body: JSON.stringify({ message: '', id: -1 })
            });
        } else {
            console.error('StompClient was null');
        }
    }

    const queueContainsMe = () => {
        if (!lastMessage?.queue) {
            return false;
        }
        return (lastMessage.queue.find(s => s.userName === (webCamStatus ? webCamStatus.userName : '')) ? true : false);
    }

    const isFirstInQueue = () => {
        if (!lastMessage?.queue) {
            return false;
        }
        return (lastMessage.queue.findIndex(s => s.userName === (webCamStatus ? webCamStatus.userName : '')) === 0) ? true : false;
    }


    if (userDataIsLoading || !lastMessage.queue && !userDataIsError) {
        return <Waiting message="Checking whether you are a logged on SYC member and for other current webcam users..." />
    }
    if (userDataIsError && userDataError instanceof NotLoggedOnError) {
        return <NotLoggedOn />
    }
    if (userDataIsError) {
        console.error('Error loading webcamstatus over HTTP. Details: ' + (userDataError instanceof Error ? userDataError.message : userDataError));
        return <ErrorMessage message="Sorry - we were unable to connect to the SYC server. Please try again later." />
    }
    if (queueContainsMe() && !isFirstInQueue()) {
        return <QueueTimeProgress queue={lastMessage.queue} userName={webCamStatus ? webCamStatus.userName : ''}
            serverTimeNow={lastMessage.serverTimeNow} queueUsersRemoved={lastMessage.usersRemovedFromQueue} />
    }
    if (lastMessage?.queue?.length > 0 && !queueContainsMe()) {
        return <QueueDisplay queue={lastMessage.queue} queueUsersRemoved={lastMessage.usersRemovedFromQueue} />
    }

    return (
        <>
            {controlErrMsg && <div className="alert alert-danger" role="alert">{controlErrMsg}</div>}
            <div>
                <Compass handleControlClicked={handleControlClicked} />
            </div>
            <div>
                <MoveSizeRange moveAmount={moveAmount} handleMoveAmountClicked={handleMoveAmountClicked} />
            </div>
            <div>
                <ZoomOut handleControlClicked={handleControlClicked} /><ZoomIn handleControlClicked={handleControlClicked} />
            </div>
            <div>
                <StandardPresets handleControlClicked={handleControlClicked} lastControlWasPreset={lastClickedControlWasPreset}
                    personalPresets={webCamStatus.personalPresets} toggleView={props.toggleView} />
            </div>
            {presetCrudMessage &&
                <div className="alert alert-info" role="alert">
                    {presetCrudMessage}
                </div>
            }
            {presetEditDisplay > 0 &&
                <div>
                    <PresonalPresetEdit key={presetEditDisplay} handlePresetDisplay={handlePresetDisplay}
                        personalPresets={webCamStatus.personalPresets} presetNumber={presetEditDisplay} handlePresetCrudMessage={handlePresetCrudMessage} />
                </div>
            }
        </>
    );
}

export default WebCamControls;