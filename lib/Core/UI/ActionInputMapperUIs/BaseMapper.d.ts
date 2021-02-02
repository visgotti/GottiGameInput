/// <reference types="pixi.js" />
import { InputSystem } from "../../Systems/InputSystem";
export declare abstract class BaseMapper extends PIXI.Container {
    private system;
    constructor(system: InputSystem);
    abstract drawUnmappedActionError: () => void;
    abstract drawInputItem: (inputId: string, action: string) => void;
    abstract drawActionOptionsForInput: (inputId: string) => void;
    abstract drawInputActivated: (inputId: string) => void;
    abstract drawInputDeactivated: (inputId: string) => void;
    private handleMappedActionAdded;
    private handleMappedActionRemoved;
}
