# Dragula for Vue2 via vue-dragula

> A Vue.js demo app to demonstrate how to use [Dragula](https://bevacqua.github.io/dragula/) with [Vue 2.x](https://vuex.vuejs.org) for drag and drop.

### Status: WIP

Currently using this vue-dragula [refactor]("vue-dragula": "kristianmandrup/vue-dragula#refactor") branch.
See more in [[Design]] section below.

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