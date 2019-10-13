/** @license dash-store (dispatcher)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

const useDispatch = store => {
  if (!store._dispatch) {
    store._dispatch = [new Map(), 'type', null];
  }
  return store._dispatch;
};

export const setActionKey = (store, key) => {
  useDispatch(store);
  store._dispatch[1] = key;
};

export const setOnDispatchHook = (store, fn) => {
  useDispatch(store);
  store._dispatch[2] = fn;
};

export const addActions = (store, addition) => {
  const [map, _key, _ondispatch] = useDispatch(store);
  Object.keys(addition).forEach(k => map.set(k, addition[k]));
};

export const addActionList = (store, addition) => {
  const [map, _key, _ondispatch] = useDispatch(store);
  addition.forEach(([k, v]) => map.set(k, v));
};

export const dispatch = (store, ...args) => {
  const [map, key, ondispatch] = useDispatch(store);
  if (ondispatch) { ondispatch(store, args.slice()/* duplicate args */); };
  let fn = null;
  switch (typeof args[0]) {
  case 'function': fn = args.shift(); break;        // [fn, ...]
  case 'string': fn = map.get(args.shift()); break; // ['action', ...]
  default:  // [{ type: 'action', ... }]
    if (args.length === 1 && typeof args[0] === 'object' && args[0]) {
      fn = map.get(args[0][key]); break;
    }
    console.error('dash-store/dispatch: unknown format:', args);
  }
  return fn ? fn.apply(null, args) : undefined;
};
