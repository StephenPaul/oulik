import { set } from '../src/store-creators';
import { libState } from '../src/shared-state';
import { windowAugmentedWithReduxDevtoolsImpl } from './_devtools';

describe('Root', () => {

  beforeAll(() => libState.windowObject = windowAugmentedWithReduxDevtoolsImpl);

  it('object.replace()', () => {
    const select = set({ hello: 'world', another: new Array<string>() });
    const payload = { hello: 'test', another: ['test'] };
    select()
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual({ hello: 'test', another: ['test'] });
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('object.property.update()', () => {
    const select = set({ x: 0, y: 0 });
    const payload = 3;
    select(s => s.x)
      .replace(payload);
    expect(select().read()).toEqual({ x: 3, y: 0 });
    expect(libState.currentAction).toEqual({
      type: 'x.replace()',
      replacement: payload,
    })
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('array.insert()', () => {
    const select = set(new Array<{ id: number, text: string }>());
    const payload = [{ id: 1, text: 'hello' }];
    select()
      .insert(payload);
    expect(libState.currentAction).toEqual({
      type: 'insert()',
      insertion: payload,
    })
    expect(select().read()).toEqual([{ id: 1, text: 'hello' }]);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('number.replace()', () => {
    const select = set(0);
    const payload = 3;
    select()
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(3);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('boolean.replace()', () => {
    const select = set(false);
    const payload = true;
    select()
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(payload);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('union.replace()', () => {
    type union = 'one' | 'two';
    const select = set('one' as union);
    const payload = 'two' as union;
    select()
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual(payload);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('string.replace()', () => {
    const select = set('');
    const payload = 'test';
    select()
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'replace()',
      replacement: payload,
    })
    expect(select().read()).toEqual('test');
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('replaceAll()', () => {
    const select = set(['one', 'two', 'three']);
    const payload = ['four', 'five', 'six', 'seven'];
    select()
      .replaceAll(payload);
    expect(libState.currentAction).toEqual({
      type: 'replaceAll()',
      replacement: payload,
    })
    expect(select().read()).toEqual(['four', 'five', 'six', 'seven']);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('find().replace()', () => {
    const select = set(['one', 'two', 'three']);
    const payload = 'twoo';
    select()
      .findWhere().eq('two')
      .replace(payload);
    expect(libState.currentAction).toEqual({
      type: 'find().replace()',
      replacement: payload,
      query: `element === two`,
    })
    expect(select().read()).toEqual(['one', 'twoo', 'three']);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('insert()', () => {
    const select = set(['one']);
    select()
      .insert('two');
    expect(libState.currentAction).toEqual({
      type: 'insert()',
      insertion: 'two'
    });
    expect(select().read()).toEqual(['one', 'two']);
    expect(libState.currentMutableState).toEqual(select().read());
  })

  it('find().replace()', () => {
    const select = set(['hello']);
    select().findWhere().match(/^h/).replace('another')
    expect(libState.currentAction).toEqual({
      type: 'find().replace()',
      replacement: 'another',
      query: 'element.match(/^h/)',
    });
    expect(select().read()).toEqual(['another']);
    expect(libState.currentMutableState).toEqual(select().read());
  })

});
