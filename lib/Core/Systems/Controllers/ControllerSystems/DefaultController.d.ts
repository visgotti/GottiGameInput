import { BaseControllerSystem } from '../BaseControllerSystem';
import { DefaultControllerState, DefaultControllerStickState, DirectionalActionObject, DefaultTriggerState, DefaultControllerButtonState } from '../../../types';
export declare class DefaultController extends BaseControllerSystem {
    constructor(gamepad: Gamepad, state?: DefaultControllerState);
    protected applyControllerTriggers(triggers: DefaultTriggerState): void;
    protected applyControllerSticks(sticks: DefaultControllerStickState): void;
    applyControllerDPad(dpad: DirectionalActionObject | Array<DirectionalActionObject>): void;
    isPowerBtn(buttonIndex: number): boolean;
    applyControllerState(state: DefaultControllerState): void;
    applyControllerButtons(buttons: DefaultControllerButtonState): void;
    isStickPressed(stickIndex: number): boolean;
    updateState(): void;
}
