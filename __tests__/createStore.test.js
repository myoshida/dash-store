import { createStore, getState } from '../src';

test('createStore: initialState', () => {
  let store = createStore({ a: 1, b: 2 });
  expect(getState(store)['a']).toBe(1);
  expect(getState(store)['b']).toBe(2);
});
