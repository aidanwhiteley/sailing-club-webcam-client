import { useQuery } from '@tanstack/react-query';
import { getWebcamPhotos } from '../../apis/HttpDataApis';
import Waiting from '../Waiting/Waiting';
import { NotLoggedOnError } from '../../apis/HttpDataApis';
import NotLoggedOn from '../NotLoggedOn/NotLoggedOn';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { PhotoAlbum } from "react-photo-album";
import { useState, MouseEvent } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import './PhotoGallery.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function PhotoGallery(props: { toggleView: () => void }) {

    const [index, setIndex] = useState(-1);
    const [selectedPresetName, setSelectedPresetName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const { isLoading: isPhotosLoading, isError: isPhotosError, data: webcamPhotos, error: photosError } = useQuery({
        queryKey: ['webcamPhotos'],
        queryFn: getWebcamPhotos,
        retry: 0
    })

    const handleButtonClick = () => (_e: MouseEvent<HTMLButtonElement>) => {
        props.toggleView();
    }

    if (isPhotosLoading) {
        return <Waiting message="Getting your webcam preset photos..." />
    }
    if (isPhotosError && photosError instanceof NotLoggedOnError) {
        return <NotLoggedOn />
    }
    if (isPhotosError) {
        console.error('Error loading webcam photos over HTTP. Details: ' + (photosError instanceof Error ? photosError.message : photosError));
        return <ErrorMessage message="Sorry - we were unable to connect to the SYC server. Please try again later." />
    }

    if (webcamPhotos.photos.length === 0) {
        return (
            <>
                <h3>No preset photos available yet!</h3>
                <p>There are no photos of your webcam presets available. Reasons might include:</p>
                <ul className="info-no-style">
                    <li>a) you haven't asked for any photos to be taken!</li>
                    <li>b) you've only just asked for photos to be taken and none have been scheduled to be taken yet.</li>
                </ul>
                <div className="float-start">
                    <Button className="mb-3" variant="outline-dark" onClick={handleButtonClick()}>Return to webcam view</Button>
                </div>
            </>
        )
    }

    const presetDisplayNames = [...new Set(webcamPhotos.photos.map((item) => item.displayPresetName))].sort();

    if (!selectedPresetName && presetDisplayNames && presetDisplayNames[0]) {
        setSelectedPresetName(presetDisplayNames[0]);
    }

    const presetButtonGroup = (presets: string[]) => {
        return (
            <ButtonGroup aria-label="Preset Buttons">
                {presets.map((s, index) =>
                    <Button id={index + '-' + s} type="submit" onClick={handlePresetClick()} active={s === selectedPresetName}
                        variant="outline-dark">{s}</Button>
                )}
            </ButtonGroup>
        );
    }

    const formatDate = (aDateTime: string): string => {
        //const dateTimeStr = aDateTime + '';
        const dateTimeStrNoT = aDateTime.replace('T', ' ');
        const arr = dateTimeStrNoT.split(":");
        if (arr.length === 3) {
            return arr[0] + ':' + arr[1];
        } else {
            return dateTimeStrNoT;
        }
    }

    const filteredPhotos = () => {
        const photos = selectedPresetName ?
            webcamPhotos.photos.filter(s => s.displayPresetName === selectedPresetName) : webcamPhotos.photos;

        const photosByDate = selectedDate ?
            photos.filter(s => buttonDateDisplay(new Date(s.whenTaken)) === selectedDate) : photos;

        return photosByDate.map(s => ({
            // key: s.uuid,
            src: '/webcam-pics/' + s.uuid + '.jpg',
            alt: '' + formatDate(s.whenTaken),
            width: 1280,
            height: 720,
            srcSet: [
                { src: '/webcam-pics/' + s.uuid + '_thumb.jpg', width: 256, height: 144 },
                { src: '/webcam-pics/' + s.uuid + '.jpg', width: 1280, height: 720 },
            ]
        }))
    }

    const isToday = (someDate: Date) => {
        const today = new Date()
        return someDate.getDate() == today.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()
    }

    const buttonDateDisplay = (aDate: Date): string => {
        if (isToday(aDate)) {
            return 'Today';
        } else {
            const options = { weekday: 'short', month: 'short', day: 'numeric' } as const;
            return aDate.toLocaleDateString('en-GB', options)
        }
    }

    const photoDates = () => {
        const photos = selectedPresetName ?
            webcamPhotos.photos.filter(s => s.displayPresetName === selectedPresetName) : webcamPhotos.photos;

        const photoDates = photos.map(s => new Date(s.whenTaken));
        const dateStrings = photoDates.map(s => buttonDateDisplay(s))
        return [...new Set(dateStrings.map((s => s)))];
    }

    if (!selectedDate && photoDates() && photoDates()[0]) {
        setSelectedDate(photoDates()[0]);
    }

    const datesButtonGroup = (dates: string[]) => {
        return (
            <ButtonGroup aria-label="Preset Buttons">
                {dates.map((s) =>
                    <Button id={s} type="submit" onClick={handleDatesClick()} active={s === selectedDate}
                        variant="outline-dark" size="sm">{s}</Button>
                )}
            </ButtonGroup>
        );
    }

    const handlePresetClick = () => (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const currentElementIdAndPrefix: string = e.currentTarget.getAttribute('id') ? e.currentTarget.getAttribute('id')! : '';
        const firstDelim = currentElementIdAndPrefix.indexOf('-');
        const elemId = currentElementIdAndPrefix.substring(firstDelim + 1);
        setSelectedPresetName(elemId);
    }

    const handleDatesClick = () => (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const currentElement: string = e.currentTarget.getAttribute('id') ? e.currentTarget.getAttribute('id')! : '';
        setSelectedDate(currentElement);
    }

    const isViewInIframe = () => {
        return (window.location !== window.parent.location);
    }


    return (
        <>
            <Row>
                <Col sm={4}>
                    <div className="float-start">
                        <Button className="mb-3" variant="outline-dark" onClick={handleButtonClick()}>Return to webcam view</Button>
                    </div>
                </Col>
                <Col sm={8}></Col>
            </Row>
            <Row>
                <Col sm={12}>
                    {presetButtonGroup(presetDisplayNames)}
                </Col>
            </Row>
            <Row>
                <Col className="mt-4" sm={12}>
                    {datesButtonGroup(photoDates())}
                    <p className="gallery-info">Click any photo for larger views</p>
                    {isViewInIframe() &&
                        <div className="d-md-none alert alert-warning" role="alert">
                            Small screen users - please use <a href="/somepath/" target="top">this link</a> before viewing larger photos!
                        </div>
                    }
                </Col>
            </Row>

            <Row>
                <Col sm={12}>
                    <PhotoAlbum
                        layout="rows"
                        photos={filteredPhotos()}
                        targetRowHeight={100}
                        onClick={({ index }) => setIndex(index)}
                        spacing={20}
                        padding={20}
                    />
                    <Lightbox
                        slides={filteredPhotos()}
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                        // enable optional lightbox plugins
                        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom, Download]}
                    />
                </Col>
            </Row>
            <Row>
                <Col sm={4}>
                    <div className="float-start mt-5">
                        <Button className="mb-3" variant="outline-dark" onClick={handleButtonClick()}>Return to webcam view</Button>
                    </div>
                </Col>
                <Col sm={8}></Col>
            </Row>
        </>
    );
}

export default PhotoGallery;