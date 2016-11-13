<template>
  <section id="examples">
    <div class="examples">
      <div class="parent">
        <label>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer? Great stuff.</label>
        <div class="wrapper">
          <div class="container" v-dragula="colOne" drake="first">
            <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
          </div>
          <div class="container" v-dragula="colTwo" drake="first">
            <div v-for="text in colTwo">
              <span class="handle">+</span>
              <span>{{text}}</text>
            </div>
          </div>
        </div>
        <h4>Result</h5>
        <p>
          <h5>colOne</h5>
          <div v-for="text in colOne">{{text}}</div>
        </p>

        <p>
          <h5>colTwo</h5>
          <div v-for="text in colTwo">{{text}}</div>
        </p>
      </div>
    </div>

    <div class="examples" id="examples-2">
      <div class="parent">
        <label>Modify items in drake with transition</label>
        <div class="wrapper" v-for="container in categories">
          <div class="container" v-dragula="container" drake="second">
            <div v-for="number in container" transition="scale">{{number}}</div>
          </div>
        </div>
        <button @click="testModify">Modify Items</button>
      </div>
    </div>

    <div class="examples" id="examples-3">
      <div class="parent">
        <label>Copy between containers</label>
        <div class="wrapper">
          <div class="container" v-dragula="copyOne" drake="third">
            <div v-for="text in copyOne" track-by="$index">{{text}}</div>
          </div>
          <div class="container" v-dragula="copyTwo" drake="third">
            <div v-for="text in copyTwo" track-by="$index">{{text}}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'app',

  data () {
    return {
      colOne: [
        'You can move these elements between these two containers',
        'Moving them anywhere else isn"t quite possible',
        'There"s also the possibility of moving elements around in the same container, changing their position'
      ],
      colTwo: [
        'This is the default use case. You only need to specify the containers you want to use',
        'More interactive use cases lie ahead',
        'Another message'
      ],
      categories: [
        [1, 2, 3],
        [4, 5, 6]
      ],
      copyOne: [
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
        'Aenean commodo ligula eget dolor. Aenean massa.'
      ],
      copyTwo: [
        'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        'Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.'
      ]
    }
  },
  created () {
    console.log(Vue, Vue.prototype)
    let service = this.$dragula.$service

    // IMPORTANT!! setup empty named drakes matching 
    // directive drake configs in template
    // otherwise may (currently) result in conflict

    service.options('first', {
    })

    service.options('second', {
    })

    service.options('third', {
      copy: true
    })

  },
  methods: {
    onClick () {
      window.alert('click event')
    },
    testModify () {
      this.categories = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f']
      ]
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

[drake] >:hover {
  border: 2px solid black
}

.handle {
    padding: 0 5px;
    margin-right: 5px;
    background-color: rgba(0, 0, 0, 0.4);
    cursor: move;
}

body {
  background-color: #942A57;
  margin: 0 auto;
  max-width: 760px;
}

html, body {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
}

body, input, button {
  font-family: Georgia, Helvetica;
  font-size: 17px;
  color: #ecf0f1;
}

h1 {
  text-align: center;
  background-color: #AC5C7E;
  margin-top: 20px;
  margin-bottom: 0;
  padding: 10px;
}

h3 {
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 5px solid #A13462;
  text-align: center;
  padding: 10px;
}

h3 div {
  margin-bottom: 10px;
}

.tagline {
  margin-top: 0;
}

a {
  font-weight: bold;
}
a,
a:hover {
  color: #ecf0f1;
}

pre {
  white-space: pre-wrap;
}

pre code {
  color: #fff;
  font-size: 14px;
  line-height: 1.3;
}

label {
  display: block;
  margin-bottom: 15px;
}

sub {
  display: block;
  margin-top: -10px;
  margin-bottom: 15px;
  font-size: 11px;
  font-style: italic;
}

ul {
  margin: 0;
  padding: 0;
}

.parent {
  background-color: rgba(255, 255, 255, 0.2);
  margin: 50px 0;
  padding: 20px;
}

input {
  border: none;
  outline: none;
  background-color: #ecf0f1;
  padding: 10px;
  color: #942A57;
  border: 0;
  margin: 5px 0;
  display: block;
  width: 100%;
}

button {
  background-color: #ecf0f1;
  color: #942A57;
  border: 0;
  padding: 18px 12px;
  margin-left: 6px;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #e74c3c;
  color: #ecf0f1;
}

.gh-fork {
  position: fixed;
  top: 0;
  right: 0;
  border: 0;
}

/* dragula-specific example page styles */
.wrapper {
  display: table;
}
.container {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}
.container:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.2);
}
/*
 * note that styling gu-mirror directly is a bad practice because it's too generic.
 * you're better off giving the draggable elements a unique class and styling that directly!
 */
.container div,
.gu-mirror {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.4s ease-in-out;
}
.container div {
  cursor: move;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
  margin-bottom: 10px;
}
.container div:last-child {
  margin-bottom: 0;
}
.gu-mirror {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
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

/* example styles */
.container .scale-transition {
  overflow: hidden;
  height: 40px;
  transition: height .2s;
}
.container .scale-enter {
  height: 0px;
}
.container .scale-leave {
  height: 0px;
}

</style>