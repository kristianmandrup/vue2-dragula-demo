import Immutable from 'seamless-immutable'
import { ModelManager } from 'vue2-dragula'

export default class ImmutableModelManager extends ModelManager {
  constructor (opts = {}) {
    super(opts)
  }

  createModel () {
    return Immutable([])
  }

  at (index) {
    return this.model[this.dragIndex]
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
    return this.timeTravel(this.timeIndex--)
  }

  redo () {
    this.log('redo', this.timeIndex)
    if (this.timeIndex < this.history.length) {
      return false
    }
    return this.timeTravel(this.timeIndex++)
  }

  addToHistory (newModel) {
    this.history.push(newModel)
    this.historyIndex++
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

    this.addToHistory(newModel)
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

    this.addToHistory(newModel)
  }

  move ({dragIndex, dropIndex}) {
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })
    // HARD undo
    this.history.pop()
  }
}
