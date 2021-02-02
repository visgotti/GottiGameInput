import * as assert from 'assert';
import { normalizeAxes, getDirectionFromNorth0Degrees } from '../src/utils';
import { MockControllerSystem } from './Mocks';
import * as mocha from 'mocha';

let mockSystem : MockControllerSystem;

describe('BaseControllerSystem.ts', () => {
    beforeEach(() => {
        mockSystem = new MockControllerSystem();
    });
    describe('testing string action mapping ', () => {
        it('tests simple move action', () => {
            let asserted = false;
            mockSystem.onMappedActionAdded(event => {
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0 });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, 'test', false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                actions: ['test']
            }])
            assert.strictEqual(asserted, true);
        });
        it('tests simple move action unmaps correctly', () => {
            let asserted = false;
            mockSystem.onMappedActionRemoved(event => {
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0 });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, 'test', false);
            mockSystem.unmapStickFromAction(0, 'test', false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{}])
            assert.strictEqual(asserted, true);
        });
    });
    describe('testing directional string action mapping ', () => {
        it('tests single direction for single move action', () => {
            let asserted = false;
            mockSystem.onMappedActionAdded(event => {
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: 'west' });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, {direction: 'west', action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                stringDirections: { 'west': ['test']}
            }])
            assert.strictEqual(asserted, true);
        });
        it('tests unmapping of single direction for single move action', () => {
            let asserted = false;
            mockSystem.onMappedActionRemoved(event => {
                assert.strictEqual(event.actionNowUnmapped, true);
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: 'west' });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, {direction: 'west', action: 'test'}, false);
            mockSystem.unmapStickFromAction(0, {direction: 'west', action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{}])
            assert.strictEqual(asserted, true);
        });
        it('tests multiple directions for single move action', () => {
            let asserted = 0;
            mockSystem.onMappedActionAdded(event => {
                const expectedDirection = asserted === 0 ? 'west' : 'east';
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: expectedDirection });
                asserted++;
            });
            mockSystem.mapStickToAction(0, {direction: ['west', 'east'], action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                stringDirections: { 'west': ['test'], 'east': ['test'] }
            }])
            assert.strictEqual(asserted, 2);
        });
        it('tests unmapping of single direction after adding 2 directions should still have 1', () => {
            let asserted = false;
            mockSystem.onMappedActionRemoved(event => {
                assert.strictEqual(event.action, 'test');
                assert.strictEqual(event.actionNowUnmapped, false);
                assert.deepStrictEqual(event.inputId, { index: 0, direction: 'west' });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, {direction: ['west', 'east'], action: 'test'}, false);
            mockSystem.unmapStickFromAction(0, {direction: 'west', action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                stringDirections: { 'east': ['test'] }
            }])
            assert.strictEqual(asserted, true);
        });
        it('tests unmapping of multiple directions after adding 2 directions should still have 1', () => {
            let asserted = 0;
            mockSystem.onMappedActionRemoved(event => {
                const expectedDirection = asserted === 0 ? 'west' : 'east';
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: expectedDirection });
                asserted++;
            });
            mockSystem.mapStickToAction(0, {direction: ['west', 'east'], action: 'test'}, false);
            mockSystem.unmapStickFromAction(0, {direction: ['west', 'east'], action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{}])
            assert.strictEqual(asserted, 2);
        });
    });
    describe('testing directional min max degree action mapping ', () => {
        it('tests single direction for single move action', () => {
            let asserted = false;
            mockSystem.onMappedActionAdded(event => {
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: { min: 0, max: 360 } });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, {direction: { min: 0, max: 360 }, action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                degreeDirections: [{ min: 0, max: 360, actions: ['test'] }],
            }])
            assert.strictEqual(asserted, true);
        });
        it('tests unmapping of single direction for single move action', () => {
            let asserted = false;
            mockSystem.onMappedActionRemoved(event => {
                assert.strictEqual(event.actionNowUnmapped, true);
                assert.strictEqual(event.action, 'test');
                assert.deepStrictEqual(event.inputId, { index: 0, direction: { min: 0, max: 360 } });
                asserted = true;
            });
            mockSystem.mapStickToAction(0, {direction: { min: 0, max: 360 }, action: 'test'}, false);
            mockSystem.unmapStickFromAction(0, {direction: { min: 0, max: 360 }, action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{}])
            assert.strictEqual(asserted, true);
        });
        it('tests multiple directions for single move action and sorts them in expected order', () => {
            let asserted = 0;
            mockSystem.onMappedActionAdded(event => {
                assert.strictEqual(event.action, 'test');
                if(asserted === 0) {
                    assert.deepStrictEqual(event.inputId, { index: 0, direction: { min: 60, max: 360 } });
                } else {
                    assert.deepStrictEqual(event.inputId, { index: 0, direction: { min: 20, max: 50 } });
                }
                asserted++;
            });
            mockSystem.mapStickToAction(0, {direction: [{ min: 60, max: 360 }, {min: 20, max: 50 }], action: 'test'}, false);
            assert.deepStrictEqual(mockSystem['mappedStickActions'].move, [{
                degreeDirections: [{ min: 20, max: 50, actions: ['test'] }, { min: 60, max: 360, actions: ['test'] }],
            }]);
            assert.strictEqual(asserted, 2);
        });
    });
});