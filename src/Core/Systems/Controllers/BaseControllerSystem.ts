import { InputSystem } from "../InputSystem";
import { StickAction, AddInputIdActionMapEvent, RemoveInputIdActionMapEvent, RangedStickAction, StickInputId } from "../../types";
import { isValidDirection } from "../../../utils";

type FormattedStickActionLookup = {
    actions?: Array<string>,
    stringDirections?: {
        north?: Array<string>,
        south?: Array<string>,
        east?: Array<string>,
        west?:Array<string>,
        northwest?: Array<string>,
        northeast?: Array<string>,
        southwest?: Array<string>,
        southeast?: Array<string>,
    },
    degreeDirections?: Array<{ min: number, max: number, actions: Array<string> }>
}

export class BaseControllerSystem extends InputSystem {
    public gamepad: Gamepad;
    private buttonIndexIdMap: Array<string>;

    private stickActionCount: {[action: string] : number } = {}

    private _onMappedStickActionAddedListeners: Array<(event: StickAction) => void> = [];
    private _onMappedStickActionRemovedListeners: Array<(event: StickAction) => void> = [];


    readonly mappedStickRotationActions: {[stickIndex: number]: Array<{ start: number, end: number, callback: (rotation: number, power: number) => void }>} = {};
    readonly mappedAxesActions: {[axesIndex: number]: Array<{ start: number, end: number, callback: (rotation: number) => void }>} = {};
    readonly mappedStickActions: { press: Array<FormattedStickActionLookup>, move: Array<FormattedStickActionLookup> } = { press: [], move: [] };

    constructor(gamepad: Gamepad, state: any) {
        super();
        this.gamepad = gamepad;
    }
    public onClear(): void {}
    protected mapStickRangeToAction(axesIndex: number, start: number, end: number, callback: (StickEvent) => void) {
        this.mappedStickRotationActions[axesIndex]
    }
    public isStickPressed(stickIndex: number) : boolean {
        return false;
    }
    protected unmapInputFromAction(inputId: string, action: string) : RemoveInputIdActionMapEvent {
        const actions = this.mappedInputIdToActions[inputId];
        if(typeof actions === 'undefined') {
            throw new Error(`The inputId ${inputId} was not mapped to any action.`)
        }
        const eventData : RemoveInputIdActionMapEvent = { inputId, action, actionNowUnmapped: false };
        const idx1 = actions.indexOf(action);
        if(idx1 < 0) {
            throw new Error(`The inputId ${inputId} was not mapped to action ${action}.`)
        }
        actions.splice(idx1, 1);
        if(!actions.length) {
            delete this.mappedInputIdToActions[inputId];
        }
        const idx = this.mappedActionToInputIds[action].indexOf(inputId);
        if(idx < 0) throw new Error(`Index should be greater than -1`);
        this.mappedActionToInputIds[action].splice(idx, 1);
        if(!this.mappedActionToInputIds[action].length) {
            delete this.mappedActionToInputIds[action];
        }
        this._onMappedActionRemovedListeners.forEach(l => l(eventData));
        return eventData;
    }

    public unmapStickFromAction(stickIndex: number, stickAction: StickAction, press: boolean) {
        if(Array.isArray(stickAction)) {
            stickAction.forEach(a => {
                this.unmapStickFromAction(stickIndex, stickAction, press);
            })
            return;
        }
        const type = this.validateStickActionType(stickAction);
        const stickActions = this.getStickActionLookup(stickIndex, press, false);
        const inputId : StickInputId = { index: stickIndex };
        const eventData : RemoveInputIdActionMapEvent = { inputId, actionNowUnmapped: false, action: '' };
        let actionString;
        if(type === 'string') {
            actionString = stickAction;
            const idx = stickActions.actions.indexOf(actionString);
            if(idx < 0) throw new Error(`Expected`)
            stickActions.actions.splice(idx, 1);
            if(!stickActions.actions.length) {
                delete stickActions.actions;
            }
            eventData.action = actionString;
            this.updateStickActionCount(actionString, false)
            eventData.actionNowUnmapped = !this.actionIsMapped(actionString);
            this._onMappedActionRemovedListeners.forEach(l => l(eventData));
        } else {
            stickAction = (<RangedStickAction>stickAction)
            actionString = stickAction.action;
            const directions = Array.isArray(stickAction.direction) ? stickAction.direction : [stickAction.direction];
            directions.forEach(direction => {
                inputId.direction = direction;
                if(typeof direction === 'string') {
                    const idx = stickActions.stringDirections[direction].indexOf(actionString);
                    if(idx < 0) throw new Error(`Action ${actionString} was not mapped to direction ${direction} on the ${stickIndex} stick`);
                    stickActions.stringDirections[direction].splice(idx, 1);
                    if(!stickActions.stringDirections[direction].length) {
                        delete stickActions.stringDirections[direction];
                        if(!(Object.keys(stickActions.stringDirections).length)) {
                            delete stickActions.stringDirections;
                        }
                    }
                } else {
                    const { min, max } = direction;
                    const found = stickActions.degreeDirections.find(d => d.min == min && d.max == d.max && d.actions.includes(actionString));
                    if(!found) throw new Error(`Action ${actionString} was not mapped to direction min max: ${direction} on the ${stickIndex} stick`);
                    found.actions.splice(found.actions.indexOf(actionString), 1);
                    if(!found.actions.length) {
                        stickActions.degreeDirections.splice(stickActions.degreeDirections.indexOf(found), 1);
                        if(!stickActions.degreeDirections.length) {
                            delete stickActions.degreeDirections;
                        }
                    }
                }
                this.updateStickActionCount(actionString, false)
                eventData.action = actionString;
                eventData.actionNowUnmapped = !this.actionIsMapped(actionString);
                this._onMappedActionRemovedListeners.forEach(l => l(eventData));
            })
        }
    }
    private actionIsMapped(action: string) : boolean {
        if(this.stickActionCount[action]) {
            return true;
        }
        if(this.mappedActionToInputIds[action]?.length) {
            return true;
        }
        return false;
    }
    private getStickActionLookup(stickIndex: number, isPress: boolean, createIfNotAdded=true) : FormattedStickActionLookup {
        const key = isPress ? 'press' : 'move';
        if(!this.mappedStickActions[key][stickIndex]) {
            if(createIfNotAdded) {
                this.mappedStickActions[key][stickIndex] = {};
            } else {
                throw new Error(`Expected to have index`)
            }
        }
        return this.mappedStickActions[key][stickIndex];
    }
    private validateStickActionType(stickAction: StickAction) : 'string' | 'object' {
        const type = typeof stickAction;
        if(type !== 'string' && type !== 'object') {
            throw new Error(`Invalid action type: ${stickAction}`)
        }
        return type
    }

