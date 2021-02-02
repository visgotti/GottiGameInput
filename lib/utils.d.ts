import { Angles, DirectionString } from "./Core/types";
export declare function normalizeAxes(x: number, y: number): {
    angles?: {
        default: Angles;
        north0: Angles;
    };
    power: number;
};
export declare function isValidDirection(direction: string): boolean;
export declare function getDirectionFromNorth0Degrees(degrees: any): DirectionString;
