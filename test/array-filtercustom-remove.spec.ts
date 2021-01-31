import { set } from '../src/core';
import { tests } from '../src/tests';
import { windowAugmentedWithReduxDevtoolsImpl } from './_devtools';

describe('array.filterCustom().remove()', () => {

  beforeAll(() => tests.windowObject = windowAugmentedWithReduxDevtoolsImpl);

  const initialState = {
    object: { property: '' },
    array: [{ id: 1, value: 'one' }, { id: 2, value: 'two' }, { id: 3, value: 'three' }],
  };

  it('should eq()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => e.id === 2;
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[1]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[0], initialState.array[2]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should ne()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => e.id !== 2;
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[0], initialState.array[2]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[1]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should gt()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => e.id > 1;
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[1], initialState.array[2]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[0]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should lt()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => e.id < 2;
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[0]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[1], initialState.array[2]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should in()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => [1, 2].includes(e.id);
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[0], initialState.array[1]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[2]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should ni()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => ![1, 2].includes(e.id);
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[2]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[0], initialState.array[1]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

  it('should match()', () => {
    const get = set(initialState);
    const query = (e: typeof initialState['array'][0]) => /^t/.test(e.value);
    get(s => s.array)
      .filterCustom(query)
      .remove();
    expect(tests.currentAction).toEqual({
      type: 'array.filterCustom().remove()',
      toRemove: [initialState.array[1], initialState.array[2]],
      query: query.toString(),
    });
    expect(get(s => s.array).read()).toEqual([initialState.array[0]]);
    expect(tests.currentMutableState).toEqual(get().read());
  })

});