/** @license dash-store (dispatcher)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

const useActions = store => {
  if (!store.actions) {
    store.actions = new Map();
  }
};

export const setOnDispatchHook = (store, fn) => {
  store.onDispatch = fn;
};

export const addActions = (store, actions) => {
  useActions(store);
  Object.keys(actions).forEach(k => store.actions.set(k, actions[k]));
};

export const addActionList = (store, actionList) => {
  useActions(store);
  actionList.forEach(([k, v]) => store.actions.set(k, v));
};

export const dispatch = (store, ...args) => {
  useActions(store);
  const { state, actions, actionKey, onDispatch = null } = store;
  if (onDispatch) { onDispatch(state, args); };
  let fn = null;
  switch (typeof args[0]) {
  case 'function': fn = args.shift(); break;            // [fn, ...]
  case 'string': fn = actions.get(args.shift()); break; // ['type', ...]
  default: fn = actions.get(args[actionKey]); break;    // [{ type: ... }]
  }
  return fn ? fn.apply(null, args) : undefined;
};
