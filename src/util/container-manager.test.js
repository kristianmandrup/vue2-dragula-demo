import test from 'ava'
import ContainerManager from './container-manager'

const createIt = (opts = {}) => {
  return new ContainerManager(opts)
}

const logging = true

const cm = createIt({ logging })

// const log = console.log

import ModelManager from './imm-model-manager'

function decorate (action) {
  action.models = action.models.map(model => {
    return new ModelManager(model)
  })
}

const models = [
  {
    source: [1, 2, 3],
    target: [],
    transit: 2
  },
  {
    source: [1, 3],
    target: [2],
    transit: 3
  }
]

const actions = [
  {
    models: decorate(models[0]),
    indexes: {
      drag: 1,
      drop: 0
    }
  },
  {
    models: decorate(models[1]),
    indexes: {
      drag: 1,
      drop: 1
    }
  }
]

test('shouldLog', t => {
  t.true(cm.shouldLog, 'should log')
})

test('act', t => {
  cm.act(actions[0])
  t.is(cm.actions.done, 1, 'has one done action')
  t.is(cm.actions.undone, 0, 'has no undo actions')
})

test('undo', t => {
  cm.act(actions[0])
  cm.undo()
  t.is(cm.actions.done, 0, 'has no done actions')
  t.is(cm.actions.undone, 1, 'has one undone action')
})

test('redo', t => {
  cm.act(actions[0])
  cm.undo()
  t.is(cm.actions.done, 0, 'has no done actions')
  t.is(cm.actions.undone, 1, 'has one undone action')

  cm.redo()
  t.is(cm.actions.done, 1, 'has one done action')
  t.is(cm.actions.undone, 0, 'has no undo actions')

  cm.act(actions[1])
  t.is(cm.actions.done, 2, 'has two done actions')
  t.is(cm.actions.undone, 1, 'has one undone action')

  cm.undo()
  t.is(cm.actions.done, 1, 'has one done action')
  t.is(cm.actions.undone, 0, 'has no undo actions')

  cm.redo()
  t.is(cm.actions.done, 2, 'has two done actions')
  t.is(cm.actions.undone, 1, 'has one undone action')
})

