// протестируем саги
import test from 'tape'

import { put, call } from 'redux-saga/effects'
import { incrementAsync, delay } from './sagas'

// тестируем сагу incrementAsync
test('incrementAsync saga test', (assert) => {
    // получаем объект генератора, у которого есть метод next, который возвращает
    // объект в форме { done: false / true, value: someValue }
    const gen = incrementAsync()
    // deepEqual - проверяем равенство 2 объектов (важно: НЕ по ссылке, а глубокое)
    assert.deepEqual(
        gen.next().value,
        call(delay, 1000),
    'incrementAsync Saga must call delay(1000)'
    )

    assert.deepEqual(
        gen.next().value,
        put({type: 'INCREMENT'}),
        'incrementAsync Saga must dispatch an INCREMENT action'
    )

    assert.deepEqual(
        gen.next(),
        {done: true, value: undefined},
        'incrementAsync Saga must be done'
    )

    assert.end()
})

