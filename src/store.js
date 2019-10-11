/** @license dash-store (store)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { createContext, createElement, useContext, useState } from 'react';
import { addActions, dispatch } from './dispatcher';

export const createStore = (initialState, opts = {}) => {
  const noop = () => null;
  const {
    key = 'main', actionKey = 'type', onDispatch = noop, onUpdate = noop,
  } = opts;
  const store = {
    key,
    context: createContext(initialState),
    setState: noop,
    aggregate: noop,
    state: initialState,
    queue: [],
    engaged: false,
    actions: new Map(),
    actionKey,
    onDispatch,
    onUpdate,
  };
  store.getState = () => store.state;
  store.addActions = addActions.bind(null, store);
  store.dispatch = dispatch.bind(null, store);
  store.update = update.bind(null, store);
  return store;
};

export const getState = store => store.state;

export const update = (store, fn) => {
  const {
    key, setState, aggregate, state: prevState, queue, engaged, onUpdate,
  } = store;
  const loop = state => {
    if (queue.length === 0) {
      if (prevState !== state) {
        onUpdate(key, prevState, state);
        setState(store.state = state);
        aggregate(state);
      }
      store.engaged = false;
      return state;
    }
    const fn = queue.shift();
    return queue.length === 0 ?
      Promise.resolve(loop(fn(state))) /* shortcut */ :
      Promise.resolve(fn(state)).then(state => loop(state));
  };
  queue.push(fn);
  if (!engaged) {
    store.engaged = true;
    store.promise = loop(prevState);
  }
  return store.promise;
};

export const createProvider = store => ({ children = null }) => {
  const [value, setState] = useState(store.state);
  store.setState = setState;
  return createElement(store.context.Provider, { value }, children);
};

export const useStore = store => useContext(store.context);

export const addSubstore = (store, substore, aggregate = null) => {
  substore.aggregate = aggregate ? aggregate : substate =>
    update(store, state => ({ ...state, [substore.key]: substate }));
};
