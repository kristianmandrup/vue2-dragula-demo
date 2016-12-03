export class ContainerManager {
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

  undo () {
    this.log('undo')
    let done = this.actions.done
    let undone = this.actions.undone
    if (!done.length) {
      this.log('done actions empty', done)
      return
    }
    let action = done.pop()
    let { models } = action
    let { source, target } = models

    this.log('undo actions', source.redo, target.redo)
    source.undo()
    target.undo()
    undone.push(action)
    this.log('actions undone', undone)
  }

  redo () {
    this.log('redo')
    let done = this.actions.done
    let undone = this.actions.undone
    if (!undone.length) {
      this.log('undone actions empty', undone)
      return
    }
    let action = undone.pop()
    let { models } = action
    let { source, target } = models

    this.log('redo actions', source.redo, target.redo)
    source.redo()
    target.redo()

    done.push(action)
    this.log('actions done', done)
  }

  act ({ name, models, indexes }) {
    this.actions.done.push({
      models,
      indexes
    })
  }
}
