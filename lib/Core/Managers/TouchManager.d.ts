import { BaseManager } from "./BaseManager";
import { ActionStateDatumChange, ActionState } from "../types";
export declare class TouchManager extends BaseManager {
    constructor();
    update(): Array<{
        state: ActionState;
        changed: {
            [action: string]: ActionStateDatumChange;
        };
    }>;
}
