import { WebCamCommand, WebCamStatus } from '../apis/HttpDataApis'



export function formatMoveToPreset(presetName: string, webcamStatus: WebCamStatus): WebCamCommand {

    let typeid = 'preset';

    function getPresetNameForServer(selectedPreset: string) {
        switch (selectedPreset) {
            case 'preset-slipway': return 'pres010000';
            case 'preset-boathouse': return 'pres020000';
            case 'preset-club': return 'pres030000';
            case 'preset-lympstone': return 'pres040000';
            case 'preset-exmouth': return 'pres050000';
            case 'preset-starcross': return 'pres060000';
            case 'preset-buoy27': return 'pres070000';
            case 'preset-buoy29': return 'pres080000';
            case 'preset-buoy31': return 'pres090000';
            case 'preset-buoy33': return 'pres100000';
            case 'preset-buoy25': return 'pres130000';
            case 'preset-buoy18': return 'pres140000';
            case 'preset-buoy23': return 'pres150000';
            case 'preset-buoy19': return 'pres160000';
            case 'preset-buoy20': return 'pres170000';
            case 'preset-personal-1': {
                return '' + webcamStatus.personalPresets[0].webcamPresetIndex;
            }
            case 'preset-personal-2': {
                return '' + webcamStatus.personalPresets[1].webcamPresetIndex;
            }
            case 'preset-scan-estuary': {
                typeid = 'scan';
                return 'none';
            }
            default: return 'pres010000';
        }
    }

    const parm1 = getPresetNameForServer(presetName);

    const parm2 = 'none';

    return { typeid, parm1, parm2 };
}

export function formatMove(direction: string, moveAmount: number): WebCamCommand {

    const typeid = 'move';

    function getDirectionNameForServer(directionName: string) {
        switch (directionName) {
            case 'up': return 'up';
            case 'right-up-up': return 'ur';
            case 'right-up': return 'ur';
            case 'right-right-up': return 'ur';
            case 'right': return 'rt';
            case 'right-right-down': return 'dr';
            case 'right-down': return 'dr';
            case 'right-down-down': return 'dr';
            case 'down': return 'dn';
            case 'left-down-down': return 'dl';
            case 'left-down': return 'dl';
            case 'left-left-down': return 'dl';
            case 'left': return 'lf';
            case 'left-left-up': return 'ul'
            case 'left-up': return 'ul'
            case 'left-up-up': return 'ul'
            default: {
                console.error('Invalid compass movement of ' + directionName + ' specified. Moving right!')
                return 'right';
            }
        }
    }

    const parm1 = getDirectionNameForServer(direction);
    const parm2 = 'X' + moveAmount;  // Forcing to be a "known string" for temporary re-use of existing web API endpoint

    return { typeid, parm1, parm2 };
}