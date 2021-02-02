export type ActionStateDatumChange = { previous: boolean | number, current: boolean | number }
export type AxesRangeAction = { state: number, end: number };
export type StickEvent = { degrees: number, power: number };
export type Angles = { degrees: number, radians: number }
export type DirectionString =  'north' | 'south' | 'west' | 'east' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
export type ActionMapTypes = 'key' | 'mouse'
export type ActionState = {[action: string]: boolean | 'string' | number };
export type RemoveInputIdActionMapEvent = { inputId: string | StickInputId, action: string, actionNowUnmapped: boolean }
export type AddInputIdActionMapEvent = { inputId: string | StickInputId, action: string  }
export type MappedActionToInputState = {[action: string]: Array<string> };
export type UpdatedSystemActionState = { state: ActionState, changed: {[action: string]: ActionStateDatumChange } };
export type Action = string | Array<string>;
export type StickAction = RangedStickAction | Action
export type StickDegreeDirections = { min: number, max: number }
export type RangedStickActionDirection = StickDegreeDirections | DirectionString;

export type RangedStickAction = {
    direction: RangedStickActionDirection | Array<RangedStickActionDirection>,
    action: Action,
}

export type StickInputId = {
    index: number,
    direction?: RangedStickActionDirection,
}