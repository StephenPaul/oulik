import { testState } from '../src/shared-state';
import { store } from '../src/store-creators';
import { windowAugmentedWithReduxDevtoolsImpl } from './_devtools';

describe('Root', () => {

  beforeAll(() => testState.windowObject = windowAugmentedWithReduxDevtoolsImpl);

  it('object.replace()', () => {
    const select = store({ hello: 'world', another: new Array<string>() });
    const payload = { hello: 'test', another: ['test'] };
    select()
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual({ hello: 'test', another: ['test'] });
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('object.property.update()', () => {
    const select = store({ x: 0, y: 0 });
    const payload = 3;
    select(s => s.x)
      .replace(payload);
    expect(select().read()).toEqual({ x: 3, y: 0 });
    expect(testState.currentAction).toEqual({
      type: 'x.replace()',
      replacement: payload,
    })
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('array.insert()', () => {
    const select = store(new Array<{ id: number, text: string }>());
    const payload = [{ id: 1, text: 'hello' }];
    select()
      .insert(payload);
    expect(testState.currentAction).toEqual({
      type: 'insert()',
      insertion: payload,
    })
    expect(select().read()).toEqual([{ id: 1, text: 'hello' }]);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('number.replace()', () => {
    const select = store(0);
    const payload = 3;
    select()
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(3);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('boolean.replace()', () => {
    const select = store(false);
    const payload = true;
    select()
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(payload);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('union.replace()', () => {
    type union = 'one' | 'two';
    const select = store('one' as union);
    const payload = 'two' as union;
    select()
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(payload);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('string.replace()', () => {
    const select = store('');
    const payload = 'test';
    select()
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual('test');
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('replaceAll()', () => {
    const select = store(['one', 'two', 'three']);
    const payload = ['four', 'five', 'six', 'seven'];
    select()
      .replaceAll(payload);
    expect(testState.currentAction).toEqual({
      type: 'replaceAll()',
      replacement: payload,
    })
    expect(select().read()).toEqual(['four', 'five', 'six', 'seven']);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('find().replace()', () => {
    const select = store(['one', 'two', 'three']);
    const payload = 'twoo';
    select()
      .findWhere().isEqualto('two')
      .replace(payload);
    expect(testState.currentAction).toEqual({
      type: 'find().replace()',
      replacement: payload,
      where: `element === two`,
    })
    expect(select().read()).toEqual(['one', 'twoo', 'three']);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('insert()', () => {
    const select = store(['one']);
    select()
      .insert('two');
    expect(testState.currentAction).toEqual({
      type: 'insert()',
      insertion: 'two'
    });
    expect(select().read()).toEqual(['one', 'two']);
    expect(testState.currentMutableState).toEqual(select().read());
  })

  it('find().replace()', () => {
    const select = store(['hello']);
    select().findWhere().isMatchingRegex(/^h/).replace('another')
    expect(testState.currentAction).toEqual({
      type: 'find().replace()',
      replacement: 'another',
      where: 'element.match(/^h/)',
    });
    expect(select().read()).toEqual(['another']);
    expect(testState.currentMutableState).toEqual(select().read());
  })

});
