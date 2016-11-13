# Dragula for Vue2 via vue-dragula

> A Vue.js demo app to demonstrate how to use [Dragula](https://bevacqua.github.io/dragula/) with [Vue 2](https://vuex.vuejs.org) for drag and drop.

### Status: WIP

Currently using this vue-dragula [dev]("vue-dragula": "kristianmandrup/vue-dragula#dev") branch. See more in sections below.

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

Note that when instantiating dragula, you can pass a host of options. These options can be passed to `drake` instances of each service.

*TODO:* Perhaps add a way to pass a custom `dragula` factory method in [vue-dragula](https://github.com/kristianmandrup/vue-dragula/tree/dev). Currently hard coded to only create with a single container.

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

### Using v-dragula directive

Use the `v-dragula` directive on an element to point to an underlying model data model (ie. an `Array`) in the VM. Use the `service` attribute to target a registered `DragulaService` and the `drake` attribute to define which named drake configuration to use for that service.

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

### Dragula Service pre-configuration

Please Pre-configure named services with named drakes in the `created` life cycle hook method ofthe VM.

```js
created () {
  let myService = this.$dragula.create({
    name: 'my-service',
    drakes: {
      first: {
        copy: true,
      }
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

Add handles

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

Add/Remove DOM element style classes as UX effects for drag'n drop events

```js
service.on({
  accepts: (el, target) => {
    console.log('accepts: ', el, target)
    return true // target !== document.getElementById(left)
  },
  drag: (el, container) => {
    console.log('drag: ', el, container)
    el.className = el.className.replace('ex-moved', '')
  },
  drop: (el, container) => {
    console.log('drop: ', el, container)
    el.className += ' ex-moved'
  },
  over: (el, container) => {
    console.log('over: ', el, container)
    container.className += ' ex-over'
  },
  out: (el, container) => {
    console.log('out: ', el, container, handle)
    container.className = container.className.replace('ex-over', '')
  }
})
```

Let us know if this demo helps you and what you build with this example as your foundation. Feel free to improve :)

**Enjoy!!!**

## License

MIT