import { ActionStateDatumChange, AddInputIdActionMapEvent, RemoveInputIdActionMapEvent, MappedActionToInputState, UpdatedSystemActionState } from "../types";

type ActionState = {[actionName: string]: boolean | number }

// type: 'controller' | 'mouse' | 'keyboard' | 'touch'

export abstract class InputSystem {
    private _onActionListeners: {[actionName: string]: Array<(event: ActionStateDatumChange) => void>} = {}
    protected _onMappedActionAddedListeners: Array<(event: AddInputIdActionMapEvent) => void> = [];
    protected _onMappedActionRemovedListeners: Array<(event: RemoveInputIdActionMapEvent) => void> = [];

    readonly actionState: {[actionName: string]: boolean } = {};
    private actionNames: Array<string> = [];

    protected mappedInputIdToActions: MappedActionToInputState = {};
    protected mappedActionToInputIds: MappedActionToInputState = {};
  //   protected mappedActionToOrderedInputCombos : {[action: string]: Array<string>}
  //  protected mappedActionToUnorderedInputCombos : {[action: string]: Array<string>}
    // protected inputToActionCombos : {[inputId: string]: Array<actionCombo> }

    constructor(mappedActionToInputIds?: MappedActionToInputState) {
        mappedActionToInputIds && this.applyActionToInputMap(mappedActionToInputIds);
    }
    protected applyActionToInputMap(mappedActionToInputIds: {[action: string]: Array<string> }) {
        if(!this.validateActionToInputMap(mappedActionToInputIds)) throw new Error(`Invalid.`);
        for(let action in mappedActionToInputIds) {
            this.addActionState(action, false);
            mappedActionToInputIds[action].forEach(input => {
                this.mapInputIdToAction(input, action);
            });
        }
    }
    public getMappedActionInputs() : MappedActionToInputState {
        return { ...this.mappedActionToInputIds };
    }
    private validateActionToInputMap(mappedActionToInputIds: {[action: string]: Array<string> }) : boolean {
        //todo:... make sure nothing gets removed when it shouldnt.
        return true;
    }
    public abstract onClear() : void;
    public abstract updateState() : void;

    public update() : UpdatedSystemActionState {
        const prevState = { ...this.actionState };
        this.updateState();
        let changed : {[action:string]: ActionStateDatumChange }  = null;
        for(let i = 0; i < this.actionNames.length; i++) {
            const curAction = this.actionNames[i];
            const previous = prevState[curAction];
            const current = this.actionState[curAction]
            if(previous !== current) {
                changed = changed || {};
                const changeObj = { previous, current };
                changed[curAction] = changeObj;
                this._onActionListeners[curAction]?.forEach(l => l(changeObj));
            }
        }
        return { state: this.actionState, changed };
    }

    public getUnmappedActions() : Array<string> {
        return this.actionNames.filter(n => {
            return !(n in this.mappedActionToInputIds);
        })
    }

    protected handleActionChange(actionName: string, value: boolean) {
        if(!(actionName in this.actionState)) throw new Error(`Invalid action changed ${actionName}`)
    }
    public addActionState(action: string, value=false) {
        if(action in this.actionState) throw new Error(`Already added action ${action}`);
        this.actionState[action] = value;
        this.actionNames = Object.keys(this.actionState);
    }
    public removeActionState(action: string) {
        if(!(action in this.actionState)) throw new Error(`No action added: ${action}`);
        delete this.actionState[action];
        this.actionNames = Object.keys(this.actionState);
    }
    public onActionChange(actionName: string, cb: (event: ActionStateDatumChange) => void) {
        if(this._onActionListeners[actionName]) {
            this._onActionListeners[actionName].push(cb);
        } else {
            this._onActionListeners[actionName] = [cb]
        }
    }
    public offActionChange(actionName: string, cb: (event: ActionStateDatumChange) => void) {
        const listeners = this._onActionListeners[actionName];
        if(listeners) {
            const idx = listeners.indexOf(cb)
            idx > -1 && listeners.splice(idx, 1);
            if(!listeners.length) {
                delete this._onActionListeners[actionName];
            }
        }
    }
    public onMappedActionAdded(cb: (event: AddInputIdActionMapEvent) => void) : number {
        return this._onMappedActionAddedListeners.push(cb);
    }
    public offMappedActionAdded(cb: (payload: AddInputIdActionMapEvent) => void) : number {
        const idx = this._onMappedActionAddedListeners.push(cb);
        idx > -1 && this._onMappedActionAddedListeners.splice(idx, 1);
        return this._onMappedActionAddedListeners.length;
    }
    public onMappedActionRemoved(cb: (event: RemoveInputIdActionMapEvent) => void) : number {
        return this._onMappedActionRemovedListeners.push(cb);
    }
    public offMappedActionRemoved(cb: (payload: RemoveInputIdActionMapEvent) => void) : number {
        const idx = this._onMappedActionRemovedListeners.indexOf(cb)
        idx > -1 && this._onMappedActionRemovedListeners.splice(idx, 1);
        return this._onMappedActionRemovedListeners.length;
    }

    protected unmapInputFromAction(inputId: string, action: string) : RemoveInputIdActionMapEvent {
        const actions = this.mappedInputIdToActions[inputId];
        if(typeof actions === 'undefined') {
            throw new Error(`The inputId ${inputId} was not mapped to any action.`)
        }
        const eventData : RemoveInputIdActionMapEvent = { inputId, action, actionNowUnmapped: false };
        const idx1 = actions.indexOf(action);
        if(idx1 < 0) {
            throw new Error(`The inputId ${inputId} was not mapped to action ${action}.`)
        }
        actions.splice(idx1, 1);
        if(!actions.length) {
            delete this.mappedInputIdToActions[inputId];
        }
        const idx = this.mappedActionToInputIds[action].indexOf(inputId);
        if(idx < 0) throw new Error(`Index should be greater than -1`);
        this.mappedActionToInputIds[action].splice(idx, 1);
        if(!this.mappedActionToInputIds[action].length) {
            delete this.mappedActionToInputIds[action];
        }
        this._onMappedActionRemovedListeners.forEach(l => l(eventData));
        return eventData;
    }

    protected mapInputIdToAction(inputId: string, action: string) : AddInputIdActionMapEvent{
        const eventData : AddInputIdActionMapEvent = { action, inputId };
        const cur = this.mappedInputIdToActions[inputId];
        if(cur?.includes(action)) return;
        if(!this.mappedInputIdToActions[inputId]) {
            this.mappedInputIdToActions[inputId] = [action];
        } else {
            this.mappedInputIdToActions[inputId].push(action);
        }
        if(!this.mappedActionToInputIds[action]) {
            this.mappedActionToInputIds[action] = [inputId];
        } else {
            this.mappedActionToInputIds[action].push(inputId);
        }
        this._onMappedActionAddedListeners.forEach(l => l(eventData));
        return eventData;
    }
    protected resolveActions(inputId: string) : Array<string> {
        return this.mappedInputIdToActions[inputId];
    }
    protected resolveInputs(action: string) : Array<string> {
        return this.mappedActionToInputIds[action];
    }
    public getDuplicateInputs() : MappedActionToInputState {
        const dup = {};
        Object.keys(this.mappedInputIdToActions).forEach(k => {
            if(this.mappedActionToInputIds[k].length > 1) {
                dup[k] =this.mappedActionToInputIds[k];
            }
        })
        return dup;
    }
}