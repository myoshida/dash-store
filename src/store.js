/** @license dash-store (store)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { createContext, createElement, useContext, useState } from 'react';

export const createStore = initialState => ({
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
    throw new Error('dash-store: error: nested update() call -- ignored');
  }
  const { state, onChange } = store;
  store.busy = true;
  const next = store.state = fn(state);
  store.busy = false;
  onChange(store, state, next);
  return next;
};

export const update_ = (store, fn) => Promise.resolve(update(store, fn));

export const createProvider = store => ({ children = null }) => {
  const [value, setState] = useState(store.state);
  store.setState = setState;
  return createElement(store.context.Provider, { value }, children);
};

export const useStore = store => useContext(store.context);
