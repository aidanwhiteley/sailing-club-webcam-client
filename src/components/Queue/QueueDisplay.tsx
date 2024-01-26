import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import queueImage from './queue.jpg'
import { WebcamQueueEntry } from '../../apis/HttpDataApis'
import { useMutation } from '@tanstack/react-query'
import { webCamApiCall } from '../../apis/HttpDataApis'
import { WebCamCommand } from '../../apis/HttpDataApis'
import { useState, useEffect, MouseEvent } from "react";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function QueueDisplay(props: { queue: WebcamQueueEntry[], queueUsersRemoved: string[] }) {

    const secsToWait = props.queue.slice(-1)[0].expiryTime - Date.now();

    const [errMsg, setErrMsg] = useState('');
    const [showUsersRemovedToast, setShowUsersRemovedToast] = useState(false);

    useEffect(() => {
        if (props.queueUsersRemoved.length > 0) {
            setShowUsersRemovedToast(true);
        }
    }, [props.queueUsersRemoved]);

    const mutation = useMutation({
        mutationFn: (command: { typeid: string, parm1: string, parm2: string }) => webCamApiCall(command),
        onError() {
            setErrMsg('There was an error calling the server to request control of camera. Please try again later');
        },
    })

    const handleOnClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const command: WebCamCommand = { typeid: 'control', parm1: 'none', parm2: 'none' };
        mutation.mutate(command);
    }

    return (
        <>
            <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1 }} >
                <Toast onClose={() => setShowUsersRemovedToast(false)} show={showUsersRemovedToast} delay={7500} autohide>
                    <Toast.Header>
                        <strong className="me-auto">SYC Webcam Queue</strong>
                        <small>A few seconds ago...</small>
                    </Toast.Header>
                    <Toast.Body>Wait time decreased as someone has just left the queue for the SYC webcam</Toast.Body>
                </Toast>
            </ToastContainer>
            <Card border="primary" >
                <Card.Img variant="top" src={queueImage} alt="A queue" />
                <Card.Body>
                    <Card.Title>There's a queue!</Card.Title>
                    <Card.Text>
                        There's currently a queue to control the SYC webcam.
                        <br />
                        {props.queue.length === 1 &&
                            <span>There is currently <b>1</b> person in the queue.</span>
                        }
                        {props.queue.length > 1 &&
                            <span>There are currently <b>{props.queue.length}</b> people in the queue.</span>
                        }
                        <br />
                        If you click the "Join webcam queue" button below, you should get
                        control of the camera in about <b>{Math.round(secsToWait / 1000)}</b> seconds.
                        <br />
                    </Card.Text>

                    {errMsg && <div className="alert alert-danger" role="alert">{errMsg}</div>}

                    <Button variant="outline-dark" onClick={handleOnClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
                            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
                        </svg> Join webcam queue</Button>
                </Card.Body>
            </Card>
        </>
    );
}

export default QueueDisplay;