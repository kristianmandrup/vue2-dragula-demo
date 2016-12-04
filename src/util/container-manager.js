export default class ContainerManager {
  constructor (opts = {}) {
    this.name = opts.name || 'default'
    this.logging = opts.logging

    this.actions = {
      // stack of actions to undo
      done: [],
      // stack of actions undone to be redone(via. redo)
      undone: []
    }
  }

  get clazzName () {
    return this.constructor.name || 'ContainerManager'
  }

  get shouldLog () {
    return this.logging
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  clear () {
    this.actions.done = []
    this.actions.undone = []
  }

  // perform undo/redo on model (container)
  doAct (container, action) {
    let actFun = container[action].bind(container)
    // this.log('doAct', actFun, container, action)
    if (!actFun) {
      throw new Error(container, 'missing', action, 'method')
    }
    actFun()
  }

  do ({name, container}) {
    // this.log(name)
    let cDo = container.do
    let cUndo = container.undo
    if (!cDo.length) {
      // this.log('actions empty', cDo)
      return
    }
    let action = cDo.pop()
    let { models } = action
    let { source, target } = models

    // this.log(name, 'actions', source, target)
    this.doAct(source, name)
    this.doAct(target, name)

    cUndo.push(action)
    // this.log('actions undo', cUndo)
  }

  undo () {
    this.do({
      name: 'undo',
      container: {
        do: this.actions.done,
        undo: this.actions.undone
      }
    })
  }

  redo () {
    this.do({
      name: 'redo',
      container: {
        do: this.actions.undone,
        undo: this.actions.done
      }
    })
  }

  act ({ name, models, indexes }) {
    this.actions.done.push({
      models,
      indexes
    })
  }
}
