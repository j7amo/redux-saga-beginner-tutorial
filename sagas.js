// чтобы нам начать работать с асинхронностью нужно использовать
// Effect creators - специальные функции, которые возвращают простые объекты с
// описанием того, что нужно делать (то есть по сути речь идёт об action-объектах)
import { put, takeEvery, all, call } from 'redux-saga/effects'

// создадим 1-ую сагу-воркер, с виду от обычной функции ничем кроме *
// не отличается. чтобы её запустить нам нужно:
// 1) импортировать createSagaMiddleware
// 2) создать с его помощью middleware ( просто вызвать его)
// 3) подключить это middleware к стору с помощью createStore и applyMiddleware
// 4) запустить сагу с помощью вызова метода run у созданного middleware
function* helloSaga() {
    console.log('Hello Sagas!');
}

// добавим функцию, которая будет имитировать асинхронность,
// возвращая зарезолвленный промис с задержкой
export const delay = (ms) => new Promise(res => setTimeout(res, ms))

// создадим ещё одну сагу-воркер, которая будет сначала инициировать
// задержку, а потом создавать эффект для диспатча action-объекта
export function* incrementAsync() {
    // всё, что воркер выдаёт (yield), попадает в saga-middleware
    // и пока saga-middleware это не обработает / выполнит,
    // воркер не возобновит свою работу
    // в данном случае у нас будет 2 таких паузы:
    // 1) пока не зарезолвится промис через 1000 мс
    //yield delay(1000)
    // в этой строке кода есть одна проблема:
    // по-хорошему сага должна выдавать объект с инструкциями для saga-middleware,
    // вместо этого выдаётся объект промиса, который мы не сможем протестировать

    // для того, чтобы сделать саги более тестируемыми имеет смысл
    // выдавать обычные плоские JS-объекты с инструкциями
    // когда нам нужно выдать вызов функции мы можем использовать
    // effect-creator CALL
    // его интерфейс:
    // - 1-ый параметр - функция, которую надо вызвать
    // - остальные параметры - аргументы, с которыми вызывается эта функция
    yield call(delay, 1000) // получаем инструкции { CALL: {fn: delay, args: [1000]}}

    // 2) пока saga-middleware не задиспатчит action {type: 'INCREMENT'}
    // тут стоит сказать, что у saga-middleware есть что-то вроде очереди задач,
    // куда попадают все выданные эффекты
    // saga-middleware
    // - с помощью вызова next() (как у итератора) "берёт" следующий эффект,
    // - выполняет его (генератор блокируется до завершения выполнения эффекта),
    // - вызывает next(result), где result - результат предыдущего эффекта.
    // Это схема повторяется до тех пор, пока не будут отработаны все эффекты либо throw Error.
    yield put({type: 'INCREMENT'}) // получаем инструкции { PUT: {type: 'INCREMENT'} }
}

// создадим сагу-вотчер (не путать с сагой-воркером: воркеры вызываются вотчерами,
// а вотчеры в свою очередь реагируют на type простых action-объектов)
function* watchIncrementAsync() {
    yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

// для того, чтобы одновременно запустить несколько саг, используем all
export default function* rootSaga() {
    yield all([
        helloSaga(),
        watchIncrementAsync()
    ])
}