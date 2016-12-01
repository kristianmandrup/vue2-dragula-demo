import Immutable from 'seamless-immutable'
import { ModelManager } from './model-manager'

// console.log('ModelManager', ModelManager)

export default class ImmutableModelManager extends ModelManager {
  constructor (opts = {}) {
    super(opts)
    this.timeIndex = 0
  }

  get clazzName () {
    return this.constructor.name || 'ImmutableModelManager'
  }

  clear () {
    this.model = this.createModel()
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

  timeTravel (index) {
    this.log('timeTravel to', index)
    this.model = this.history[index]
    return this
  }

  undo () {
    this.log('undo timeIndex', this.timeIndex)
    if (this.timeIndex === 0) {
      return false
    }
    this.timeIndex--
    this.timeTravel(this.timeIndex)
    return this
  }

  redo () {
    this.log('redo timeIndex', this.timeIndex, this.history.length)
    if (this.timeIndex > this.history.length - 1) {
      return false
    }
    this.timeIndex++
    this.timeTravel(this.timeIndex)
    return this
  }

  addToHistory (newModel) {
    this.log('addToHistory: old', this.model, 'new', newModel)
    this.model = newModel
    this.log('model was set to', this.model)
    this.history.push(newModel)
    this.timeIndex++
    return this
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
    // HARD undo
    this.history.pop()
    return this
  }
}
