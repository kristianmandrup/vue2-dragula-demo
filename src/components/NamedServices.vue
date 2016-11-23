<template>
  <section id="named-services-examples">
    <div class="examples">
      <div class="parent">
        <label>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer? Great stuff.</label>
        <div class="wrapper">
          <div class="container" v-dragula="colOne" service="my-first" drake="first">
            <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
          </div>
          <div class="container" v-dragula="colTwo" service="my-first" drake="first">
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
          <div class="container" v-dragula="container" service="my-second" drake="a">
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
          <div class="container" v-dragula="copyOne" service="my-third" drake="a">
            <div v-for="text in copyOne" track-by="$index">{{text}}</div>
          </div>
          <div class="container" v-dragula="copyTwo" service="my-third" drake="a">
            <div v-for="text in copyTwo" track-by="$index">{{text}}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'namedServices',
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
    console.log('NAMED SERVICES: created')

    let dragula = this.$dragula

    dragula.createService({
      name: 'first',
      drakes: {
        first: {
          copy: true
        }
      },
      options: {
        logging: {
          dragHandler: true
        }
      }
    })

    dragula.createServices({
      name: ['second', 'third'],
      drakes: {
        a: true
      }
    })

    console.log('NAMED SERVICES: ready')
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
