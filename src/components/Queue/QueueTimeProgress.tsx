import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import { WebcamQueueEntry } from '../../apis/HttpDataApis';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function QueueTimeProgress(props: { queue: WebcamQueueEntry[], userName: string, serverTimeNow: number, queueUsersRemoved: string[] }) {

    // The initial queue duration for me will be:
    // (expiry time of person just ahead of me in queue) minus (server time now)
    const [initialQueueTime, setInitialQueueTime] = useState(0)
    const [showUsersRemovedToast, setShowUsersRemovedToast] = useState(false);

    useEffect(() => {
        const myQueueIndex = props.queue.findIndex(s => s.userName === props.userName);
        const toWait = props.queue.length > 1 ?
            Math.round((props.queue[myQueueIndex - 1].expiryTime - props.serverTimeNow) / 1000) :
            0;
        setInitialQueueTime(toWait);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.queueUsersRemoved.length > 0) {
            setShowUsersRemovedToast(true);
        }
    }, [props.queueUsersRemoved]);

    const currentQueueTime = (): number => {
        const myQueueIndex = props.queue.findIndex(s => s.userName === props.userName);
        const toWait = props.queue.length > 1 ?
            Math.round((props.queue[myQueueIndex - 1].expiryTime - props.serverTimeNow) / 1000) :
            0;
        return toWait;
    }

    return (
        <>
            <ToastContainer className="p-3" position="top-end" style={{ zIndex: 1 }} >
                <Toast onClose={() => setShowUsersRemovedToast(false)} show={showUsersRemovedToast} delay={4000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">SYC Webcam Queue</strong>
                        <small>A few seconds ago...</small>
                    </Toast.Header>
                    <Toast.Body>Your wait time has decreased as someone has just left the queue for the SYC webcam</Toast.Body>
                </Toast>
            </ToastContainer>

            <Card border="primary" >
                <Card.Header>SYC webcam queue</Card.Header>
                <Card.Body>
                    <Card.Title>Your webcam queue</Card.Title>
                    <Card.Text>
                        {props.queue.length === 2 &&
                            <span>There is currently <b>1</b> other person in the queue.</span>
                        }
                        {props.queue.length > 2 &&
                            <span>There are currently <b>{props.queue.length - 1}</b> other people in the queue.</span>
                        }
                        <br />
                        Your estimated remaining queue time:
                    </Card.Text>
                    <ProgressBar max={initialQueueTime} min={0} now={currentQueueTime()} label={`${currentQueueTime()} seconds`}
                        visuallyHidden={(initialQueueTime / currentQueueTime()) > 5} />
                </Card.Body>
            </Card>

        </>
    );
}

export default QueueTimeProgress;