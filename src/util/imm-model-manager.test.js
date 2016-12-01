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

test('foo', t => {
  let mm = createIt({ logging })
  let model = mm.createModel()
  log(model)

  t.pass()
})

test('bar', async t => {
  const bar = Promise.resolve('bar')

  t.is(await bar, 'bar')
})