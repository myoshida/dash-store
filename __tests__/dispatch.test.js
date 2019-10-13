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
  store.update(state => state);
  expect(store.getState()).toBe(s);
});

test('dispatch -> update: addActions', () => {
  store.addActions({
    reset: () => store.update(s => ({ a: 0 })),
    add: (opr1) => store.update(s => ({ ...s, a: s.a + opr1 })),
    addMul: (opr1, opr2) =>
      store.update(s => ({ ...s, a: (s.a + opr1) * opr2 })),
  });
  store.dispatch('reset');
  expect(store.getState()).toEqual({ a: 0 });
  store.dispatch('add', 1);
  expect(store.getState()).toEqual({ a: 1 });
  store.dispatch('add', 2);
  expect(store.getState()).toEqual({ a: 3 });
  store.dispatch('addMul', 1, 2);
  expect(store.getState()).toEqual({ a: 8 });
});

test('dispatch -> update: addActionList', () => {
  store.addActionList([]);
  store.addActionList([
    ['reset2', () => store.update(s => ({ a: 0 }))]
  ]);
  store.addActionList([
    ['add2', opr1 => store.update(s => ({ ...s, a: s.a + opr1 }))],
    ['addMul2', (opr1, opr2) =>
     store.update(s => ({ ...s, a: (s.a + opr1) * opr2 }))],
  ]);
  store.dispatch('reset2');
  expect(store.getState()).toEqual({ a: 0 });
  store.dispatch('add2', 1);
  expect(store.getState()).toEqual({ a: 1 });
  store.dispatch('add2', 2);
  expect(store.getState()).toEqual({ a: 3 });
  store.dispatch('addMul2', 1, 2);
  expect(store.getState()).toEqual({ a: 8 });
});

test('dispatch -> update: dispatch({ ... })', () => {
  store.addActionList([]);
  store.addActionList([
    ['reset3', () => store.update(s => ({ a: 0 }))],
  ]);
  store.addActionList([
    ['add3', ({ opr1 }) => store.update(s => ({ ...s, a: s.a + opr1 }))],
    ['addMul3', ({ opr1, opr2 }) =>
     store.update(s => ({ ...s, a: (s.a + opr1) * opr2 }))],
  ]);
  store.dispatch({ type: 'reset3' });
  expect(store.getState()).toEqual({ a: 0 });
  store.dispatch({ type: 'add3', opr1: 1 });
  expect(store.getState()).toEqual({ a: 1 });
  store.dispatch({ type: 'add3', opr1: 2 });
  expect(store.getState()).toEqual({ a: 3 });
  dispatch({ type: 'addMul3', opr1: 1, opr2: 2 });
});

test('dispatch: not found -> undefined', () => {
  expect(store.dispatch('not found')).toEqual(undefined);
  expect(store.dispatch({ type: 'not found' })).toEqual(undefined);
});
