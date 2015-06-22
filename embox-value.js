"use strict";

// Takes a reactive function (call it `inner`) and returns a reactive function
// `outer` which is equivalent except in its reactive behavior.  Specifically,
// `outer` has the following two special properties:
//
// 1. Isolation:  An invocation of `outer()` only invalidates its context
//    when the value of `inner()` changes.  For example, `inner` may be a
//    function that gets one or more Session variables and calculates a
//    true/false value.  `outer` blocks invalidation signals caused by the
//    Session variables changing and sends a signal out only when the value
//    changes between true and false (in this example).  The value can be
//    of any type, and it is compared with `===` unless an `equals` function
//    is provided.
//
// 2. Value Sharing:  The `outer` function returned by `emboxValue` can be
//    shared between different contexts, for example by assigning it to an
//    object as a method that can be accessed at any time, such as by
//    different templates or different parts of a template.  No matter
//    how many times `outer` is called, `inner` is only called once until
//    it changes.  The most recent value is stored internally.
//
// Conceptually, an emboxed value is much like a Session variable which is
// kept up to date by an autorun.  Session variables provide storage
// (value sharing) and they don't notify their listeners unless a value
// actually changes (isolation).  The biggest difference is that such an
// autorun would never be stopped, and the Session variable would never be
// deleted even if it wasn't used any more.  An emboxed value, on the other
// hand, automatically stops computing when it's not being used, and starts
// again when called from a reactive context.  This means that when it stops
// being used, it can be completely garbage-collected.
//
// If a non-function value is supplied to `emboxValue` instead of a reactive
// function, then `outer` is still a function but it simply returns the value.
//
/**
 *
 * @param {Function|} funcOrValue
 * @param {Function|Object} [equalsFnOrOptions]
 * @param {Function} [equalsFnOrOptions.equals] A function to compare results. If you're returning objects, use `EJSON.equals`
 * @param {Boolean} [equalsFnOrOptions.lazy] If true, will use `LazyBox` - this box stops computing when not in use by a reactive computation
 * @returns {Function}
 */
emboxValue = function (funcOrValue, equalsFnOrOptions, lazilyCompute) {
  if (typeof funcOrValue === 'function') {
    var options;
    if (_.isFunction(equalsFnOrOptions)){
      options = {
        equals: equalsFnOrOptions,
        lazy: !!lazilyCompute
      };
    } else {
      options = equalsFnOrOptions || {};
    }

    var func = funcOrValue;
    var box;
    if (options.lazy){
      box = new LazyBox(func, options.equals);
    } else {
      box = new Box(func, options.equals);
    }

    var f = function () {
      return box.get();
    };

    f.stop = function () {
      box.stop();
    };

    return f;

  } else {
    var value = funcOrValue;
    var result = function () {
      return value;
    };
    result._isEmboxedConstant = true;
    return result;
  }
};
