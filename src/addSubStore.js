/** @license dash-store (addSubStore)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

import { addOnChangeHook, update } from './store';

export const addSubStore = (store, subStore, key, onAggregate = null) => {
  const fn = onAggregate ? onAggregate :
        () => update(store, state => ({ ...state, [key]: subStore.state }));
  addOnChangeHook(subStore, fn);
};
export default addSubStore;
