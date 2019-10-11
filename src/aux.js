/** @license dash-store (aux)
 * Copyright (c) 2019 Masakazu Yoshida.
 * This source code is licensed under The MIT License (MIT).
 */

export const nextState = (state, diff) => ({ ...state, ...diff });
