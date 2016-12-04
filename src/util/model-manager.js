export class ModelManager {
  constructor (opts = {}) {
    if (Array.isArray(opts)) {
      opts = {
        model: opts
      }
    }
    this.opts = opts
    this.name = opts.name
    this.drake = opts.drake

    this.modelRef = opts.model || []
    this._model = this.createModel(this.modelRef)

    this.logging = opts.logging
    this.log('CREATE', opts)
  }

  get model () {
    return this._model
  }

  set model (model) {
    this._model = model
  }

  get clazzName () {
    return this.constructor.name || 'ModelManager'
  }

  get shouldLog () {
    return this.logging && this.logging.modelManager
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  undo () {
    this.log('undo', 'not yet implemented')
  }

  redo () {
    this.log('redo', 'not yet implemented')
  }

  at (index) {
    return this.model.get(index)
  }

  clear () {
    this._model = this.createModel()
  }

  createModel (model) {
    return this.model || model || []
  }

  createFor (opts = {}) {
    return new ModelManager(opts)
  }

  removeAt (index) {
    this.log('removeAt', {
      model: this.model,
      index
    })
    return this.model.splice(index, 1)
  }

  insertAt (index, dropModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    return this.model.splice(index, 0, dropModel)
  }

  move ({dragIndex, dropIndex}) {
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })

    return this.model.splice(dropIndex, 0, this.model.splice(dragIndex, 1)[0])
  }
}
