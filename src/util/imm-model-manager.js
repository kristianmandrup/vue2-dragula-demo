import Immutable from 'seamless-immutable'
import { ModelManager } from './model-manager'

// console.log('ModelManager', ModelManager)

export default class ImmutableModelManager extends ModelManager {
  constructor (opts = {}) {
    super(opts)
  }

  get clazzName () {
    return this.constructor.name || 'ImmutableModelManager'
  }

  createModel () {
    return Immutable([])
  }

  createFor (opts = {}) {
    return new ImmutableModelManager(opts)
  }

  at (index) {
    console.log('find model at', index, this.model)
    return this.model[index]
  }

  timeTravel (index) {
    this.model = this.history[index]
    return this.model
  }

  undo () {
    this.log('undo', this.timeIndex)
    if (this.timeIndex === 0) {
      return false
    }
    this.timeTravel(this.timeIndex--)
    return this
  }

  redo () {
    this.log('redo', this.timeIndex)
    if (this.timeIndex < this.history.length) {
      return false
    }
    this.timeTravel(this.timeIndex++)
    return this
  }

  addToHistory (newModel) {
    this.model = newModel
    this.history.push(newModel)
    this.historyIndex++
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
