import { createStore, getState, update_, nextState as next } from '../src';
import {
  setActionKey, setOnDispatchHook, addActions, addActionList, dispatch,
} from '../src/dispatch';

const store = createStore({ a: 1 });
store.getState = getState.bind(null, store);
store.update = update_.bind(null, store);
store.addActions = addActions.bind(null, store);
store.addActionList = addActionList.bind(null, store);
store.dispatch = dispatch.bind(null, store);
store.setActionKey = setActionKey.bind(null, store);

test('dispatch -> update: no-op', () => {
  const s = store.getState();
  expect(store.update(state => state)).resolves.toBe(s);
});

test('dispatch -> update: addActions', () => {
  store.addActions({
    reset: () => store.update(s => ({ ...s, a: 0 })),
    add: (opr1) => store.update(s => ({ ...s, a: s.a + opr1 })),
    addMul: (opr1, opr2) =>
      store.update(s => ({ ...s, a: (s.a + opr1) * opr2 })),
  });
  expect(store.dispatch('reset')).resolves.toEqual({ a: 0 });
  expect(store.dispatch('add', 1)).resolves.toEqual({ a: 1 });
  expect(store.dispatch('add', 2)).resolves.toEqual({ a: 3 });
  expect(store.dispatch('addMul', 1, 2)).resolves.toEqual({ a: 8 });
});

test('dispatch -> update: addActionList', () => {
  store.addActionList([]);
  store.addActionList([
    ['reset2', () => store.update(s => ({ ...s, a: 0 }))],
  ]);
  store.addActionList([
    ['add2', opr1 => store.update(s => ({ ...s, a: s.a + opr1 }))],
    ['addMul2', (opr1, opr2) =>
     store.update(s => ({ ...s, a: (s.a + opr1) * opr2 }))],
  ]);
  expect(store.dispatch('reset2')).resolves.toEqual({ a: 0 });
  expect(store.dispatch('add2', 1)).resolves.toEqual({ a: 1 });
  expect(store.dispatch('add2', 2)).resolves.toEqual({ a: 3 });
  expect(store.dispatch('addMul2', 1, 2)).resolves.toEqual({ a: 8 });
});

test('dispatch -> update: dispatch({ ... })', () => {
  store.addActionList([]);
  store.addActionList([
    ['reset3', () => store.update(s => ({ ...s, a: 0 }))],
  ]);
  store.addActionList([
    ['add3', ({ opr1 }) => store.update(s => ({ ...s, a: s.a + opr1 }))],
    ['addMul3', ({ opr1, opr2 }) =>
     store.update(s => ({ ...s, a: (s.a + opr1) * opr2 }))],
  ]);
  expect(store.dispatch({ type: 'reset3' }))
    .resolves.toEqual({ a: 0 });
  expect(store.dispatch({ type: 'add3', opr1: 1 }))
    .resolves.toEqual({ a: 1 });
  expect(store.dispatch({ type: 'add3', opr1: 2 }))
    .resolves.toEqual({ a: 3 });
  expect(store.dispatch({ type: 'addMul3', opr1: 1, opr2: 2 }))
    .resolves.toEqual({ a: 8 });
});

test('dispatch -> update: dispatch({ ... }) /w setActionKey()', () => {
  store.setActionKey('tag');
  expect(store.dispatch({ tag: 'reset3' }))
    .resolves.toEqual({ a: 0 });
  expect(store.dispatch({ tag: 'add3', opr1: 1 }))
    .resolves.toEqual({ a: 1 });
  expect(store.dispatch({ tag: 'add3', opr1: 2 }))
    .resolves.toEqual({ a: 3 });
  expect(store.dispatch({ tag: 'addMul3', opr1: 1, opr2: 2 }))
    .resolves.toEqual({ a: 8 });
});

test('dispatch: not found -> undefined', () => {
  store.setActionKey('type');
  expect(store.dispatch('not found')).toEqual(undefined);
  expect(store.dispatch({ type: 'not found' })).toEqual(undefined);
});

test('dispatch -> update: addActionList', () => {
  store.addActionList([
    ['testOnDispatch', () => store.update(s => ({ ...s, dispatch: 1 }))],
  ]);
  let __args = [];
  // set a handler
  store.dispatch('reset');
  setOnDispatchHook(store, (...args) => { __args = args; });
  expect(store.dispatch('testOnDispatch', 1, 2, 3))
    .resolves.toEqual({ a: 0, dispatch: 1 });
  expect(__args[0].state).toEqual({ a: 0, dispatch: 1 }); // must be the store
  expect(__args[1]).toEqual(['testOnDispatch', 1, 2, 3]);
  // set null
  store.dispatch('reset');
  setOnDispatchHook(store, null);
  __args = [];
  expect(store.dispatch('testOnDispatch', 1, 2, 3))
    .resolves.toEqual({ a: 0, dispatch: 1 });
  expect(__args).toEqual([]);
});
