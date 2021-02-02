import { BaseControllerSystem } from '../Systems/Controllers/BaseControllerSystem';
import { BaseManager } from './BaseManager';
export declare class ControllerManager extends BaseManager {
    readonly needsPolling: boolean;
    readonly trackedSystemArray: Array<BaseControllerSystem>;
    readonly initializedSystemArray: Array<BaseControllerSystem>;
    private state;
    constructor(state?: any);
    onClear(): void;
    onUpdate(): void;
    init(): void;
    private handleGamePadConnected;
    private handleGamePadDisconnected;
    private pollGamepads;
    private controllerSystemFactory;
}
