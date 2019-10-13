/** @license dash-store (store)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { createContext, createElement, useContext, useState } from 'react';

export const createStore = (initialState = {}) => ({
  state: initialState,
  busy: false,
  context: createContext(/* undefined */),
  setState: null,
  onChange: (store, _prev, _next) => {
    if (store.setState) store.setState(store.state);
  },
});

export const addOnChangeHook = (store, fn) => {
  const { onChange } = store;
  store.onChange = (store, prev, next) => {
    onChange(store, prev, next);
    fn(store, prev, next);
  };
};

export const getState = store => store.state;

export const update = (store, fn) => {
  if (store.busy) {
    throw new Error('dash-store: error: nested update() call');
  }
  const { state, onChange } = store;
  store.busy = true;
  const next = store.state = fn(state);
  store.busy = false;
  onChange(store, state, next);
  return next;
};

/** (INTERNAL USE ONLY) Another version of update() which returns a
    Promise which resolves to the latest state of the store.
 */
export const update_ = (store, fn) => Promise.resolve(update(store, fn));

export const createProvider = store => ({ children = null }) => {
  const [value, setState] = useState(store.state);
  store.setState = setState;
  return createElement(store.context.Provider, { value }, children);
};

export const useStore = store => useContext(store.context);

/** Creates a sub-store aggregator (an updater function) which is
    compatible with onChange handler interface.  The state of the
    sub-store will appear as [key] prop in the parent's state.  Please
    note that this function assumes the parent's state is represented
    as a JavaScript Object.

    Example:

    const store = createStore(...);
    const substore = createStore(...);
    addOnChangeHandler(
      subst,
      createSubstoreAggregator(store, substore, 'subst')
    );
 */
export const createSubstoreAggregator = (store, substore, key) => {
  update(store, state => ({ ...state, [key]: substore.getState() }));
  return (_store, _prev, next) =>
    update(store, state => ({ ...state, [key]: next }));
};

/** (INTERNAL USE ONLY) Returns the updated (next) state object.  This
    function functionally updates <state> with the prop(s) designated
    in <diff>.

    Example:

    const state = { a: 1, b: 2, c: 3 };
    const next = nextState(state, { c: 0, d: 4 });
    state;  // -> { a: 1, b: 2, c: 3 }
    next;   // -> { a: 1, b: 2, c: 0, d: 4 }
 */
export const nextState = (state, diff) => ({ ...state, ...diff });
