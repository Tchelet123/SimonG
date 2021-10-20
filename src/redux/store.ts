import {createStore, combineReducers} from 'redux'
import mainReducer from './reducers';


const rootReducer = combineReducers({
    mainReducer
})

const configureStore = ()=> createStore(mainReducer)

export default configureStore