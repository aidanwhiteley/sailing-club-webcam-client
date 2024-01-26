import './WebCamDisplay.css'
import Ratio from 'react-bootstrap/Ratio';

function WebCamDisplay() {
    return (

        <div style={{ width: '100%', height: 'auto' }}>
            <Ratio aspectRatio={62}>
                <iframe id="theVideo" name="CamVideo"
                    src="https://domain-for-your-webcam-feed/path-and-parameters-for-webcam-feed"
                    allowFullScreen={true} ></iframe>
            </Ratio>
        </div>
    );
}

export default WebCamDisplay;