import * as assert from 'assert';
import { normalizeAxes, getDirectionFromNorth0Degrees } from '../src/utils';
import { MockGamePad } from './Mocks';
import * as mocha from 'mocha';
describe('utils.ts', () => {
    it('testing normalizeAxes', () => {
        const resultNorth = normalizeAxes(0, 1);
        const resultSouth = normalizeAxes(0, -1);
        const resultEast = normalizeAxes(1, 0);
        const resultWest = normalizeAxes(-1, 0);
        const resultNorthWest = normalizeAxes(-.5, .5);
        const resultNorthEast = normalizeAxes(.5, .5);
        const resultSouthWest = normalizeAxes(-.5, -.5);
        const resultSouthEast = normalizeAxes(.5, -.5);

        assert.strictEqual(resultNorth.power, 1);
        assert.strictEqual(resultSouth.power, 1);
        assert.strictEqual(resultEast.power, 1);
        assert.strictEqual(resultWest.power, 1);
        assert.strictEqual(resultNorthWest.power, 1);
        assert.strictEqual(resultNorthEast.power, 1);
        assert.strictEqual(resultSouthWest.power, 1);
        assert.strictEqual(resultSouthEast.power, 1);

        assert.strictEqual(resultNorth.angles.north0.degrees, 0);
        assert.strictEqual(resultSouth.angles.north0.degrees, 180);
        assert.strictEqual(resultEast.angles.north0.degrees, 90);
        assert.strictEqual(resultWest.angles.north0.degrees, 270);

        assert.strictEqual(resultNorthEast.angles.north0.degrees, 45);
        assert.strictEqual(resultNorthWest.angles.north0.degrees, 315);
        assert.strictEqual(resultSouthWest.angles.north0.degrees, 225);
        assert.strictEqual(resultSouthEast.angles.north0.degrees, 135);
    });
    it('testing getDirectionFromNorth0Degrees', () => {
        const interval = 22.5;
        const order = [];
        for(let i = 0; i < 360; i+=interval) {
            order.push(getDirectionFromNorth0Degrees(i));
        }
        console.log('order:', order);
        const expectedOrder = [
            'north',     'northeast',
            'northeast', 'east',
            'east',      'southeast',
            'southeast', 'south',
            'south',     'southwest',
            'southwest', 'west',
            'west',      'northwest',
            'northwest', 'north',
        ]

        const expectedOrder2 = [
            'north',
            'northeast',
            'east',
            'southeast',
            'south',
            'southwest',
            'west',
            'northwest',
            'north',
        ]
        const order2 = [];
        const interval2 = 45;
        for(let i = 0; i <=360; i+=interval2) {
            order2.push(getDirectionFromNorth0Degrees(i));
        }
        assert.strictEqual(order2.join(','), expectedOrder2.join());
    });
});