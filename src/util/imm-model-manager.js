import Immutable from 'seamless-immutable'
import { ModelManager } from './model-manager'
import { TimeMachine } from './time-machine'

const createDefaultTimeMachine = function (opts) {
  return new TimeMachine(opts)
}

export default class ImmutableModelManager extends ModelManager {
  constructor (opts = {}) {
    super(opts)
    let createTimeMachine = opts.createTimeMachine || createDefaultTimeMachine
    this.timeMachine = createTimeMachine(Object.assign(opts, {
      model: this.model
    }))
  }

  get clazzName () {
    return this.constructor.name || 'ImmutableModelManager'
  }

  undo () {
    this.timeMachine.undo()
    return this
  }

  redo () {
    this.timeMachine.undo()
    return this
  }

  addToHistory (model) {
    this.timeMachine.addToHistory(model)
    return this
  }

  createModel (model) {
    return Immutable(model || [])
  }

  // TODO: add to history!?
  createFor (opts = {}) {
    return new ImmutableModelManager(opts)
  }

  at (index) {
    console.log('find model at', index, this.model)
    return this.model[index]
  }

  isEmpty () {
    return this.model.length === 0
  }

  get first () {
    return this.at(0)
  }

  get last () {
    return this.at(this.model.length - 1)
  }

  removeAt (index) {
    this.log('removeAt', {
      model: this.model,
      index
    })
    // create new model with self excluded
    const before = this.model.slice(0, index)
    const exclAfter = this.model.slice(index + 1)

    this.log('removeAt: concat', before, exclAfter)
    const newModel = this.createModel().concat(before, exclAfter)

    return this.addToHistory(newModel)
  }

  insertAt (index, dropModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    // create new model with new inserted
    const before = this.model.slice(0, index)
    const inclAfter = this.model.slice(index)
    this.log('insertAt: concat', before, dropModel, inclAfter)

    const newModel = this.createModel().concat(before, dropModel, inclAfter)
    return this.addToHistory(newModel)
  }

  move ({dragIndex, dropIndex}) {
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })
    this.timeMachine.undo()
    return this
  }
}
