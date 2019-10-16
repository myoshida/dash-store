========================================
Getting Started
========================================

.. highlight:: console

Installation
------------

Install dash-store to your project using :command:`npm`:

::

   $ npm install dash-store --save

Or, install dash-store using :command:`yarn`:

::

   $ yarn add dash-store


Quick start example
-------------------

The following is an example to quickly grasp how to use dash-store:

.. highlight:: jsx

::

   import { createStore, update, cretateProvider } from 'dash-store';
   import { addActions, dispatch } from 'dash-store/dispatch';

   const initialState = {
     counter: 0,
   };
   export const store = createStore(initialState);
   const actions = {
     reset: () => update(s => { ...s, counter: 0 },
     inc: () => update(s => { ...s, counter: s.counter + 1 },
     dec: () => update(s => { ...s, counter: s.counter - 1 },
   };
   addActions(store, actions);
   export dispatch = dispatch.bind(null, store);
   export MyProvider = createProvider(store);

   ...

   import { useStore } from 'dash-store';
   
   const MyReactView = props => {
     const { counter } = useStore(store);
     const inc = () => dispatch('inc');
     const dec = () => dispatch('dec');
     return (
       <MyProvider>
         <div>
           <button onClick={inc}>(+)</button>
           <button onClick={dec}>(-)</button>
           <div>{counter}</div>
         </div>
       </MyProvider>
     );
   };
