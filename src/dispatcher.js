/** @license dash-store (dispatch)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

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

export const addActions = (store, actions) =>
  Object.keys(actions).forEach(k => store.actions.set(k, actions[k]));

export const addActionList = (store, actionList) =>
  actionList.forEach(([k, v]) => store.actions.set(k, v));
