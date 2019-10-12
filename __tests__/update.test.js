import { createStore, getState, update_, nextState as next } from '../src';

const store = createStore({ a: 1 });
store.getState = getState.bind(null, store);
store.update = update_.bind(null, store);

test('update: no-op', () => {
  const s = store.getState();
  expect(store.update(state => state)).resolves.toBe(s);
});

test('update: update', () => {
  const s = store.getState();
  expect(
    store.update(state => next(state, { b: 2 }))
  ).resolves.toEqual({ a: 1, b: 2 });
});

test('update: sequential 1', () => {
  expect(
    store.update(state => ({ a: 10, b: 11, c: 3 }))
      .then(() => {
        return store.update(state => next(state, { a: 20, b: 21 }));
      })
  ).resolves.toEqual({ a: 20, b: 21, c: 3 });
});

test('update: sequential 2', () => {
  expect(
    store.update(state => ({ a: 0, b: 1 }))
      .then(() => {
        return store.update(state => next(state, { a: 1, c: 2 }));
      })
      .then(() => {
        return store.update(state => next(state, { a: 2, d: 3 }));
      })
  ).resolves.toEqual({ a: 2, b: 1, c: 2, d: 3 });
});

test('update: prepare for queuing', () => {
  const s = { a: 0 };
  expect(
    store.update(state => s)
  ).resolves.toBe(s);
});
test('update: queuing', () => {
  store.update(state => next(state, { a: 1, a0: state.a, b: 2 }));
  store.update(state => next(state, { a: 2, a1: state.a, c: 3 }));
  store.update(state => next(state, { a: 3, a2: state.a, d: 4 }));
  store.update(state => next(state, { a: 4, a3: state.a, e: 5 }));
  expect(
    store.update(state => next(state, { a: 5, a4: state.a, e: 5 }))
  ).resolves.toEqual({
    a: 5, a0: 0, a1: 1, a2: 2, a3: 3, a4: 4, b: 2, c: 3, d: 4, e: 5,
  });
});

test('update: prepare for nesting', () => {
  const s = { a: 0 };
  return expect(
    store.update(state => s)
  ).resolves.toBe(s);
});
test('update: nesting', () => {
  expect(() => {
    store.update(state => {
      store.update(state => {
        store.update(state => {
          store.update(state => {
            store.update(state => {
              return next(state, { a: 5, a4: state.a, e: 5 });
            });
            return next(state, { a: 4, a3: state.a, e: 5 });
          });
          return next(state, { a: 3, a2: state.a, d: 4 });
        });
        return next(state, { a: 2, a1: state.a, c: 3 });
      });
      return next(state, { a: 1, a0: state.a, b: 2 });
    });
  })
    .toThrow();
  /*
    .resolves.toEqual({
      a: 5, a0: 0, a1: 1, a2: 2, a3: 3, a4: 4, b: 2, c: 3, d: 4, e: 5 });
  */
});
