import test from 'ava'
import ModelManager from './imm-model-manager'

const createIt = (opts = {}) => {
  return new ModelManager(opts)
}

const logging = {
  modelManager: true
}

const log = console.log

const mm = createIt({ logging })

// for API see lists at: http://ricostacruz.com/cheatsheets/immutable-js.html

test.afterEach(t => {
  mm.clear()
})

test('shouldLog', t => {
  t.true(mm.shouldLog, 'should log')
})



test('createModel', t => {
  let model = mm.createModel()
  log('createModel', model)
  t.is(model.length, 0)
})

test('createFor', t => {
  let model = mm.createFor([])
  log('createFor', model)
  t.pass()
})

test('isEmpty', t => {
  let model = mm.createFor([])
  t.true(model.isEmpty(), 'is empty')
  let model1 = mm.createFor({
    model: [1]
  })
  log('not empty', model1)
  t.false(model1.isEmpty(), 'is not empty')
})

test('at (index) empty', t => {
  let model = mm.createFor([])
  let item0 = model.at(0)
  t.falsy(item0, 'nothing at 0 in empty list')
})

test('at (index) elements', t => {
  let model = mm.createFor([1, 2])
  let item0 = model.at(0)
  let item1 = model.at(1)
  log(model, item0, item1)
  t.is(item0, 1)
  t.is(item1, 2)
})

test('first', t => {
  let model = mm.createFor([1, 2])
  let item = model.first
  log('first', item)
  t.is(item, 1)
})

test('last', t => {
  let model = mm.createFor([1, 2])
  let item = model.last
  log('last', item)
  t.is(item, 2)
})

// insertAt
test('insertAt', t => {
  let model = mm.createFor([3, 4])
  let inserted = model.insertAt(0, [1, 2])
  log('inserted', inserted)
  t.deepEqual(inserted.model, [1, 2, 3, 4])
})

// removeAt
test('removeAt', t => {
  let model = mm.createFor([1, 2, 3, 4, 5])
  let removedFirst = model.removeAt(0)
  log('removed first', removedFirst)
  t.deepEqual(removedFirst.model, [2, 3, 4, 5])

  let removedLast = model.removeAt(2)
  log('removed last', removedLast)
  t.deepEqual(removedLast.model, [2, 3, 5])

  let removedMid = model.removeAt(1)
  log('removed mid', removedMid)
  t.deepEqual(removedLast.model, [2, 5])
})

test('addToHistory', t => {
  let initialModel = [1, 2]
  mm.createFor(initialModel)
  mm.addToHistory(initialModel)

  let mdl = [1, 2, 3, 6]
  mm.createFor(mdl)
  mm.addToHistory(mdl)

  log('history', mm.history)
  t.deepEqual(mm.history.length, 2)

  t.deepEqual(mm.history[0], initialModel)
  t.deepEqual(mm.history[1], mdl)
})

test('timeIndex', t => {
  let initialModel = [1, 2]
  let model = mm.createFor(initialModel)
  model.insertAt(0, [0])
  let timeIndex = model.timeIndex
  log('timeIndex', timeIndex)
  t.deepEqual(timeIndex, 1)
})

test('undo', t => {
  let initialModel = [1, 2]
  let model = mm.createFor(initialModel)
  model.insertAt(0, [0])
  let undoMM = model.undo()
  log('undo model', undoMM)
  t.deepEqual(undoMM.model, initialModel)
})

test('redo', t => {
  let initialModel = [1, 2]
  let imodel = mm.createFor(initialModel)
  let latestModel = imodel.insertAt(0, [0])
  log('latest model', latestModel)

  let prevModel = imodel.undo()
  log('prev model', prevModel)
  t.deepEqual(prevModel.model, initialModel)

  let nextModel = imodel.redo()
  log('next model', nextModel)
  t.deepEqual(nextModel.model, latestModel.model)
})

test('timeTravel (index)', t => {
  let initialModel = [1, 2]
  let model = mm.createFor(initialModel)
  model.insertAt(0, [0])
  let firstModel = model.timeTravel(0)
  log('first model', firstModel)
  t.deepEqual(firstModel.model, initialModel)
})



// ...
