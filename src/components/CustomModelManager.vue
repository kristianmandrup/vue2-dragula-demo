<template>
  <section id="custom-model-manager">
    <div class="examples">
      <div class="parent">
        <label>Custom Model Manager example</label>
        <div class="wrapper">
          <div id="first" class="container" v-dragula="colOne" service="effects">
            <div v-for="item in colOne" :key="item.key">
              <span class="handle">+</span>
              <span>{{item.text}}</span>
            </div>
          </div>
          <div id="second" class="container" v-dragula="colTwo" service="effects">
            <div v-for="item in colTwo" :key="item.key">
              <span class="handle">+</span>
              <span>{{item.text}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <button @click="undo">undo</button>
        <button @click="redo">redo</button>
        <button @click="setRandom">generate</button>
      </div>
    </div>
  </section>
</template>
<script>
import ImmutableModelManager from '../util/imm-model-manager'
import ActionManager from '../util/action-manager'
import faker from 'xfaker'
import _ from 'lodash'

const log = console.log

export default {
  name: 'dragEffects',
  data () {
    return {
      colOne: [
        {
          text: 'You can move these elements between these two containers',
          key: 0
        },
        {
          text: 'Moving them anywhere else isn"t quite possible',
          key: 1
        },
        {
          text: 'There"s also the possibility of moving elements around in the same container, changing their position',
          key: 2
        }
      ],
      colTwo: [
        {
          text: 'This is the default use case. You only need to specify the containers you want to use',
          key: 3
        },
        {
          text: 'More interactive use cases lie ahead',
          key: 4
        },
        {
          text: 'Another message',
          key: 5
        }
      ]
    }
  },

  methods: {
    undo () {
      this.actionManager.undo()
    },
    redo () {
      this.actionManager.redo()
    },
    act (action) {
      this.actionManager.act(action)
    },
    setRandom () {
      let firstAction = this.actionManager.actions.done[0]
      if (!firstAction) return
      let source = firstAction.models.source

      function randNum (max) {
        return faker.random.number({min: 1, max: max || 5})
      }

      function item () {
        return {
          text: faker.lorem.words(randNum(10)),
          key: randNum(9999)
        }
      }

      // random text and keys
      let randList = _.times(randNum(6), item)

      log('set source model to random list', randList)

      source.modelRef.splice(0, source.modelRef.length)
      for (let item of randList) {
        source.modelRef.push(item)
      }
      log('new modelRef', source.modelRef)
      // this.colTwo = source.modelRef
      // source._model = randList
      // source.timeMachine.model = randList
    }
  },

  created () {
    console.log('DRAG EFFECTS: created')

    let dragula = this.$dragula
    let createModelManager = (opts) => {
      return new ImmutableModelManager(opts)
    }

    let service = dragula.createService({
      name: 'effects',
      createModelManager,
      logging: {
        directive: true,
        plugin: true,
        modelManager: true,
        dragHandler: false,
        service: true
      },
      drake: {
        copy: false
      }
    })

    this.actionManager = new ActionManager({
      logging: true
    })

    // custom action handlers to activate after undo/redo
    this.actionManager.onUndo((action) => {
      let { models, indexes, elements } = action
      log('onUndo', action, models, indexes, elements)
    })

    this.actionManager.onRedo((action) => {
      let { models, indexes, elements } = action
      log('onRedo', action, models, indexes, elements)
    })

    // See: https://github.com/bevacqua/dragula#drakeon-events
    service.on({
      // in response to dragula.on('remove')
      // el was being dragged but it got nowhere and it was removed from the DOM.
      // Its last stable parent was container, and originally came from source
      'effects:removeModel': ({name, el, source, dragIndex, sourceModel}) => {
        log('HANDLE effects:removeModel: ', name, el, source, dragIndex, sourceModel)
        el.classList.remove('ex-moved')
      },

      // TODO: enable undo/redo by keeping track of indexes
      'effects:insertAt': ({name, indexes, models, elements}) => {
        log('HANDLE effects:insertAt: ', indexes, models, elements)
        // add model history actions for local actions history navigation
        this.act({
          name,
          models,
          indexes,
          elements
        })
        log('actionManager actions', this.actionManager.actions)
      },

      // TODO: the incoming model should be added to local history
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
