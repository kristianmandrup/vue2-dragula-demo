# Dragula for Vue2 via vue-dragula

> A Vue.js demo app to demonstrate how to use [Dragula](https://bevacqua.github.io/dragula/) with [Vue 2](https://vuex.vuejs.org) for drag and drop.

### Status: Time travel

Demo app which demonstrates how to use the new [vue2-dragula](https://github.com/kristianmandrup/vue2-dragula) plugin.
See more info in plugin Readme and in the sections below.

This branch is trying to add an example for how to create a *Custom Model Manager* which uses an Immutable Array that keeps a history of previous state so you can undo/redo. Please see the `src/util` folder:

- `imm-model-manager.js` custom model manger using immutable Array
- `imm-model-manager.test.js` (using `ava` test runner)
- `model-manager.js` same as in vue2-dragula

The undo seems to be working partly, but the UI doesn't reflect it, so...
Also the undo/redo should affect both the source and target models.
Likely we need to perform undo or redo on both models to keep in sync!

Any help on adding this feature would be greatly appreciated!!

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

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/)
and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Development

To help improve the plugin, please do the following:
- fork [vue2-dragula](https://github.com/kristianmandrup/vue2-dragula) and clone it to local disk
- from within the root of `/vue2-dragula` run `npm link` to make a symbolic global link to this package
- from the root of this demo app, run `npm link vue2-dragula` to install the `vue2-dragula` module via the symbolic link

When you make changes to the plugin, make sure you run `npm run build` in order to compile it to `/dist`.

We hope to release this plugin before or in December 2016, so we urge you to try it out and
really excercise it, in order to find any remaining bugs or parts that need improvement.

For now we use [vue-material](https://marcosmoura.github.io/vue-material) and
[vue-router](https://router.vuejs.org/en/api/route-object.html) for the navigation menu.
Styling has not yet been prioritized much. Please help out make the demo look beautiful.

*components*

- `Home` brief overview of the examples
- `GlobalService` use of global app service
- `NamedServices` named services
- `DragEffects` drag effects on a named service
- `CustomModelManager` immutable model manager with time travel

*router*

The app is configured with a router which have the following components mounted:
- `/` : `home`
- `/global` : `global`
- `/named` : `named`
- `/effects` : `effects`

*To add your own example page*

Add a route in `routes/index` and your example component in `/components`.
Register the component in `/components/index.js` and update the main navigation in `App.vue` with a
link to your example route.

### Bugs and issues

Please report [bugs or issues](https://github.com/kristianmandrup/vue2-dragula)

## Using v-dragula directive

- `v-dragula` directive on an element must point to an underlying data model (`Array`) in the VM.
- `service` attribute specifies a registered `DragulaService`
- `drake` attribute to use a specific named drake configuration registered on the service

### Global app service example

If you don't specify a service the global application level dragula service `$dragula.$service` will be used

```html
<div class="wrapper">
  <div class="container" v-dragula="colOne" drake="first">
    <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
  </div>
  <div class="container" v-dragula="colTwo" drake="first">
    <div v-for="text in colTwo">{{text}}</div>
  </div>
</div>
```

### Named services

DOM element containers can be configured to use specific named services:

```html
<div class="wrapper">
  <div class="container" v-dragula="colOne" service="first" drake="a">...</div>
  <div class="container" v-dragula="colTwp" service="first" drake="b">...</div>
  <div class="container" v-dragula="colTwo" service="first" drake="b">...</div>
  <div class="container" v-dragula="stocks" service="second" drake="a">...</div>
</div>
```

Every service has a `default` drake with default a dragula configuration.
You can use the `default` drake by not setting the `drake` attribute.

```html
<div class="wrapper">
  <div class="container" v-dragula="colOne" service="first">...</div>
  <div class="container" v-dragula="colTwp" service="first">...</div>
  <div class="container" v-dragula="colTwo" service="first" drake="b">...</div>
  <div class="container" v-dragula="stocks" service="second">...</div>
</div>
```

### Custom Model Manager with Time Travel

Uses [seamless-immutable](https://www.npmjs.com/package/seamless-immutable) which contains Immutable data structures for JavaScript which are backwards-compatible with normal JS Arrays and Objects.

Implements basic Time Travel with undo/redo back and forward in model history.
Play with it and have fun!

The difference for the immutable collections is that methods which would mutate the collection, like `push`, `set`, `unshift` or `splice` instead return a new immutable collection.
Methods which return new arrays like `slice` or `concat` also return new immutable collections.
The local VM should maintain a history of transactions that can be undone.

An action consists of:
- `dragIndex` index in source model
- `dropIndex` index in target model
- `sourceModel` source list (or model manager that manages a list, ie. a model)
- `targetModel` destination list
- `transitModel` item (or list) in transition from source to target

The event handlers `insertAt` and `dropModel` can be used to manage the action history.
`insertAt` looks like the best candidate as it has access to all the action information.

```js
'effects:insertAt': ({dragIndex, dropIndex, sourceModel, targetModel, transitModel}) => {

},

'effects:dropModel': ({name, el, source, target, dragIndex, dropIndex, sourceModel}) => {
}
```

Currently the `ImmModelManager` contains all the history methods/tracking but we need to use this in the VM itself.
Both the `sourceModel` and `targetModel` have a history, so we can undo on both and update the VM models to reflect
these. The VM/drake model references are encapsulated by the `ImmModelManager` of `source-` and `targetModel` as `modelRef`.

In theory we should thus be able to do:

`this.modelRef = this.model` for `sourcModel` and `targetModel` after `undo`/`redo` on each, in order to change the VM models
and have the UI change to reflect that change.


Ideally there should be a separate `TimeMachine` class used by the `ModelManager` to handle time transitions.


### Dragula Service pre-configuration

Always pre-configure named services with drakes in the `created` life cycle hook method of the VM.

```js
created () {
  let myService = this.$dragula.createService({
    name: 'my-service',
    drakes: {
      first: {
        copy: true,
      }
    }
  })

  let otherService = this.$dragula.createService({
    name: 'other-service',
    drake: {
      // default drake config
    }
  })

  myService.on({
    drop: (el, container) => {
      console.log('drop: ', el, container)
    }
    ...
  })
}
```

### Styling

*Add handles*

```js
.handle {
    padding: 0 5px;
    margin-right: 5px;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: move;
}
```

Add a black border effect on `:hover` over draggable child elements of a `drake` container

```js
[drake] >:hover {
  border: 2px solid black
}
```

### UX effects via event handlers

Add/Remove DOM element style classes as UX effects for drag'n drop events.
Here using [classList](https://developer.mozilla.org/en/docs/Web/API/Element/classList)

```js
service.on({
  accepts: (drake, el, target) => {
    log('accepts: ', el, target)
    return true // target !== document.getElementById(left)
  },
  drag: (drake, el, container) => {
    log('drag: ', 'el:', el, 'c:', container)
    log('classList', el.classList)
    el.classList.remove('ex-moved')
  },
  drop: (drake, el, container) => {
    log('drop: ', el, container)
    log('classList', el.classList)
    el.classList.add('ex-moved')
  },
  over: (drake, el, container) => {
    log('over: ', el, container)
    log('classList', el.classList)
    el.classList.add('ex-over')
  },
  out: (drake, el, container) => {
    log('out: ', el, container)
    log('classList', el.classList)
    el.classList.remove('ex-over')
  }
})
```

Sample effects styling

```css
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.ex-moved {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 2px solid yellow;
  padding: 2px
}

.ex-over {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 4px solid green;
  padding: 2px
}
```

Note that `assets/styles.css` contains most of the styling used, primarily this part of interest:

```css
.container .ex-moved {
  background-color: #e74c3c;
}
.container.ex-over {
  background-color: rgba(255, 255, 255, 0.3);
}
.handle {
  padding: 0 5px;
  margin-right: 5px;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: move;
}
```

Tip: Please add more examples showcasing dynamic styling and transition effects to better visualize the drag and drop actions/events ;)

### Configuring dragula options

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

Let us know if this demo helps you and what you build with this example as your foundation.
Feel free to improve and come with suggestions :)

**Enjoy!!!**

## License

MIT

(c) Kristian Mandrup 2016
