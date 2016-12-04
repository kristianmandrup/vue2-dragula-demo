export default class ActionManager {
  constructor (opts = {}) {
    this.name = opts.name || 'default'
    this.logging = opts.logging
    this.observer = {
      undo: function (action) {
      },
      redo: function (action) {
      }
    }

    this.actions = {
      // stack of actions to undo
      done: [],
      // stack of actions undone to be redone(via. redo)
      undone: []
    }
  }

  get clazzName () {
    return this.constructor.name || 'ActionManager'
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
    // TODO: use elements, indexes to create visual transition/animation effect
    let { models } = action
    this.log(name, action)

    let { source, target } = models

    // this.log(name, 'actions', source, target)
    this.doAct(source, name)
    this.doAct(target, name)

    this.emitAction(name, action)

    cUndo.push(action)
    // this.log('actions undo', cUndo)
  }

  emitAction (name, action) {
    let fun = this.observer[name]
    if (typeof fun === 'function') fun(action)
  }

  onUndo (fun) {
    this.observer.undo = fun
  }

  onRedo (fun) {
    this.observer.redo = fun
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

  act ({ name, models, indexes, elements }) {
    this.actions.done.push({
      models,
      indexes,
      elements
    })
  }
}
