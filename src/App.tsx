import './App.css'
import WebCamControls from './components/WebCamControls/WebCamControls'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import WebCamDisplay from './components/WebCamDisplay/WebCamDisplay'
import { StompSessionProvider } from "react-stomp-hooks"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PhotoGallery from './components/PhotoGallery/PhotoGallery'
import { useState } from "react";

function App() {

  // Create a Tanstack / React Query client
  const queryClient = new QueryClient();

  const [showPhotoGallery, setShowPhotoGallery] = useState(false);

  const handleToggleView = () => {
    setShowPhotoGallery((current) => !current);
  }

  const isNotViewInIframe = () => {
    return (window.location === window.parent.location);
  }

  return (
    <Container fluid className="webcam-app">

      {/* Initialise the Tanstack / React Query provider */}
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {/* Initialise a Stomp connection - temporarily set reconnectDelay to 30 secs while we still support SocksJS */}
        {/* <StompSessionProvider url={"/chat"} debug={(str) => { console.log(str); }}> */}
        <StompSessionProvider url={"/chat"} reconnectDelay={30000} >

          {!showPhotoGallery &&
            <Row>
              <Col sm={9}>
                <WebCamDisplay />
              </Col>
              <Col sm={3} className="webcam-controls">
                <WebCamControls toggleView={handleToggleView} />
              </Col>
            </Row>
          }
          {(!showPhotoGallery && isNotViewInIframe()) &&
            <Row className="mt-5">
              <Col sm={6}></Col>
              <Col sm={6}>
                <div className="float-end">
                  <a target="_top" href="/syc-webcam-2023">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-left" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M7.364 3.5a.5.5 0 0 1 .5-.5H14.5A1.5 1.5 0 0 1 16 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 3 14.5V7.864a.5.5 0 1 1 1 0V14.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-10a.5.5 0 0 0-.5-.5H7.864a.5.5 0 0 1-.5-.5z" />
                      <path fillRule="evenodd" d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 0 1H1.707l8.147 8.146a.5.5 0 0 1-.708.708L1 1.707V5.5a.5.5 0 0 1-1 0v-5z" />
                    </svg></a> <a target="_top" href="/syc-webcam-2023" className="ms-1">Back to main SYC website</a>
                </div>
              </Col>
            </Row>
          }

          {showPhotoGallery &&
            <Row>
              <Col sm={12} className="webcam-controls">
                <PhotoGallery toggleView={handleToggleView} />
              </Col>
            </Row>
          }

        </StompSessionProvider>
      </QueryClientProvider>
    </Container>
  )
}

export default App
