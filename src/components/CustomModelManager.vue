<template>
  <section id="custom-model-manager">
    <div class="examples">
      <div class="parent">
        <label>Custom Model Manager example</label>
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
      <div class="actions">
        <button @click="undo">undo</button>
        <button @click="redo">redo</button>
      </div>
    </div>
  </section>
</template>
<script>
import ImmutableModelManager from '../util/imm-model-manager'

const log = console.log

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
      ],
      actions: {
        // stack of actions to undo
        done: [],
        // stack of actions undone to be redone(via. redo)
        undone: []
      }
    }
  },

  methods: {
    undo () {
      console.log('undo')
      let done = this.actions.done
      let undone = this.actions.undone
      if (!done.length) {
        console.log('done actions empty', done)
        return
      }
      let action = done.pop()
      let { models } = action
      let { sourceModel, targetModel } = models

      log('undo actions', sourceModel.undo, targetModel.undo)
      sourceModel.undo()
      targetModel.undo()
      undone.push(action)
      log('actions undone', undone)
    },
    redo () {
      console.log('redo')
      let done = this.actions.done
      let undone = this.actions.undone
      if (!undone.length) {
        console.log('undone actions empty', undone)
        return
      }
      let action = undone.pop()
      let { models } = action
      let { sourceModel, targetModel } = models

      log('redo actions', sourceModel.redo, targetModel.redo)
      sourceModel.redo()
      targetModel.redo()

      done.push(action)
      log('actions done', done)
    },
    inserted ({ name, models, indexes }) {
      this.actions.done.push({
        models,
        indexes
      })
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
        directive: false,
        plugin: false,
        modelManager: true,
        dragHandler: false,
        service: false
      },
      drake: {
        copy: true
      }
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
      'effects:insertAt': ({name, dragIndex, dropIndex, sourceModel, targetModel, transitModel}) => {
        log('HANDLE effects:insertAt: ', dragIndex, dropIndex, sourceModel, targetModel, transitModel)
        // add model history actions for local actions history navigation
        this.inserted({
          name,
          models: {
            sourceModel,
            targetModel,
            transitModel
          },
          indexes: {
            dragIndex,
            dropIndex
          }
        })
        log('actions done', this.actions.done)
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
