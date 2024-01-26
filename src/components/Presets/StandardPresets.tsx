import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { MouseEvent, useState, useEffect } from "react";
import "./StandardPresets.css";
import { ControlClickedProps } from '../WebCamControls/WebCamControls';
import { WebcamPersonalPreset } from '../../apis/HttpDataApis';

type TheProps = {
    handleControlClicked: ControlClickedProps,
    lastControlWasPreset: boolean,
    personalPresets: WebcamPersonalPreset[],
    toggleView: () => void
};

function StandardPresets(props: TheProps) {

    const [highlightedPreset, setHighlightedPreset] = useState('');

    const isActive = (id: string): boolean => {
        if (highlightedPreset === id) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        if (!props.lastControlWasPreset) {
            setHighlightedPreset('');
        }
    }, [props.lastControlWasPreset]);



    const handleMouseClick = () => (e: MouseEvent<HTMLButtonElement>) => {
        const currentElementId: string = e.currentTarget.getAttribute('id') ? e.currentTarget.getAttribute('id')! : '';
        if (currentElementId === 'preset-personal-photo-gallery') {
            props.toggleView();
        } else {
            props.handleControlClicked('preset', currentElementId);
            setHighlightedPreset(currentElementId);
        }
    }

    return (
        <>
            <ButtonToolbar id="presets-toolbar" aria-label="Toolbar with button groups">
                <ButtonGroup size="sm" className="me-2 mb-2" aria-label="Club group">
                    <Button id='preset-slipway' active={isActive('preset-slipway')} variant="outline-dark" onClick={handleMouseClick()}>Slipway</Button>
                    <Button id='preset-boathouse' active={isActive('preset-boathouse')} variant="outline-dark" onClick={handleMouseClick()}>Boat House</Button>
                    <Button id='preset-club' active={isActive('preset-club')} variant="outline-dark" onClick={handleMouseClick()}>Club</Button>
                </ButtonGroup>
                <ButtonGroup size="sm" className="me-2 mb-2" aria-label="Locations group">
                    <Button id='preset-lympstone' active={isActive('preset-lympstone')} variant="outline-dark" onClick={handleMouseClick()}>Lympstone</Button>
                    <Button id='preset-exmouth' active={isActive('preset-exmouth')} variant="outline-dark" onClick={handleMouseClick()}>Exmouth</Button>
                    <Button id='preset-starcross' active={isActive('preset-starcross')} variant="outline-dark" onClick={handleMouseClick()}>Starcross</Button>
                </ButtonGroup>
                <ButtonGroup size="sm" className="me-2 mb-2" aria-label="Buoys group">
                    <DropdownButton as={ButtonGroup} size="sm" variant="outline-dark" title="Channel Buoys" id="bg-nested-dropdown-1">
                        <Dropdown.Item id='preset-buoy19' active={isActive('preset-buoy19')} eventKey="3" onClick={handleMouseClick()}>Buoy 19</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy18' active={isActive('preset-buoy18')} eventKey="1" onClick={handleMouseClick()}>Buoy 18</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy23' active={isActive('preset-buoy23')} eventKey="2" onClick={handleMouseClick()}>Buoy 23</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy25' active={isActive('preset-buoy25')} eventKey="4" onClick={handleMouseClick()}>Buoy 25</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy27' active={isActive('preset-buoy27')} eventKey="5" onClick={handleMouseClick()}>Buoy 27</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy29' active={isActive('preset-buoy29')} eventKey="6" onClick={handleMouseClick()}>Buoy 29</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy31' active={isActive('preset-buoy31')} eventKey="7" onClick={handleMouseClick()}>Buoy 31</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy33' active={isActive('preset-buoy33')} eventKey="8" onClick={handleMouseClick()}>Buoy 33</Dropdown.Item>
                        <Dropdown.Item id='preset-buoy20' active={isActive('preset-buoy20')} eventKey="9" onClick={handleMouseClick()}>Buoy 20</Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
                <ButtonGroup size="sm" className="me-2 mb-2" aria-label="Locations group">
                    <Button id='preset-scan-estuary' active={isActive('preset-scan-estuary')} variant="outline-dark" onClick={handleMouseClick()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-binoculars-fill" viewBox="0 0 16 16">
                            <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z" />
                        </svg> Scan the Exe Estuary</Button>
                </ButtonGroup>
                {props.personalPresets &&
                    <ButtonGroup size="sm" className="me-2 mb-2" aria-label="My presets">
                        <DropdownButton as={ButtonGroup} size="sm" variant="outline-dark" title="My Presets" id="bg-nested-dropdown-2">
                            <Dropdown.Item id='preset-personal-1' disabled={props.personalPresets.length < 1} active={isActive('preset-personal-1')} eventKey="5" onClick={handleMouseClick()}>Go to {props.personalPresets[0] ? props.personalPresets[0].displayPresetName : 'My Preset 1'}</Dropdown.Item>
                            <Dropdown.Item id='preset-personal-2' disabled={props.personalPresets.length < 2} active={isActive('preset-personal-2')} eventKey="6" onClick={handleMouseClick()}>Go to {props.personalPresets[1] ? props.personalPresets[1].displayPresetName : 'My Preset 2'}</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item id='preset-personal-1-edit' active={isActive('preset-personal-1-edit')} eventKey="7" onClick={handleMouseClick()}>Edit {props.personalPresets[0] ? props.personalPresets[0].displayPresetName : 'My Preset 1'}</Dropdown.Item>
                            <Dropdown.Item id='preset-personal-2-edit' active={isActive('preset-personal-2-edit')} eventKey="8" onClick={handleMouseClick()}>Edit {props.personalPresets[1] ? props.personalPresets[1].displayPresetName : 'My Preset 2'}</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item id='preset-personal-photo-gallery' eventKey="9" onClick={handleMouseClick()}>Preset photos</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item id='preset-personal-help' eventKey="10" href="/syc-webcam-functionality-for-yachties" target="_top">How to use</Dropdown.Item>
                        </DropdownButton>
                    </ButtonGroup>
                }
            </ButtonToolbar>

        </>
    );
}

export default StandardPresets;