===================
Core JavaScript API
===================

.. highlight:: jsx

In this section we describe the core JavaScript API of
dash-store.


createStore
----------------

::
   
   import { createStore } from 'dash-store';
   const store = createStore( initialState );

This function creates a store with the initial state and returns it.

Example:

::

   import { createStore, update, cretateProvider } from 'dash-store';

   const initialState = {
     counter: 0,
   };
   export const store = createStore(initialState);


getState
----------------

::
   
   import { getState } from 'dash-store';
   const state = getState(store);

This function returns the current state of the store.


update
-----------

::

   import { update } from 'dash-store';
   update(store, fn);

   //  fn: state -> state

Synchronously updates the state of the store with a updater
function. Updater functions takes the single argument as
the previous state and retruns the updated state.
So they have the signature (previous state -> next
state):

When you use a JavaScript Object to store your application's state,
it is stronglly recommend to functional update to update the state,
something like this::

  update(store, state => { ...state, prop: <new_value> });

The code above creates a sharrow copy of the current state (an
Object), then mutate the copy with designated props,
and returns it as the next state.
In this manner, the original state stays immutable.

.. hint::

   You can bind a specific store you cretated to ``update`` function
   and get a specialized version of ``update``::

     const store = createStore({ counter: 0 })
     const update = update.bind(null, store);

     update(state => { ...state, counter: state.counter + 1 })

Example:

::

   const initialState = {
     counter: 0,
   };
   const store = createStore(initialState);

   const actions = {
     reset: () => update(s => { ...state, counter: 0 },
     inc: () => update(s => { ...state, counter: state.counter + 1 },
     dec: () => update(s => { ...state, counter: state.counter - 1 },
   };


createProvider
--------------

::

   import { createProvider } from 'dash-store';
   const MyProvider = createProvider(store)

This function creates a React context Provider component which provids
the state of the store as its context value.

Example:

::

   const MyProvider = createProvider(store);

   const MyApp = props => (
     <MyProvider>
       <MyComponents>...</MyComponents>
     </MyProvider>
   );

   const container = document.getElementById('contents')
   ReactDOM.render(<MyApp />, container);

   
useStore
--------

::

   import { useState } from 'dash-store';
   const state = useState(store);

Returns the latest state value of the store.  Actually, this function
is a thin wrapper of the React useContext.  Please note that you
should place a Provider component (returned by createProvider) above
in the component tree.

Example:

::

   import { myStore } form '.../myStore'

   const MyComponent = props => {
     const state = useStore(myStore);
     ...
   };


addOnChangeHook
---------------

::

   import { addOnChangeHook } from 'dash-store';
   addOnChangeHook(store, hookFun);

Adds the function ``hookFunc`` as an onChange hook to the store. Hook
functiions should have the signature::

   store -> (previous) state -> (next) state -> unit

You may add more than one hook to the store.  In that case, those
registered hooks will be called in the order of additiion. For
example::

   addOnChangeHook(store, f1);
   addOnChangeHook(store, f2);
   addOnChangeHook(store, f3);

   // call order: f1() -> f2() -> f3() ...

Example:

::

   // The following code logging changes of the store with
   // console.log.

   addOnChangeHook(store, (store, prevState, nextState) => {
     console.log('store update:', prevState, nextState);
   });
