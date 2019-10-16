===========================
Supplemental dispatcher API
===========================

.. highlight:: jsx

In this section we describe the supplemental dispatcher API of
dash-store.

.. warning::

   For the time being, this dispatcher API is experimental and subject
   to change.


.. _dispatch:

dispatch
--------

::
   
   import { dispatch } from 'dash-store/dispatch';

   dispatch(store, { type: 'actionTag', ... });  // from (1)
   dispatch(store, 'actionTag', args...);  // form (2)
   dispatch(store, ['actionTag', args...]);  // form (3)

This function dispatches a specific action designated by
``actionTag`` (string symbols looks like ``'reset'``).

The dispatch function recognizes a several different dispatching
conventions.

In the form (1), actions to dispatch are represented a JavaScript
Object.  The action type will be determined by a property named such
as ``type``, and the function of the action will be called by the
following convention:

::

   dispatch(store, { type: 'actionTag', ... });  // form (1)
   // ↓
   fn({ type: 'actionTag', ... });

.. note::

   The default propery key for actionTags is ``type``.  You can change
   this by :ref:`setActionKey`.

In the form (2), actions are represented similar to the oridinal
function call.  The action type will be determined by the second
argument ``actionTag``.  the function of the action will be called by
the following convention:

::

   dispatch(store, 'actionTag', args...);  // form (2)
   // ↓
   fn(args...);

The form (3) is simliar to the form (2).  The difference to the
form (2) is that ``actionTag`` and following arguments are
surounded by ``[]``:

::

   dispatch(store, ['actionTag', args...]);  // form (3)
   // ↓
   fn(args...);

Example:

::

   const store = createStore({ counter: 0 });
   const update = update.bind(null, store);
   addActions(store, {
     set: ({ value = 0 }) => update(state, { ...state, counter: value },
     increment: i => update(state, { ...state, counter: state.counter + i }),
     decrement: i => update(state, { ...state, counter: state.counter - i }),
   });
   ...
   dispatch(store, { type: 'set', value: 0 });  // form (1)
   dispatch(store, 'inc', 1);  // form (2)
   dispatch(store, ['dec', 1]);  // form (3)

.. hint::

   You can create a specialized version of dispatch for your store by
   bind() method:

   ::

      const store = createStore({ cnt: 0 });
      const update = update.bind(null, store);
      addActions(store, { inc: () => update(s => { ...s, cnt: s.cnt + 1), ... });
      dispatch2 = dispatch.bind(null, store);  // ← create a new dispatch function
      ...
      dispatch2('inc');


addActions
----------

::
   
   import { addActions } from 'dash-store/dispatch';

   addActions(store, addition);

This function adds actions to the store.  The actions to add are
represented as a JavaScript Object in the following form:

::

   {
     actionTag1: function1,
     actionTag2: function2,
     ...
   }

Example:

::

   const store = createStore({ counter: 0 });
   const update = update.bind(null, store);
   addActions(store, {
     reset: () => update(state, { ...state, counter: 0 },
     increment: i => update(state, { ...state, counter: state.counter + i }),
     decrement: i => update(state, { ...state, counter: state.counter - i }),
   });


addActionList
-------------

::
   
   import { addActionList } from 'dash-store/dispatch';

   addActionList(store, addition);

This function adds actions to the store.  The actions to add are
represented as an array of arrays in the following form:

::

   [
     ['actionTag1', function1],
     ['actionTag2', function2],
     ...
   ]

Example:

::

   export const store = createStore({ counter: 0 });
   const update = update.bind(null, store);
   addActionList(store, [
     ['reset', () => update(state, { ...state, counter: 0 }],
     ['increment', i => update(state, { ...state, counter: state.counter + i })],
     ['decrement', i => update(state, { ...state, counter: state.counter - i })],
   ]);


.. _setActionKey:

setActionKey
------------

::
   
   import { setActionKey } from 'dash-store/dispatch';

   setActionKey(store, key);

This function change the property key to determine actionTag from
a JavaScript Object supplied to :ref:`dispatch` function.

.. note::

   The default action key is ``'type'``.

Example:

::

   const store = createStore({ ... });
   setActionKey(store, 'tag');  // → { tag: 'action', ... }


setOnDispatchHook
-----------------

::

   import { setOnDispatchHook } from 'dash-store/dispatch';
   
   setOnDispatchHook(store, fn);

This function sets a onDispach hook which will be called befor every
action of the store performed :ref:`dispatch`.

The hook functiion ``fn`` should have the following signatre::

  fn(store, args);

Where the ``args`` is an array which holds the entire argument list
passed to dispatch except the first one (store).

Example:

::

   const store = createStore(...);
   setOnDispatchHook(store, fn);
   ...
   dispatch(store, arg1, arg2, arg3, ...);
   // ↓
   // fn(store, [arg1, arg2, arg3, ...]);
