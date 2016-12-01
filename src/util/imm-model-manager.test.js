import test from 'ava'
import ModelManager from './imm-model-manager'

const createIt = (opts = {}) => {
  return new ModelManager(opts)
}

const logging = {
  logging: {
    modelManager: true
  }
}

const log = console.log

const mm = createIt({ logging })

test.afterEach(t => {
  mm.clear()
})

test('createModel', t => {
  let model = mm.createModel()
  log(model)
  t.pass()
})

test('createFor', t => {
  let model = mm.createFor([])
  log(model)
  t.pass()
})

test('isEmpty', t => {
  t.true(model.isEmpty(), 'is empty')
  let model = mm.createFor([1])
  t.false(model.isEmpty(), 'is not empty')
})


test('at (index) empty', t => {
  let item0 = model.at(0)
  t.falsy(item0, 'nothing at 0 in empty list')
})

test('at (index) elements', t => {
  let model = mm.createFor([1, 2])
  let item0 = model.at(0)
  let item1 = model.at(1)
  log(model)
  t.is(item0, 0)
  t.is(item1, 1)
})

test('first', t => {
  let model = mm.createFor([1, 2])
  let item = model.first
  log('first', item)
  t.is(item, 1)
})

test('last', async t => {
  let model = mm.createFor([1, 2])
  let item = model.last
  log('last', item)
  t.is(item, 2)
})

// ...