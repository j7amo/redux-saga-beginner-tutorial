import "@babel/polyfill"

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
// импортируем saga middleware
import createSagaMiddleware from 'redux-saga'

// импортируем сами саги
import rootSaga from './sagas'
import Counter from './Counter'
import reducer from './reducers'

// создаём middleware
const sagaMiddleware = createSagaMiddleware();

// создаём стор и подключаем к нему вышесозданное sagaMiddleware
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

// запускаем сагу
sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({type})

// здесь нужно обратить внимание на то, что наш UI
// диспатчит простые Action-объекты (никаких функций!) в отличии от thunk
function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')} />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
