<template>
  <section id="drag-examples">
    <div class="examples">
      <div class="parent">
        <label>Move stuff between these two containers. Note how the stuff gets inserted near the mouse pointer? Great stuff.</label>
        <div class="wrapper">
          <div id="first" class="container" v-dragula="colOne" service="effects">
            <div v-for="text in colOne">
              <span class="handle">+</span>
              <span>{{text}}</text>
            </div>
          </div>
          <div id="second" class="container" v-dragula="colTwo" service="effects">
            <div v-for="text in colTwo">
              <span class="handle">+</span>
              <span>{{text}}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'dragEffects',
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
      ]
    }
  },
  // TODO: add drag
  created () {
    console.log('DRAG EFFECTS: created')

    let dragula = this.$dragula

    let service = dragula.createService({
      name: 'effects',
      drake: {
        copy: true
      }
    })

    let log = console.log

    // TODO: Use classlist: https://developer.mozilla.org/en/docs/Web/API/Element/classList
    // See all events here: https://github.com/bevacqua/dragula#drakeon-events
    //
    service.on({
      'effects:removeModel': ({name, el, source, dragIndex, model}) => {
        log('HANDLE effects:removeModel: ', name, el, source, dragIndex, model)
        el.classList.remove('ex-moved')
      },
      'effects:dropModel': ({name, el, source, target, dropIndex, model}) => {
        log('HANDLE effects:dropModel: ', el, source, target, dropIndex, model)
        el.classList.add('ex-moved')
      },
      accepts: ({el, target}) => {
        log('accepts: ', el, target)
        return true // target !== document.getElementById(left)
      },
      drag: ({el, source, target, container}) => {
        log('HANDLE drag: ', 'el:', el, 'c:', container)
        log('classList', el.classList)
        el.classList.remove('ex-moved')
      },
      drop: (opts) => {
        const {el, container, model} = opts
        log('HANDLE drop: ', el, container, model, opts)
        log('classList', el.classList)
        el.classList.add('ex-moved')
        log('new classList', el.classList)
      },
      over: ({el, container}) => {
        log('over: ', el, container)
        log('classList', el.classList)
        el.classList.add('ex-over')
      },
      out: ({el, container}) => {
        log('out: ', el, container)
        log('classList', el.classList)
        el.classList.remove('ex-over')
      }
    })
    console.log('DRAG EFFECTS: ready')
  }
}
</script>
<style>
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.ex-moved {
  animation: fadeIn 2s ease-in 1 forwards;
  border: 2px solid yellow;
  padding: 2px
}

.ex-over {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 4px solid green;
  padding: 2px
}
</style>
