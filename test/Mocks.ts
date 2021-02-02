import { BaseControllerSystem } from '../src/Core/Systems/Controllers/BaseControllerSystem';
export class MockGamePad implements Gamepad {
    readonly axes: ReadonlyArray<number>;
    readonly buttons: ReadonlyArray<GamepadButton>;
    readonly connected: boolean;
    readonly hand: GamepadHand;
    readonly hapticActuators: ReadonlyArray<GamepadHapticActuator>;
    readonly id: string;
    readonly index: number;
    readonly mapping: GamepadMappingType;
    readonly pose: GamepadPose | null;
    readonly timestamp: number;
    constructor() {
        this.axes = [0.0, 0.0, 0.0, 0.0];
        this.timestamp = Date.now();
        this.connected = true;
        this.buttons = [...new Array(10)].map(b => { return { pressed: false, touched: false, value: 0.0 } });
    }
}

export class MockControllerSystem extends BaseControllerSystem {
    constructor() {
        super(new MockGamePad());
    }
}