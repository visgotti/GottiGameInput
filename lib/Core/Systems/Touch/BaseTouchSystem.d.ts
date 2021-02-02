import { InputSystem } from "../InputSystem";
export declare class BaseTouchSystem extends InputSystem {
    onClear(): void;
    constructor();
    protected mapStickRangeToAction(axesIndex: number, start: number, end: number, callback: (StickEvent: any) => void): void;
    protected mapStickToAction(axesIndex: number, callback: (StickEvent: any) => void): void;
    private makeButtonId;
    updateState(): void;
}
