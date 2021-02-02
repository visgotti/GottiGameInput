import { MappedActionToInputState, UpdatedSystemActionState } from "./types";
export declare class GameInput {
    private keyboardSystem;
    private mouseSystem;
    private controllerManager;
    private touchSystem;
    updateController: () => Array<UpdatedSystemActionState>;
    updateKeyboard: () => UpdatedSystemActionState;
    updateTouch: () => UpdatedSystemActionState;
    updateMouse: () => UpdatedSystemActionState;
    private interfaceIsOpen;
    constructor(mappedInputStates?: {
        keyboard?: MappedActionToInputState;
        mouse?: MappedActionToInputState;
        controller: any;
    }, disableOpts?: {
        controller?: boolean;
        mouse?: boolean;
        keyboard?: boolean;
        touch?: boolean;
    });
    update(): {
        keyboard: UpdatedSystemActionState;
        mouse: UpdatedSystemActionState;
        controller: Array<UpdatedSystemActionState>;
        touch: UpdatedSystemActionState;
    };
    updateOnlyMouse(): void;
    updateOnlyTouch(): void;
    private registerSystemHandlers;
    private initializeKeyboardSystem;
    private initializeTouchManager;
    private initializeMouseManager;
    private initializeControllerManager;
}
