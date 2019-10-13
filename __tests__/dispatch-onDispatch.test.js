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

store.addActionList([
  ['reset', () => store.update(s => ({ a: 0 }))],
  ['testOnDispatch', () => store.update(s => ({ ...s, dispatch: 1 }))],
]);

test('dispatch -> update: onDispatch', () => {
  let __args = [];
  store.dispatch('reset');
  expect(store.getState()).toEqual({ a: 0 });
  // set: hook
  setOnDispatchHook(store, (...args) => {
    __args = args;
  });
  store.dispatch('testOnDispatch', 1, 2, 3);
  expect(__args[0].state).toEqual({ a: 0, dispatch: 1 });
  expect(__args[1]).toEqual(['testOnDispatch', 1, 2, 3]);
  store.dispatch('reset');
  // set: null
  setOnDispatchHook(store, null);
  __args = [];
  store.dispatch('testOnDispatch', 1, 2, 3);
  expect(__args).toEqual([]);
});
