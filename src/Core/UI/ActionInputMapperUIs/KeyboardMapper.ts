import { BaseMapper } from "./BaseMapper";
import { InputSystem } from "../../Systems/InputSystem";

class TestSystem extends InputSystem {
    public onClear(): void {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super();
    }
    public updateState(): void {
        throw new Error("Method not implemented.");
    }
}

export class KeyboardMapper extends BaseMapper {
    drawUnmappedActionError: () => void;
    drawInputItem: (inputId: string, action: string) => void;
    drawActionOptionsForInput: (inputId: string) => void;
    drawInputActivated: (inputId: string) => void;
    drawInputDeactivated: (inputId: string) => void;
    constructor() {
        const system = new TestSystem();
        super(system);
    }
}