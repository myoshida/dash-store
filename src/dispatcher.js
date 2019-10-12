/** @license dash-store (dispatcher)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

const useActions = store => {
  if (!store.actions) {
    store.actions = new Map();
  }
  return store.actions;
};

export const setOnDispatchHook = (store, fn) => {
  store.onDispatch = fn;
};

export const addActions = (store, addition) => {
  const actions = useActions(store);
  Object.keys(addition).forEach(k => store.actions.set(k, actions[k]));
};

export const addActionList = (store, actionList) => {
  const actions = useActions(store);
  actionList.forEach(([k, v]) => store.actions.set(k, v));
};

export const dispatch = (store, ...args) => {
  const actions = useActions(store);
  const { state, actionKey, onDispatch = null } = store;
  if (onDispatch) { onDispatch(state, args); };
  let fn = null;
  switch (typeof args[0]) {
  case 'function': fn = args.shift(); break;            // [fn, ...]
  case 'string': fn = actions.get(args.shift()); break; // ['type', ...]
  default: fn = actions.get(args[actionKey]); break;    // [{ type: ... }]
  }
  return fn ? fn.apply(null, args) : undefined;
};
