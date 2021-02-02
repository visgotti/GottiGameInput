import { InputSystem } from "../InputSystem";
import { MappedActionToInputState } from "../../types";

export class KeyboardSystem extends InputSystem {
    private actionsFinished : Array<string> = [];
    private actionsStarted : Array<string> = [];
    constructor(state: MappedActionToInputState) {
        super(state);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
    }
    public updateState(): void {
        this.actionsFinished.forEach(a => {
            this.actionState[a] = false;
        });
        this.actionsStarted.forEach(a => {
            this.actionState[a] = true;
        })
        this.actionsStarted.length = 0;
        this.actionsFinished.length = 0;
    }
    private handleKeyDown(event: KeyboardEvent) {
        const actions = this.resolveActions(event.code);
        actions && this.actionsStarted.push(...actions);
    }
    private handleKeyUp(event: KeyboardEvent) {
        const actions = this.resolveActions(event.code);
        actions && this.actionsFinished.push(...actions);
    }
    public onClear(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
}