    private updateStickActionCount(action: string, add: boolean) {
        if(add) {
            if(!this.stickActionCount[action]) {
                this.stickActionCount[action] = 1;
            } else {
                this.stickActionCount[action]++;
            }
        } else {
            this.stickActionCount[action]--;
            if(!this.stickActionCount[action]) {
                delete this.stickActionCount[action];
            }
        }
    }

    public mapStickToAction(stickIndex: number, stickAction: StickAction, press: boolean) {
        console.error('mapping', stickIndex, stickAction);
        if(Array.isArray(stickAction)) {
            stickAction.forEach(a => {
                this.mapStickToAction(stickIndex, stickAction, press);
            })
            return;
        }
        const type = this.validateStickActionType(stickAction);
        const stickActions = this.getStickActionLookup(stickIndex, press, true);
        const inputId : StickInputId = { index: stickIndex };
        const eventData : AddInputIdActionMapEvent = { inputId, action: '' };
        let actionString;
        if(type === 'string') {
            actionString = stickAction;
            if(!stickActions.actions) {
                stickActions.actions = [actionString];
            } else {
                stickActions.actions.push(actionString);
            }
            eventData.action = actionString;
            this.updateStickActionCount(actionString, true)
            this._onMappedActionAddedListeners.forEach(l => l(eventData));
        } else {
            stickAction = (<RangedStickAction>stickAction)
            actionString = stickAction.action;
            const directions = Array.isArray(stickAction.direction) ? stickAction.direction : [stickAction.direction];
            directions.forEach(direction => {
                inputId.direction = direction;
                if(typeof direction === 'string') {
                    if(!isValidDirection(direction)) {
                        throw new Error(`Invalid direction string ${direction}`)
                    }
                    if(!stickActions.stringDirections) {
                        stickActions.stringDirections = {[direction]: [actionString]}
                    } else if (!stickActions.stringDirections[direction]) {
                        stickActions.stringDirections[direction] = [actionString];
                    } else {
                        stickActions.stringDirections[direction].push(actionString);
                    }
                } else {
                    const { min, max } = direction;
                    this.validateMinMax(min, max)
                    if(!stickActions.degreeDirections) {
                        stickActions.degreeDirections = [{ min, max, actions: [actionString] }]
                    } else {
                        const found = stickActions.degreeDirections.find(d => d.min == min && d.max == max);
                        if(found) {
                            found.actions.push(actionString);
                        }else {
                            stickActions.degreeDirections.push({ min, max, actions: [actionString]});
                            stickActions.degreeDirections.sort((aa, bb) => {
                                const aaMin = aa.min || 0;
                                const bbMin = bb.min || 0;
                                return aaMin - bbMin;
                            });
                        }
                    }
                }
                this.updateStickActionCount(actionString, true)
                eventData.action = actionString;
                this._onMappedActionAddedListeners.forEach(l => l(eventData));
            })
        }
    }

    private makeButtonId(btnIndex: number) : string {
        return `button_${btnIndex}`
    }
    public updateState(): void {
        this.gamepad.buttons.forEach((b, i) => {
            const resolvedBtnActions = super.resolveActions(this.makeButtonId(i));
            resolvedBtnActions?.forEach(a => {
                super.actionState[a] = b.pressed;
            })
        });
    }
    private validateMinMax(min?: number, max?: number) {
        const hasMin =min !== undefined && min !== null;
        const hasMax = max !== undefined && max !== null;

        if(hasMin) {
            if(min < 0 || min > 360) {
                throw new Error(`Invalid degree value, must be 0-360`)
            }
        }
        if(hasMax) {
            if(max < 0 || max > 360) {
                throw new Error(`Invalid degree value, must be 0-360`)
            }
        }
        if(hasMax && hasMin) {
            if(min >= max) {
                throw new Error(`Min should be less than max.`)
            }
        }
    }
}