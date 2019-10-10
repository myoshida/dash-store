import { createContext, createElement, useContext, useState } from 'react';

export const getState = store => store.state;

export const addActions = (store, actions) =>
  Object.keys(actions).forEach(k => store.actions.set(k, actions[k]));

export const dispatch = (store, ...args) => {
  const { key, state, actions, actionKey, onDispatch } = store;
  onDispatch(key, state, args);
  let fn = null;
  switch (typeof args[0]) {
  case 'function': fn = args.shift(); break;            // [fn, ...]
  case 'string': fn = actions.get(args.shift()); break; // ['type', ...]
  default: fn = actions.get(args[actionKey]); break;    // [{ type: ... }]
  }
  return fn ? fn.apply(null, args) : undefined;
};

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

export const next = (state, diff) => ({ ...state, ...diff });

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
export default createStore;
