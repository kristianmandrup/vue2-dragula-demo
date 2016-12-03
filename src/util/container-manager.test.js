import test from 'ava'
import ContainerManager from './container-manager'

const createIt = (opts = {}) => {
  return new ContainerManager(opts)
}

const logging = true

const cm = createIt({ logging })

const log = console.log

import ModelManager from './imm-model-manager'

function decorateObj (obj) {
  let keys = Object.keys(obj)
  return keys.reduce((obj, key) => {
    obj[key] = new ModelManager(obj[key])
    return obj
  }, {})
}

// function decorate (models) {
//   return models.map(model => {
//     return new ModelManager(model)
//   })
// }

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
    models: decorateObj(models[0]),
    indexes: {
      drag: 1,
      drop: 0
    }
  },
  {
    models: decorateObj(models[1]),
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
  let acts = cm.actions
  log('actions', acts)
  t.is(acts.done.length, 1, 'has one done action')
  t.is(acts.undone.length, 0, 'has no undo actions')
})

test('undo', t => {
  cm.act(actions[0])
  let acts = cm.actions
  log('actions', acts)

  cm.undo()
  t.is(acts.done, 0, 'has no done actions')
  t.is(acts.undone, 1, 'has one undone action')
})

test('redo', t => {
  cm.act(actions[0])
  let acts = cm.actions
  log('actions', acts)

  cm.undo()
  t.is(acts.done, 0, 'has no done actions')
  t.is(acts.undone, 1, 'has one undone action')

  cm.redo()
  t.is(acts.done.length, 1, 'has one done action')
  t.is(acts.undone.length, 0, 'has no undo actions')

  cm.act(actions[1])
  t.is(acts.done.length, 2, 'has two done actions')
  t.is(acts.undone.length, 1, 'has one undone action')

  cm.undo()
  t.is(acts.done.length, 1, 'has one done action')
  t.is(acts.undone.length, 0, 'has no undo actions')

  cm.redo()
  t.is(acts.done.length, 2, 'has two done actions')
  t.is(acts.undone.length, 1, 'has one undone action')
})

