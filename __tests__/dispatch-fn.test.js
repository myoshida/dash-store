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


const reset = () => store.update(s => ({ a: 0 }));
const add = (opr1) => store.update(s => ({ ...s, a: s.a + opr1 }));
const addMul = (opr1, opr2) =>
      store.update(s => ({ ...s, a: (s.a + opr1) * opr2 }));

test('dispatch -> update: functions as actions (unofficial)', () => {
  store.dispatch(reset);
  expect(store.getState()).toEqual({ a: 0 });
  store.dispatch(add, 1);
  expect(getState(store)).toEqual({ a: 1 });
  store.dispatch(add, 2);
  expect(getState(store)).toEqual({ a: 3 });
  store.dispatch(addMul, 1, 2);
  expect(getState(store)).toEqual({ a: 8 });
});

test('dispatch -> update: functions as actions (unofficial) [form2]', () => {
  store.dispatch([reset]);
  expect(store.getState()).toEqual({ a: 0 });
  store.dispatch([add, 1]);
  expect(getState(store)).toEqual({ a: 1 });
  store.dispatch([add, 2]);
  expect(getState(store)).toEqual({ a: 3 });
  store.dispatch([addMul, 1, 2]);
  expect(getState(store)).toEqual({ a: 8 });
});
