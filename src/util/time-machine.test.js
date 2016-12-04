import test from 'ava'
import { TimeMachine } from './time-machine'

const logging = {
  modelManager: true
}

const createFor = function (model) {
  return new TimeMachine({
    name: 'test',
    model: model,
    logging: logging
  })
}

const log = console.log

test('addToHistory', t => {
  let initialModel = [1, 2]
  const tm = createFor(initialModel)

  let mdl = [1, 2, 3, 6]
  tm.addToHistory(mdl)

  log('history', tm.history)
  t.deepEqual(tm.history.length, 2)

  t.deepEqual(tm.history[0], initialModel)
  t.deepEqual(tm.history[1], mdl)
  t.deepEqual(tm.history[2], undefined)
})

test('timeIndex', t => {
  let initialModel = [1, 2]
  const tm = createFor(initialModel)
  log('timeIndex', tm.timeIndex)
  t.deepEqual(tm.timeIndex, 0)
})

test('undo', t => {
  let initialModel = [1, 2]
  const tm = createFor(initialModel)
  tm.addToHistory([0, 1, 2])
  let undotm = tm.undo()
  log('undo model', undotm)
  t.deepEqual(undotm.model, initialModel)
})

test('redo', t => {
  let initialModel = [1, 2]
  const tm = createFor(initialModel)
  let mdl = [0, 1, 2]
  tm.addToHistory(mdl)
  log('latest model', tm.model)

  let prevModel = tm.undo()
  log('prev model', prevModel)
  t.deepEqual(prevModel.model, initialModel)

  let nextModel = tm.redo()
  log('next model', nextModel)
  t.deepEqual(nextModel.model, mdl)
})

test('timeTravel (index)', t => {
  let initialModel = [1, 2]
  const tm = createFor(initialModel)
  let mdl = [0, 1, 2]
  tm.addToHistory(mdl)

  let firstModel = tm.timeTravel(0)
  log('first model', firstModel)
  t.deepEqual(firstModel.model, initialModel)
})
