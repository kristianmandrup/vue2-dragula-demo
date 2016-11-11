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
            <div v-for="text in colTwo">{{text}}</div>
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
          {{colOne | json}}
        </p>

        <p>
          <h5>colTwo</h5>
          {{colTwo | json}}
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

    <div class="examples" id="examples-3">
      <div class="parent">
        <label>Copy between containers</label>
        <div class="wrapper">
          <div class="container" v-dragula="copyOne" bag="third-bag">
            <div v-for="text in copyOne" track-by="$index">{{text}}</div>
          </div>
          <div class="container" v-dragula="copyTwo" bag="third-bag">
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

    this.$dragula.options('third-bag', {
      copy: true
    })
  },
  // See https://vuejs.org/v2/guide/instance.html#Instance-Lifecycle-Hooks
  mounted () {
    console.log('Mounted')
    this.$nextTick(() => {
      console.log('Comfig $dragula.eventBus', this.$dragula.eventBus)
      // since $dragula in on Vue.prototype which all Components inherit from
      // you should also be able to do: this.$dragula
      this.$dragula.eventBus.$on(
        'drop',
        function (args) {
          console.log('drop: ' + args[0])
          console.log(this.categories)
        }
      )
      this.$dragula.eventBus.$on(
        'dropModel',
        function (args) {
          console.log('dropModel: ' + args)
          console.log(this.categories)
        }
      )
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
</style>
