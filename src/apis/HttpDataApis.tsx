export class NotLoggedOnError extends Error { }
export class NoMorePresetsError extends Error { }

export type WebcamQueueEntry = {
    userName: string,
    name: string,
    expiryTime: number,
    joinTime: number
}

export type WebcamPersonalPreset = {
    id: number,
    webcamPresetIndex: number,
    userName: string,
    lastUsed: Date,
    webcamPresetName: string,
    displayPresetName: string,
    requiresPhotos: boolean,
    replaceCameraPosition: boolean
}

export type WebCamStatus = {
    queue: WebcamQueueEntry[],
    pageUsers: string[],
    personalPresets: WebcamPersonalPreset[],
    userName: string,
    currentOwnerName: string,
    serverTimeNow: number
}

export type WebCamCommand = {
    typeid: string,
    parm1: string,
    parm2: string
}

export type WebCamStatusAnon = {
    callOk: boolean,
    camControlledBySycMember: boolean,
    scanAlreadyStarted: boolean
}

export type PersonalPresetAction = 'create' | 'update' | 'delete';

export type PresetCrudData = {
    preset: WebcamPersonalPreset,
    action: PersonalPresetAction
};

export type WebcamPhoto = {
    id: number,
    webcamPresetId: string,
    uuid: string,
    whenTaken: string,
    displayPresetName: string
}

export type WebcamPhotos = {
    photos: WebcamPhoto[]
}

export async function getWebCamStatus(): Promise<WebCamStatus> {
    const response = await fetch('/webcam/api/status');
    if (response.status === 401) {
        throw new NotLoggedOnError('User was not logged on. Status: ' + response.status + ' ' + response.statusText);
    } else if (!response.ok) {
        throw new Error('Network response was not ok. Status: ' + response.status + ' ' + response.statusText);
    }
    return response.json()
}


// Somewhat confusingly, because the Dahua webcam only expects HTTP GET verbs, the server side API also expects 
// HTTP GETs for API calls that change what the webcam is doing...
export async function webCamApiCall(command: WebCamCommand): Promise<WebCamStatus> {
    const commandUrl = '/webcam/api/' + command.typeid + (command.parm1 ? '/' + command.parm1 : '') + (command.parm2 ? '/' + command.parm2 : '');

    const response = await fetch(commandUrl);
    if (response.status === 401) {
        throw new NotLoggedOnError('User was not logged on. Status: ' + response.status + ' ' + response.statusText);
    } else if (!response.ok) {
        throw new Error('There was a problem when requesting control of the camera. Status: ' + response.status + ' ' + response.statusText);
    }
    return response.json()
}

export async function getWebCamStatusAnon(): Promise<WebCamStatusAnon> {
    const response = await fetch('/webcam/api/scananon');
    if (!response.ok) {
        throw new Error('Network response was not ok. Status: ' + response.status + ' ' + response.statusText);
    }
    return response.json()
}

export async function personalPreset(presetCrudData: PresetCrudData): Promise<WebCamStatus> {

    let method = '';
    if (presetCrudData.action === 'create')
        method = 'POST';
    else if (presetCrudData.action === 'update') {
        method = 'PUT';
    } else if (presetCrudData.action === 'delete') {
        method = 'DELETE';
    } else {
        console.error('Unexpected action maintaining a personal preset: ' + presetCrudData.action);
    }

    const config = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(presetCrudData.preset)
    }
    const response = await fetch('/webcam/api/personalpreset', config);
    if (response.status === 401) {
        throw new NotLoggedOnError('User was not logged on. Status: ' + response.status + ' ' + response.statusText);
    } else if (response.status === 409) {
        throw new NoMorePresetsError('No more presets available on the camera. Status: ' + response.status + ' ' + response.statusText);
    } else if (!response.ok) {
        throw new Error('There was a problem trying to maintain a personal preset on the webcam. Status: ' + response.status + ' ' + response.statusText);
    }
    return response.json()
}

export async function getWebcamPhotos(): Promise<WebcamPhotos> {

    const response = await fetch('/webcam/api/personalpresetpictures');
    if (response.status === 401) {
        throw new NotLoggedOnError('Webcam picture user was not logged on. Status: ' + response.status + ' ' + response.statusText);
    } else if (!response.ok) {
        throw new Error('There was a problem trying to retrieve webcam personal preset pictures. Status: ' + response.status + ' ' + response.statusText);
    }
    return response.json()

}