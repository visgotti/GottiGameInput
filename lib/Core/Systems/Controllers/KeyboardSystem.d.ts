import { InputSystem } from "../InputSystem";
import { MappedActionToInputState } from "../../types";
export declare class KeyboardSystem extends InputSystem {
    private actionsFinished;
    private actionsStarted;
    constructor(state: MappedActionToInputState);
    updateState(): void;
    private handleKeyDown;
    private handleKeyUp;
    onClear(): void;
}
