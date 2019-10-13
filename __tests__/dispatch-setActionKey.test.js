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

store.addActions({
  reset: () => {
    return store.update(s => ({ a: 0 }));
  },
  add: ({ opr1 }) => store.update(s => ({ ...s, a: s.a + opr1 })),
  addMul: ({ opr1, opr2 }) =>
    store.update(s => ({ ...s, a: (s.a + opr1) * opr2 })),
});

test('dispatch -> update: setActionKey (default === type)', () => {
  store.setActionKey('type');
  dispatch(store, { type: 'reset' });
  expect(getState(store)).toEqual({ a: 0 });
  dispatch(store, { type: 'add', opr1: 1 });
  expect(getState(store)).toEqual({ a: 1 });
  dispatch(store, { type: 'add', opr1: 2 });
  expect(getState(store)).toEqual({ a: 3 });
  dispatch(store, { type: 'addMul', opr1: 1, opr2: 2 });
  expect(getState(store)).toEqual({ a: 8 });
});

test('dispatch -> update: setActionKey => tag', () => {
  store.setActionKey('tag');
  dispatch(store, { tag: 'reset' });
  expect(getState(store)).toEqual({ a: 0 });
  dispatch(store, { tag: 'add', opr1: 1 });
  expect(getState(store)).toEqual({ a: 1 });
  dispatch(store, { tag: 'add', opr1: 2 });
  expect(getState(store)).toEqual({ a: 3 });
  dispatch(store, { tag: 'addMul', opr1: 1, opr2: 2 });
  expect(getState(store)).toEqual({ a: 8 });
});

test('dispatch -> update: setActionKey => type', () => {
  store.setActionKey('type');
  dispatch(store, { type: 'reset' });
  expect(getState(store)).toEqual({ a: 0 });
  dispatch(store, { type: 'add', opr1: 1 });
  expect(getState(store)).toEqual({ a: 1 });
  dispatch(store, { type: 'add', opr1: 2 });
  expect(getState(store)).toEqual({ a: 3 });
  dispatch(store, { type: 'addMul', opr1: 1, opr2: 2 });
  expect(getState(store)).toEqual({ a: 8 });
});
