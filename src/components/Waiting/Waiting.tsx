import Spinner from 'react-bootstrap/Spinner';

function Waiting(props: { message: string }) {
    return (
        <>
            <Spinner animation="border" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="network-waiting">
                {props.message}
            </p>
        </>
    );
}

export default Waiting;