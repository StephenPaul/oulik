import { testState } from '../src/shared-state';
import { store } from '../src/store-creators';
import { windowAugmentedWithReduxDevtoolsImpl } from './_devtools';

describe('array.find().patch()', () => {

  beforeAll(() => testState.windowObject = windowAugmentedWithReduxDevtoolsImpl);

  const initialState = {
    object: { property: '' },
    array: [{ id: 1, value: 'one' }, { id: 2, value: 'two' }, { id: 3, value: 'three' }],
  };

  it('should eq()', () => {
    const select = store(initialState);
    const payload = { value: 'new' };
    select(s => s.array)
      .findWhere(e => e.id).isEq(2)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id === 2',
    });
    expect(select(s => s.array).read()).toEqual([initialState.array[0], { ...initialState.array[1], ...payload }, initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should ne()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isNotEq(2)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id !== 2',
    });
    expect(select(s => s.array).read()).toEqual([{ ...initialState.array[0], ...payload }, initialState.array[1], initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should gt()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isMoreThan(1)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id > 1',
    });
    expect(select(s => s.array).read()).toEqual([initialState.array[0], { ...initialState.array[1], ...payload }, initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should gte()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isMoreThanOrEq(1)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id >= 1',
    });
    expect(select(s => s.array).read()).toEqual([{ ...initialState.array[0], ...payload }, initialState.array[1], initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should lt()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isLessThan(2)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id < 2',
    });
    expect(select(s => s.array).read()).toEqual([{ ...initialState.array[0], ...payload }, initialState.array[1], initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should lte()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isLessThanOrEq(2)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'id <= 2',
    });
    expect(select(s => s.array).read()).toEqual([{ ...initialState.array[0], ...payload }, initialState.array[1], initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should in()', () => {
    const select = store(initialState);
    const payload = { id: 4, value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isIn([1, 2])
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: '[1, 2].includes(id)',
    });
    expect(select(s => s.array).read()).toEqual([{ ...initialState.array[0], ...payload }, initialState.array[1], initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should ni()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.id).isNotIn([1, 2])
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: '![1, 2].includes(id)',
    });
    expect(select(s => s.array).read()).toEqual([initialState.array[0], initialState.array[1], { ...initialState.array[2], ...payload }]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('should match()', () => {
    const select = store(initialState);
    const payload = { value: 'four' };
    select(s => s.array)
      .findWhere(e => e.value).isMatching(/^t/)
      .patch(payload);
    expect(testState.currentAction).toEqual({
      type: 'array.find().patch()',
      patch: payload,
      where: 'value.match(/^t/)',
    });
    expect(select(s => s.array).read()).toEqual([initialState.array[0], { ...initialState.array[1], ...payload }, initialState.array[2]]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

});