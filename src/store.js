/** @license dash-store (store)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { createContext, createElement, useContext, useState } from 'react';

export const createStore = initialState => ({
  state: initialState,
  queue: [],
  busy: false,
  context: createContext(/* undefined */),
  setState: null,
  onChange: store => { if (store.setState) store.setState(store.state); },
});

export const getState = store => store.state;

export const addOnChangeHook = (store, fn) => {
  const { onChange } = store;
  store.onChange = (store, prevState, nextState) => (
    onChange(store, prevState, nextState),
    fn(store, prevState, nextState)
  );
};

export const update = (store, fn) => {
  const { state: prevState, queue, onChange } = store;
  const loop = nextState => {
    if (queue.length === 0) {
      if (prevState !== nextState) {
        store.state = nextState;
        onChange(store, prevState, nextState);
      }
      store.busy = false;
      return nextState;
    }
    const nextFn = queue.shift();
    if (queue.length === 0) {
      return Promise.resolve(loop(nextFn(nextState)));  // shortcut
    }
    return Promise.resolve(nextFn(nextState)).then(state => loop(state));
  };

  queue.push(fn);
  if (!store.busy) {
    store.busy = true;
    store.promise = loop(store.state);
  }
  return store.promise;
};

export const createProvider = store => ({ children = null }) => {
  const [value, setState] = useState(store.state);
  store.setState = setState;
  return createElement(store.context.Provider, { value }, children);
};

export const useStore = store => useContext(store.context);
