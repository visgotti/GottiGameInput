export declare type ActionStateDatumChange = {
    previous: boolean | number | any;
    current: boolean | number | any;
};
export declare type AxesRangeAction = {
    state: number;
    end: number;
};
export declare type StickEvent = {
    degrees: number;
    power: number;
};
export declare type Angles = {
    degrees: number;
    radians: number;
};
export declare type DirectionString = 'north' | 'south' | 'west' | 'east' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
export declare type DirectionalActionObject = {
    north?: Action;
    south?: Action;
    west?: Action;
    east?: Action;
};
export declare type ActionMapTypes = 'key' | 'mouse';
export declare type ActionState = {
    [action: string]: boolean | StickAngleState;
};
export declare type RemoveInputIdActionMapEvent = {
    inputId: string | number | StickInputId;
    action: string;
    actionNowUnmapped: boolean;
};
export declare type AddInputIdActionMapEvent = {
    inputId: string | number | StickInputId;
    action: string;
};
export declare type MappedActionToInputState = {
    [action: string]: Array<string | number>;
};
export declare type MappedInputToActionStates = {
    [inputId in string | number]: Array<string>;
};
export declare type UpdatedSystemActionState = {
    state: ActionState;
    changed: {
        [action: string]: ActionStateDatumChange;
    };
};
export declare type Action = string | Array<string>;
export declare type StickAction = RangedStickAction | Action;
export declare type StickDegreeDirections = {
    min: number;
    max: number;
};
export declare type RangedStickActionDirection = StickDegreeDirections | DirectionString;
export declare type StickAngleState = {
    angles?: {
        default: Angles;
        north0: Angles;
    };
    power: number;
};
export declare type RangedStickAction = {
    direction: RangedStickActionDirection | Array<RangedStickActionDirection>;
    action: Action;
};
export declare type StickInputId = {
    index: number;
    direction?: RangedStickActionDirection;
};
export declare type DefaultControllerStickState = {
    left: StickAction;
    leftPress: StickAction;
    right?: StickAction;
    rightPress?: StickAction;
};
export declare type DefaultTriggerState = {
    l1: Action;
    l2: Action;
    r1: Action;
    r2: Action;
};
export declare type DefaultControllerButtonState = {
    select: Action;
    start: Action;
    north: Action;
    south: Action;
    east: Action;
    west: Action;
};
export declare type DefaultControllerState = {
    buttons: DefaultControllerButtonState;
    sticks: DefaultControllerStickState;
    triggers: DefaultTriggerState;
    dpad: DirectionalActionObject | Array<DirectionalActionObject>;
};
