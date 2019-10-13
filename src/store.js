/** @license dash-store (store)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { createContext, createElement, useContext, useState } from 'react';

/**
 * Creates a store with the initial state and returns it.
 */
export const createStore = (initialState = {}) => ({
  state: initialState,
  busy: false,
  context: createContext(/* undefined */),
  setState: null,
  onChange: (store, _prev, _next) => {
    if (store.setState) store.setState(store.state);
  },
});

/**
 * Adds the function <fn> as an onChange hook to the store. The
 * functiion should have the signature:
 *
 *   store -> state -> state -> unit
 *
 * You may add more than one hook to the store.  In that case, those
 * registered hooks will be called in the order of additiion. For
 * example:
 *
 *   addOnChangeHook(store, f1);
 *   addOnChangeHook(store, f2);
 *   addOnChangeHook(store, f3);
 *
 *   // call order: f1() -> f2() -> f3() ...
 */
export const addOnChangeHook = (store, fn) => {
  const { onChange } = store;
  store.onChange = (store, prev, next) => {
    onChange(store, prev, next);
    fn(store, prev, next);
  };
};

/** Returns the current state of the store. */
export const getState = store => store.state;

/**
 * Synchronously updates the store with a updater function. Updater
 * functions should have the signature (previous -> next):
 *
 *   state -> state
 */
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

/**
 * (INTERNAL USE ONLY) Another version of update() which returns a
 * Promise which resolves to the latest state of the store.
 */
export const update_ = (store, fn) => Promise.resolve(update(store, fn));

/** Creates a React context Provider component which provids the state
 *   of the store as its context value.
 */
export const createProvider = store => ({ children = null }) => {
  const [value, setState] = useState(store.state);
  store.setState = setState;
  return createElement(store.context.Provider, { value }, children);
};

/**
 * Returns the latest state value of the store.  Actually, this
 * function is a thin wrapper of the React useContext.  Please note
 * that you should place a Provider component (returned by
 * createProvider) above in the component tree.
 */
export const useStore = store => useContext(store.context);

/**
 * Creates a sub-store aggregator (an updater function) which is
 * compatible with onChange handler interface.  The state of the
 * sub-store will appear as [propkey] prop in the parent's state.
 * Please note that this function assumes the parent's state is
 * represented as a JavaScript Object like { prop: value, ... }.
 *
 * Example:
 *
 *   const store = createStore(...);  // the root store
 *   const subst = createStore(...);  // a sub-store directly under the root
 *   addOnChangeHandler(
 *     subst, createSubstoreAggregator(store, subst, 'subst')
 *   );

 * In the example above, the state of the sub-store subst will appear
 * as the prop 'subst' in store.state.
 */
export const createSubstoreAggregator = (store, substore, propkey) => {
  update(store, state => ({ ...state, [propkey]: substore.getState() }));
  return (_store, _prev, next) =>
    update(store, state => ({ ...state, [propkey]: next }));
};

/**
 * (INTERNAL USE ONLY) Returns the updated (next) state object.  This
 * function functionally updates <state> with the prop(s) designated
 * in <diff>.
 *
 * Example:

 *   const state = { a: 1, b: 2, c: 3 };
 *   const next = nextState(state, { c: 0, d: 4 });
 *   state;  // -> { a: 1, b: 2, c: 3 }
 *   next;   // -> { a: 1, b: 2, c: 0, d: 4 }
 */
export const nextState = (state, diff) => ({ ...state, ...diff });
