<template>
  <section id="examples">
    <div class="examples">
      <div class="parent">
        <label>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer? Great stuff.</label>
        <div class="wrapper">
          <div class="container" v-dragula="colOne" bag="first-bag">
            <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
          </div>
          <div class="container" v-dragula="colTwo" bag="first-bag">
            <div v-for="text in colTwo">
              <span class="handle">+</span>
              <span>{{text}}</text>
            </div>
          </div>
        </div>
        <pre>
          <code>
            &lt;div v-dragula=&quot;colOne&quot; bag=&quot;first-bag&quot;&gt;&lt;/div&gt;
            &lt;div v-dragula=&quot;colTwo&quot; bag=&quot;first-bag&quot;&gt;&lt;/div&gt;
          </code>
        </pre>
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
        <label>Modify items in dragula bag  with transition</label>
        <div class="wrapper" v-for="container in categories">
          <div class="container" v-dragula="container" bag="second-bag">
            <div v-for="number in container" transition="scale">{{number}}</div>
          </div>
        </div>
        <button @click="testModify">Modify Items</button>
      </div>
    </div>

    <!--<div class="examples" id="examples-3">
      <div class="parent">
        <label for="hy">Copying stuff is common too, so we made it easy for you.</label>
        <div class="wrapper">
          <div id="left-copy" class="container" v-dragula="copyOne" bag="third-bag">
            <div v-for="text of copyOne">{{ text }}</div>
          </div>
          <div id="right-copy" class="container" v-dragula="copyTwo" bag="third-bag">
            <div v-for="text of copyTwo">{{ text }}</div>
          </div>
        </div>
      </div>
    </div>-->

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
  },
  // See https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
  mounted () {
    console.log('Mounted')
    this.$nextTick(() => {
      console.log(Vue.$dragula, Vue.prototype)

      if (!this.$dragula) {
        console.error('this.$dragula is not available from Vue.prototype')
        throw new Error('this.$dragula is not available from Vue.prototype')
      }

      // this.$dragula.options('third-bag', {
      //   copy: true
      // })

      console.log('Comfig $dragula.eventBus', this.$dragula.eventBus)
      // since $dragula in on Vue.prototype which all Components inherit from
      // you should also be able to do: this.$dragula
      this.$dragula.eventBus.$on(
        'drop',
        function (el, container, handle) {
          console.log('drop: ', el, container, handle)
          console.log(this.categories)
        }
      )
      this.$dragula.eventBus.$on(
        'dropModel',
        function (el, container, handle) {
          console.log('dropModel: ', el, container, handle)
          console.log(this.categories)
        }
      )

      this.$dragula.eventBus.$on(
        'accepts',
        function (el, target) {
          console.log('accepts: ', el, target)
          return true // target !== document.getElementById(left)
        }
      )

      this.$dragula.eventBus.$on(
        'drag',
        function (el, container) {
          console.log('drag: ', el, container)
          // el.className = el.className.replace('ex-moved', '')
        }
      )

      // this.$dragula.on('drag', function (el, container, handle) {
      //   console.log('drag: ', el, container, handle)
      //   el.className = el.className.replace('ex-moved', '')
      // }).on('drop', function (el, container, handle) {
      //   console.log('drop: ', el, container, handle)
      //   el.className += ' ex-moved'
      // }).on('over', function (el, container, handle) {
      //   console.log('over: ', el, container, handle)
      //   container.className += ' ex-over'
      // }).on('out', function (el, container, handle) {
      //   console.log('out: ', el, container, handle)
      //   container.className = container.className.replace('ex-over', '')
      // })
    })
  },
  methods: {
    onClick () {
      console.log(this.$dragula.find('first-bag'))
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

[bag] >:hover {
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