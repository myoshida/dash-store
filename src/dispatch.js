/** @license dash-store/dispatch
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

export const dispatch = (store, ...args_) => {
  const [map, key, ondispatch] = useDispatch(store);
  if (ondispatch) {
    ondispatch(store, args_.slice()/* duplicate args */);
  };
  // when args is something like [[...]], transform [[...]] -> [...]
  const args = (args_.length === 1 && Array.isArray(args_[0])) ?
        args_[0] : args_;
  let fn = null;
  switch (typeof args[0]) {
  case 'function':  // [fn, ...]
    fn = args.shift();
    break;

  case 'string':  // ['action', ...]
    const action = args.shift();
    fn = map.get(action);
    if (!fn) {
      console.warn('dash-store/dispatch: unknown action:', action);
    }
    break;

  default: // [{ [key]: 'action', ... }]
    if (args.length === 1 && typeof args[0] === 'object' && args[0]) {
      if (!key in args[0]) {
        console.warn('dash-store/dispatch: missing action key:', key);
      } else {
        fn = map.get(args[0][key]);
        if (!fn) {
          console.warn('dash-store/dispatch: unknown action:', args[0][key]);
        }
      }
      break;
    }
    console.warn('dash-store/dispatch: unknown format:', args);
  }
  return fn ? fn.apply(null, args) : undefined;
};
