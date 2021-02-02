import { ActionStateDatumChange, AddInputIdActionMapEvent, RemoveInputIdActionMapEvent, MappedActionToInputState, UpdatedSystemActionState } from "../types";
export declare abstract class InputSystem {
    private _onActionListeners;
    protected _onMappedActionAddedListeners: Array<(event: AddInputIdActionMapEvent) => void>;
    protected _onMappedActionRemovedListeners: Array<(event: RemoveInputIdActionMapEvent) => void>;
    readonly actionState: {
        [actionName: string]: boolean;
    };
    private actionNames;
    protected mappedInputIdToActions: MappedActionToInputState;
    protected mappedActionToInputIds: MappedActionToInputState;
    constructor(mappedActionToInputIds?: MappedActionToInputState);
    protected applyActionToInputMap(mappedActionToInputIds: {
        [action: string]: Array<string>;
    }): void;
    getMappedActionInputs(): MappedActionToInputState;
    private validateActionToInputMap;
    abstract onClear(): void;
    abstract updateState(): void;
    update(): UpdatedSystemActionState;
    getUnmappedActions(): Array<string>;
    protected handleActionChange(actionName: string, value: boolean): void;
    addActionState(action: string, value?: boolean): void;
    removeActionState(action: string): void;
    onActionChange(actionName: string, cb: (event: ActionStateDatumChange) => void): void;
    offActionChange(actionName: string, cb: (event: ActionStateDatumChange) => void): void;
    onMappedActionAdded(cb: (event: AddInputIdActionMapEvent) => void): number;
    offMappedActionAdded(cb: (payload: AddInputIdActionMapEvent) => void): number;
    onMappedActionRemoved(cb: (event: RemoveInputIdActionMapEvent) => void): number;
    offMappedActionRemoved(cb: (payload: RemoveInputIdActionMapEvent) => void): number;
    protected unmapInputFromAction(inputId: string, action: string): RemoveInputIdActionMapEvent;
    protected mapInputIdToAction(inputId: string, action: string): AddInputIdActionMapEvent;
    protected resolveActions(inputId: string): Array<string>;
    protected resolveInputs(action: string): Array<string>;
    getDuplicateInputs(): MappedActionToInputState;
}
