export declare type ActionStateDatumChange = {
    previous: boolean | number;
    current: boolean | number;
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
export declare type ActionMapTypes = 'key' | 'mouse';
export declare type ActionState = {
    [action: string]: boolean | 'string' | number;
};
export declare type RemoveInputIdActionMapEvent = {
    inputId: string | StickInputId;
    action: string;
    actionNowUnmapped: boolean;
};
export declare type AddInputIdActionMapEvent = {
    inputId: string | StickInputId;
    action: string;
};
export declare type MappedActionToInputState = {
    [action: string]: Array<string>;
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
export declare type RangedStickAction = {
    direction: RangedStickActionDirection | Array<RangedStickActionDirection>;
    action: Action;
};
export declare type StickInputId = {
    index: number;
    direction?: RangedStickActionDirection;
};
