import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './PersonalPresetEdit.css';
import { MouseEvent, useState, ChangeEvent } from "react";
import { WebcamPersonalPreset, PersonalPresetAction, personalPreset, PresetCrudData, NoMorePresetsError } from '../../apis/HttpDataApis';
import { useMutation, useQueryClient } from '@tanstack/react-query'

type theProps = {
    handlePresetDisplay: (preset: number) => void,
    handlePresetCrudMessage: (message: PersonalPresetAction) => void,
    personalPresets: WebcamPersonalPreset[],
    presetNumber: number
};

function PresonalPresetEdit(props: theProps) {

    const isExisting = (): boolean => {
        return (props.personalPresets.length < props.presetNumber) ? false : true;
    }

    const [showModal, setShowModal] = useState(false);
    const [photosRequired, setPhotosRequired] = useState<boolean>(isExisting() ? props.personalPresets[props.presetNumber - 1].requiresPhotos : false);
    const [presetName, setPresetName] = useState<string>(isExisting() ? props.personalPresets[props.presetNumber - 1].displayPresetName :
        'My Preset ' + props.presetNumber);
    // If the preset already exists and they have previously successfully requested photos, then they will have already agreed the T&Cs
    const [tAndCsAgreed, setTAndCsAgreed] = useState<boolean>(isExisting() ? props.personalPresets[props.presetNumber - 1].requiresPhotos : false);

    const queryClient = useQueryClient();

    const handleOnClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const currentElementId: string = e.currentTarget.getAttribute('id') ? e.currentTarget.getAttribute('id')! : '';

        let action: PersonalPresetAction = 'create';
        let data: WebcamPersonalPreset = {} as WebcamPersonalPreset;
        if (currentElementId === 'preset-cancel') {
            props.handlePresetDisplay(0);
            return;
        } else if (currentElementId === 'preset-create') {
            if (!presetName) {
                data.displayPresetName = 'My Preset ' + props.presetNumber;
            } else {
                data.displayPresetName = presetName;
            }
            data.requiresPhotos = photosRequired;
        } else if (currentElementId === 'preset-update') {
            data = props.personalPresets[props.presetNumber - 1];
            if (!presetName) {
                data.displayPresetName = 'My Preset ' + props.presetNumber;
            } else {
                data.displayPresetName = presetName;
            }
            data.requiresPhotos = photosRequired;
            action = 'update';
        } else if (currentElementId === 'preset-delete') {
            data = props.personalPresets[props.presetNumber - 1];
            action = 'delete';
        } else {
            throw new Error('Unexpected action / element type: ' + currentElementId);
        }

        const presetCrudData: PresetCrudData = {
            preset: data,
            action: action
        }
        mutation.mutate(presetCrudData);
    }


    const mutation = useMutation({
        mutationFn: (command: { preset: WebcamPersonalPreset, action: PersonalPresetAction }) => personalPreset(command),
        onSuccess(_data, command) {
            queryClient.invalidateQueries({ queryKey: ['getWebCamStatus'] });
            props.handlePresetCrudMessage(command.action);
            props.handlePresetDisplay(0);
        }
    })

    const handleModalCancel = () => {
        setShowModal(false);
        setTAndCsAgreed(false);
        if (photosRequired) {
            setPhotosRequired(false);
        }
    }

    const handleModalAgreed = () => {
        setShowModal(false);
        setTAndCsAgreed(true);
    }

    function handleTCClick(e: MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        setShowModal(true);
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id;
        if (id === 'photos-requested') {
            setPhotosRequired((current) => !current);
            const newVal = e.target.checked;
            if (!tAndCsAgreed && newVal) {
                setShowModal(true);
            } 
        } else if (id === 'formPresetName') {
            const newVal = e.target.value;
            if (newVal.length > 15) {
                newVal.slice(0, 15);
            }
            setPresetName(newVal);
        }
    }

    return (
        <>
            <Container className="mt-2 personal-preset-edit" fluid>
                <p className="preset-name">{presetName}</p>
                {!isExisting() &&
                    <p>Move the camera and zoom in/out as required. Then click the "Create Preset" button to store the current camera position and zoom setting as one of
                        your SYC webcam personal presets.
                    </p>
                }
                {isExisting() &&
                    <p>Use the webcam controls to adjust the camera position and zoom as required and then click 'Update'. </p>
                }
                <Form className="">
                    <Form.Group as={Row} className="" controlId="formPresetName">
                        <Form.Label column xs={5}>
                            <>
                                {isExisting() && 'Rename '}
                                {!isExisting() && 'Name '}
                                this preset <br /> <span className="form-guidance">Max of 15 characters</span>
                            </>
                        </Form.Label>
                        <Col xs={7}>
                            <Form.Control type="text" maxLength={15} placeholder={'Preset ' + props.presetNumber} value={presetName} onChange={onChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="" controlId="formPhotos">
                        <Form.Label column xs={7}>
                            Take hourly photos of this preset
                            <br /> <span className="form-guidance">Subject to these <a href="#" onClick={handleTCClick}>T&amp;Cs</a></span>
                        </Form.Label>
                        <Col xs={5}>
                            <Form.Check id="photos-requested" checked={photosRequired} onChange={onChange} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mt-4 mb-3">
                        <Col xs={{ offset: 0 }}>
                            {!isExisting() &&
                                <Button variant="primary" size="sm" type="submit" id="preset-create" onClick={handleOnClick} className="me-3">Create Preset</Button>
                            }
                            {isExisting() &&
                                <>
                                    <Button variant="primary" size="sm" type="submit" id="preset-update" onClick={handleOnClick} className="me-3">Update</Button>
                                    <Button variant="danger" size="sm" type="submit" id="preset-delete" onClick={handleOnClick} className="me-3">Delete</Button>
                                </>
                            }
                            <Button size="sm" variant="info" id="preset-cancel" type="reset" onClick={handleOnClick}>Cancel</Button>
                        </Col>
                    </Form.Group>
                </Form>
                <p className="delete-info"><b>Note</b> - to conserve camera resources, personal presets not viewed at least once a month are 
                automatically deleted.
                </p>
                {mutation.isLoading &&
                    <>
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border text-primary mb-2" style={{ width: "3rem", height: "3rem" }} role="status">
                                <span className="visually-hidden">Saving your personal preset changes...</span>
                            </div>
                            <p className="ms-3">Saving your changes...</p>
                        </div>
                    </>
                }
                {(mutation.isError && mutation.error instanceof NoMorePresetsError) &&
                    <div className="alert alert-danger" role="alert">
                        Oh my! There are no more spare presets on the webcam. Please let Aidan Whiteley know we have a resource problem.
                    </div>
                }
                {(mutation.isError && !(mutation.error instanceof NoMorePresetsError)) &&
                    <div className="alert alert-danger" role="alert">
                        Sorry - there was a problem making your personal preset changes. Please try again later.
                    </div>
                }
            </Container>

            <Modal show={showModal} onHide={handleModalCancel} dialogClassName="tandc-modal" >
                <Modal.Header closeButton>
                    <Modal.Title>Personal Preset Photos - Terms and Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ol>
                        <li>
                            To avoid any possible privacy issues, you <b>must not</b> ask for photos to be taken of any personal preset unless the position pointed
                            to is on the water of the Exe Estuary.
                        </li>
                        <li>
                            The taking of photos is on a "best efforts" basis only. As photos will only be taken when
                            no SYC member is using the webcam, at busy times it may not be possible to complete all requested photos each hour.
                        </li>
                        <li>
                            Photos will only be kept on the server for 7 days. You should download any images you need to retain longer.
                        </li>
                        <li>
                            The photos are stored with "unguessable" file names so no-one else (other than those with access to the SYC server)
                            should be able to see your images unless you share an image's URL.
                        </li>
                        <li>
                            All full sized photos are "watermarked" with your website username, the preset name and the date / time the photo was taken.
                        </li>
                        <li>
                            <b>Remember</b> - the SYC webcam can be viewed (but not controlled) by members of the public. If you opt for a photograph
                            to be taken of a preset which points to your boat, then your boat will be viewable by members of the public once
                            an hour.
                        </li>
                    </ol>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleModalAgreed}>
                        I agree to T&amp;Cs
                    </Button>
                    <Button variant="info" onClick={handleModalCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default PresonalPresetEdit;