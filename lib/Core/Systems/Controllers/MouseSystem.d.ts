import { InputSystem } from "../InputSystem";
import { MappedActionToInputState } from "../../types";
export declare class MouseSystem extends InputSystem {
    private actionsFinished;
    private actionsStarted;
    constructor(state?: MappedActionToInputState);
    updateState(): void;
    private handleMouseMove;
    private handleMouseDown;
    private handleMouseUp;
    onClear(): void;
}
