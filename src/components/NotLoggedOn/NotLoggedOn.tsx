import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import { useMutation } from '@tanstack/react-query'
import { WebCamStatusAnon, getWebCamStatusAnon } from '../../apis/HttpDataApis'
import { useState, MouseEvent } from 'react';

function NotLoggedOn() {

    const [msg, setMsg] = useState('');

    const mutation = useMutation({
        mutationFn: getWebCamStatusAnon,
        onSuccess(data: WebCamStatusAnon) {
            if (data.callOk) {
                setMsg('A scan of the estuary should start shortly. Enjoy the view!');
            } else if (data.camControlledBySycMember) {
                setMsg('Sorry - the webcam is currently being used by an SYC member. Please try again shortly.');
            } else if (data.scanAlreadyStarted) {
                setMsg('A scan of the Exe Estuary has been already been requested recently. Please try again in a bit.');
            }
        }
    })

    const handleMouseClick = () => (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setMsg('');
        mutation.mutate();
    }

    return (
        <Card border="primary" >
            <Card.Header>Starcross Yacht Club</Card.Header>
            <Card.Body>
                <Card.Title>Not logged on!</Card.Title>
                <Card.Text>
                    As a visitor to the Starcross Yacht Club website, you can click the button below to scan the Exe estuary at Starcross Yacht Club.
                    <br />
                    If you are member of SYC you can <a href="/login" target="_top">log on</a> to the SYC web site to be able to fully control the SYC webcam.
                </Card.Text>
                <Button variant="outline-dark" onClick={handleMouseClick()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-camera-video-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z" />
                    </svg> Scan the Exe estuary at SYC</Button>
                {mutation.isSuccess &&
                    <div className="alert alert-info mt-3" role="alert">{msg}</div>
                }
                {mutation.isError &&
                    <div className="alert alert-danger mt-3" role="alert">There was an error trying to start your scan of the Exe Estuary. Please try again later'</div>
                }
            </Card.Body>
        </Card >
    )
}

export default NotLoggedOn;