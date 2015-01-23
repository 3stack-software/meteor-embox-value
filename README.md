embox-value
=================

A modified version of an obsolete piece of meteor-core.

Allows you to cache values of heavy computations, allowing multiple reactive reads without depending on all the original
reactive values.

Normally the embox would only re-compute it's value on a `Tracker.flush`, however in this version you can always trust
it to re-compute on read if any dependencies are invalidated. eg. No dirty reads!



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

