import { BaseMapper } from "./BaseMapper";
export declare class KeyboardMapper extends BaseMapper {
    drawUnmappedActionError: () => void;
    drawInputItem: (inputId: string, action: string) => void;
    drawActionOptionsForInput: (inputId: string) => void;
    drawInputActivated: (inputId: string) => void;
    drawInputDeactivated: (inputId: string) => void;
    constructor();
}
