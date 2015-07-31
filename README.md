embox-value
=================

> embox - to enclose in a box.

`embox-value` provides reactive isolation, and value caching.

Create a boxed version of your function, like so:

```js
var boxedFn = emboxValue(fn[, options])
```

Then use `boxedFn()` as you would `fn()`.

Install
----------

```js
meteor add 3stack:embox-value
```

API
----------

The package only exports the one function:

`emboxValue(fn[, options])`

Parameters:

 * `fn` - the function you'd like to box.
 * `options.equals` - If your function returns objects - use `EJSON.equals`. Or, for your own classes, a custom comparitor.
 * `options.lazy` - if `true`, it will use a `LazyBox` instead of a `Box`. A `LazyBox` will stop computing if the result is not used in a reactive computation.


You should also call `boxedFn.stop()` when the box longer required. Or, use the template integration.



Template Integration
--------------------

In `onCreated` or `onRendered` you can use `this.emboxValue(fn[, options]])`

When the template is destroyed, the `boxedFn` will be stopped automatically.


```js
Template.myTemplate.onCreated(function(){
  this.boxedFn = this.emboxValue(fn);
});

Template.myTemplate.helpers({
  fn: function(){ return Template.instance().boxedFn(); }
})
```

History / Origins
------------

This code is a modified version of an obsolete piece of `meteor-core`. Circa v0.8 - v0.9.

Example
------------

[If pasting in a console, make sure it runs in one go, or use a snippet]

```js

//setup vars
Session.set('a', 1);
Session.set('b', 1);

// runs immediately!
var whichIsGreater = emboxValue(function(){
   console.log('computing which is greater');
   var a = Session.get('a');
   var b = Session.get('b');
   if (a == b){
     return "neither";
   } else if (a > b) {
     return "a";
   } else {
     return "b";
   }
});

// firstRun - will just retrieve the value, and not compute it again
// this computation will only re-run during a Tracker.flush (end of event-loop)
Tracker.autorun(function(c){
  var text = "the greater number is: "
  if (!c.firstRun){
    text = "now " + text;
  }
  console.log(text , whichIsGreater());
});

Session.set('a', 2); // force it to re-compute
// even if you call this synchronously, it wont read the wrong value!
console.log('just checking, which is now greater: ', whichIsGreater()); // a!

Session.set('a', 4);
Session.set('b', 5);
// even if you call this synchronously, it wont read the wrong value!
console.log('checking again, which is now greater: ', whichIsGreater()); // b!

// will now print 'now the greater number is: b'

```

