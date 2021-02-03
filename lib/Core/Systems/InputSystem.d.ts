import { ActionStateDatumChange, AddInputIdActionMapEvent, RemoveInputIdActionMapEvent, MappedActionToInputState, UpdatedSystemActionState, StickAngleState, MappedInputToActionStates } from "../types";
export declare abstract class InputSystem {
    private _onActionListeners;
    protected _onMappedActionAddedListeners: Array<(event: AddInputIdActionMapEvent) => void>;
    protected _onMappedActionRemovedListeners: Array<(event: RemoveInputIdActionMapEvent) => void>;
    readonly actionState: {
        [actionName: string]: boolean | number | string | StickAngleState;
    };
    private actionNames;
    protected mappedInputIdToActions: MappedInputToActionStates;
    protected mappedActionToInputIds: MappedActionToInputState;
    constructor(mappedActionToInputIds?: MappedActionToInputState);
    protected applyActionToInputMap(mappedActionToInputIds: {
        [action: string]: Array<string | number>;
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
    protected unmapInputFromAction(inputId: string | Array<string>, action: string): RemoveInputIdActionMapEvent;
    protected mapInputIdToAction(inputId: string | number | Array<string | number>, action: string | Array<string>): AddInputIdActionMapEvent;
    protected resolveActions(inputId: string | number): Array<string>;
    protected resolveInputs(action: string): Array<string | number>;
    getDuplicateInputs(): MappedActionToInputState;
}
