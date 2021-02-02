import { InputSystem } from "../Systems/InputSystem";
import { ActionState, ActionStateDatumChange } from "../types";
export declare abstract class BaseManager {
    readonly managedSystems: Array<InputSystem>;
    readonly _systemListeners: {
        'add': Array<(system: InputSystem) => void>;
        'remove': Array<(system: InputSystem) => void>;
    };
    constructor();
    update(): Array<{
        state: ActionState;
        changed: {
            [action: string]: ActionStateDatumChange;
        };
    }>;
    clear(): void;
    abstract onUpdate(): void;
    abstract onClear(): void;
    emit(eventname: 'remove' | 'add', system: InputSystem): void;
    addSystem(system: InputSystem): void;
    removeSystem(system: InputSystem): void;
    on(eventname: 'remove' | 'add', cb: (system: InputSystem) => void): void;
    off(eventname: 'remove' | 'add', cb: (system: InputSystem) => void): void;
}
