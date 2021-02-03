import { InputSystem } from "../InputSystem";
import { StickAction, RemoveInputIdActionMapEvent } from "../../types";
declare type FormattedStickActionLookup = {
    actions?: Array<string>;
    stringDirections?: {
        north?: Array<string>;
        south?: Array<string>;
        east?: Array<string>;
        west?: Array<string>;
        northwest?: Array<string>;
        northeast?: Array<string>;
        southwest?: Array<string>;
        southeast?: Array<string>;
    };
    degreeDirections?: Array<{
        min: number;
        max: number;
        actions: Array<string>;
    }>;
};
export declare abstract class BaseControllerSystem extends InputSystem {
    gamepad: Gamepad;
    private buttonIndexIdMap;
    stickActionCount: {
        [action: string]: number;
    };
    private _onMappedStickActionAddedListeners;
    private _onMappedStickActionRemovedListeners;
    readonly mappedStickRotationActions: {
        [stickIndex: number]: Array<{
            start: number;
            end: number;
            callback: (rotation: number, power: number) => void;
        }>;
    };
    readonly mappedAxesActions: {
        [axesIndex: number]: Array<{
            start: number;
            end: number;
            callback: (rotation: number) => void;
        }>;
    };
    readonly mappedStickActions: {
        press: Array<FormattedStickActionLookup>;
        move: Array<FormattedStickActionLookup>;
    };
    readonly trackedStickActions: Array<{
        press: Array<string>;
        move: Array<string>;
    }>;
    constructor(gamepad: Gamepad, state: any);
    onClear(): void;
    protected wasTrueLookup: {
        [action: string]: boolean;
    };
    abstract isPowerBtn(buttonIndex: number): boolean;
    abstract isStickPressed(stickIndex: number): boolean;
    abstract applyControllerState(state: any): void;
    protected mapStickRangeToAction(axesIndex: number, start: number, end: number, callback: (StickEvent: any) => void): void;
    protected unmapInputFromAction(inputId: string, action: string): RemoveInputIdActionMapEvent;
    unmapStickFromAction(stickIndex: number, stickAction: StickAction, press: boolean): void;
    private actionIsMapped;
    private getStickActionLookup;
    private validateStickActionType;
    private updateStickActionCount;
    mapStickToAction(stickIndex: number, stickAction: StickAction, press: boolean): void;
    updateState(): void;
    private validateMinMax;
    protected updateStickState(angles: any, power: any, direction: string, stickMap: FormattedStickActionLookup): void;
}
export {};
