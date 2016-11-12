# Dragula for Vue2 via vue-dragula

> A Vue.js demo app to demonstrate how to use [Dragula](https://bevacqua.github.io/dragula/) with [Vue 2.x](https://vuex.vuejs.org) for drag and drop.

### Status: WIP

Currently using this vue-dragula [refactor]("vue-dragula": "kristianmandrup/vue-dragula#refactor") branch.
See more in [[Design]] section below.

Please see my note in this [PR](https://github.com/Astray-git/vue-dragula/pull/26) and let's work togehte to better grasp
how to use Dragula with Vue2. Cheers!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


### Dragula

Note that when instantiating dragula, you can pass a host of options:

```js
dragula(containers, {
  isContainer: function (el) {
    return false; // only elements in drake.containers will be taken into account
  },
  moves: function (el, source, handle, sibling) {
    return true; // elements are always draggable by default
  },
  accepts: function (el, target, source, sibling) {
    return true; // elements can be dropped in any of the `containers` by default
  },
  invalid: function (el, handle) {
    return false; // don't prevent any drags from initiating by default
  },
  direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
  copy: false,                       // elements are moved by default, not copied
  copySortSource: false,             // elements in copy-source containers can be reordered
  revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
  removeOnSpill: false,              // spilling will `.remove` the element, if this is true
  mirrorContainer: document.body,    // set the element that gets mirror elements appended
  ignoreInputTextSelection: true     // allows users to select input text, see details below
});
```

Initializing dragula with custom options:

```js
const myDragulaOptions = {
  accepts: function (el, target, source, sibling) {
    return true; // elements can be dropped in any of the `containers` by default
  }
}

Vue.use(VueDragula, myDragulaOptions)
```

Currently you can only have one Dragula instance per application. It needs a redesign!

### DragulaService

The plugin is instantiated with a `DragulaService` singleton, which contains:

```
  this.bags = [] // bag store
  this.eventBus = new Vue()
  this.events = [
    'cancel',
    'cloned',
    'drag',
    'dragend',
    'drop',
    'out',
    'over',
    'remove',
    'shadow',
    'dropModel',
    'removeModel'
  ]
```

Add events to the `eventBus` as follows

```js
  this.$dragula.eventBus.$on(
    'drop',
    function (el, container) {
      console.log('drop: ', el, container)
      console.log(this.categories)
    }
  )
```

When `vue-dragula` is bound to the app, it will find elements with the data attribute `bag` ie.

```html
<div class="container" v-dragula="colOne" bag="first-bag">...</div>
```

Which will be added to the `bags` of the service. It will error if a bag of that name is already registered.
I sadly have no idea yet how to design this better, as I don't yet understand Dragula. Please chip in!

From the [Dragula docs on containers](https://github.com/bevacqua/dragula#dragulacontainers-options)

By default, dragula will allow the user to drag an element in any of the containers and drop it in any other container in the list.
If the element is dropped anywhere that's not one of the containers, the event will be gracefully cancelled according to the
`revertOnSpill` and `removeOnSpill` options.

You can omit the containers argument and add containers dynamically later on.

```js
var drake = dragula({
  copy: true
});
drake.containers.push(container);
```

You can also set the containers from the options object.

```
var drake = dragula({ containers: containers });
```

I have a feeling that a bag is a container? and that using the `bag` attribute to mark a container is simply a
more convenient way than using document selectors:

"...allows the user to drag elements from left into right, and from right into left."

```js
dragula([document.querySelector('#left'), document.querySelector('#right')]);
```

But now I see that dragula is a directive:

```js
  Vue.directive('dragula', {
    params: ['bag'],
```

So the rule must be that every `dragula` directive instance, has a set of unique `bag` names (containers to drag between).
Which is why this works:

```html
  <div class="container" v-dragula="colOne" bag="first-bag">
    <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
  </div>
  <div class="container" v-dragula="colTwo" bag="first-bag">
    <div v-for="text in colTwo">
      <span class="handle">+</span>
      <span>{{text}}</text>
    </div>
  </div>
```

Since we have `v-dragula="colOne" bag="first-bag"` and `v-dragula="colTwo"` bag="first-bag"`.
So this should work:

```js
this.$dragula.options('third-bag', {
  copy: true
})
```

Using `copyOne` and `copyTwo` directive instances. But I guess they share the same service!?
WTF!!! Still getting `Error: Bag named: "third-bag" already exists.`

```html
<div class="wrapper">
  <div id="left-copy" class="container" v-dragula="copyOne" bag="third-bag">
    <div v-for="text of copyOne">{{ text }}</div>
  </div>
  <div id="right-copy" class="container" v-dragula="copyTwo" bag="third-bag">
    <div v-for="text of copyTwo">{{ text }}</div>
  </div>
</div>
```

Yes, the whole problem seems to be that there is only one global `DragulaService`.
Needs a redesign to be service per directive instantiation!!

Perhaps we just need to use a component level directive?

If you want to register a directive locally instead, components also accept a directives option:

```js
directives: {
  focus: {
    // directive definition
  }
}
```

If I'm not mistaken, the problem is that ther is ONE global `DragulaService` shared by `$dragula` on each component instance.
Each component can then have multiple directives who each use $dragula of the component and thus the global service.

### Redesign proposal

Perhaps we could have an API where `$dragula` can be used to `create` an new service with it's own `eventBus`, a set of `bags` and
event handlers for events on that bus.

```js
let serviceTwo = this.$dragula.create({bags: ['second-bag']}).on({
  drop (el, container) {
    console.log('drop: ', el, container)
  }
  ...
})

let serviceThree = this.$dragula.create({bags: ['third-bag']}).on({
  drop (el, container) {
    console.log('drop: ', el, container)
  }
  ...
})

```

### Design

Adding handles

```js
.handle {
    padding: 0 5px;
    margin-right: 5px;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: move;
}
```

Black border on `:hover`

```js
[bag] >:hover {
  border: 2px solid black
}
```

### More event handlers

Note: We are also adding classes on target element in these examples.

```js
// if we accept
this.$dragula.eventBus.$on(
  'accepts',
  function (el, target) {
    console.log('accepts: ', el, target)
    return true // target !== document.getElementById(left)
  }
)

// when we start dragging
this.$dragula.on('drag', function (el, container, handle) {
  console.log('drag: ', el, container, handle)
  el.className = el.className.replace('ex-moved', '')
})
// when we drop
.on('drop', function (el, container, handle) {
  console.log('drop: ', el, container, handle)
  el.className += ' ex-moved'
})

/// when we are over
.on('over', function (el, container, handle) {
  console.log('over: ', el, container, handle)
  container.className += ' ex-over'
})

// when we are leaving
.on('out', function (el, container, handle) {
  console.log('out: ', el, container, handle)
  container.className = container.className.replace('ex-over', '')
})
```