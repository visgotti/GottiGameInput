import { BaseControllerSystem } from '../BaseControllerSystem';
import { normalizeAxes, getDirectionFromNorth0Degrees } from '../../../../utils';
export class DefaultController extends BaseControllerSystem {
    constructor(gamepad: Gamepad, state?: any) {
        super(gamepad, state);
        if(state) {
            for(let action in state.default.sticks.left) {
                this.mapStickToAction(0, { action, direction: state.default.sticks.left[action] }, false);
            }
        }
    }
    public updateState(): void {
        super.updateState();
        const updateStickState = (stickIndex, isPressed) => {
            const movedMap = this.mappedStickActions.move[stickIndex];
            const pressedMap = this.mappedStickActions.press[stickIndex];
            if(movedMap) {
                const stickX = parseFloat(this.gamepad.axes[stickIndex*2].toFixed(2));
                const stickY = parseFloat((this.gamepad.axes[stickIndex*2+1]*-1).toFixed(2)) ;
                const { angles, power } = normalizeAxes(stickX, stickY);
                if(power) {
                    const dir22 = getDirectionFromNorth0Degrees(angles.north0.degrees);
                    console.log('dir was:', dir22, angles.north0.degrees)
                    console.log('y was', this.gamepad.axes[stickIndex*2+1])
                }

                if(!power) {
                    if(movedMap.degreeDirections) {
                        movedMap.degreeDirections.forEach(d => {
                            d.actions.forEach(a => {
                                this.actionState[a] = false;
                            });
                        });
                    }
                    if(movedMap.stringDirections) {
                        const keys = Object.keys(movedMap.stringDirections);
                        keys.forEach(k => {
                            movedMap.stringDirections[k].forEach(a => {
                                this.actionState[a] = false
                            })
                        });
                    }
                    // make all false.
                } else {
                    const { degrees } = angles.north0;
                    const dir = getDirectionFromNorth0Degrees(degrees);
                    if(movedMap.stringDirections) {
                        const keys = Object.keys(movedMap.stringDirections);
                        keys.forEach(k => {
                            movedMap.stringDirections[k].forEach(a => {
                                this.actionState[a] = k === dir
                            })
                        });
                    }
                    if(movedMap.degreeDirections) {
                        const matched = movedMap.degreeDirections.forEach(d => {
                            d.actions.forEach(a => {
                                this.actionState[a] = (!d.min || d.min <= degrees) && (!d.max || d.max >= degrees)
                            });
                        });
                    }
                    if(isPressed) {
                        if(pressedMap.stringDirections) {
                            const keys = Object.keys(pressedMap.stringDirections);
                            keys.forEach(k => {
                                pressedMap.stringDirections[k].forEach(a => {
                                    this.actionState[a] = k === dir
                                })
                            });
                        }
                        if(pressedMap.degreeDirections) {
                            const matched = pressedMap.degreeDirections.forEach(d => {
                                d.actions.forEach(a => {
                                    this.actionState[a] = (!d.min || d.min <= degrees) && (!d.max || d.max >= degrees)
                                });
                            });
                        }
                    }
                }
            }
        }
        updateStickState(0, this.isStickPressed(0));
        updateStickState(1, this.isStickPressed(1));
    }
}