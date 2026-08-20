import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import LoadingReducer from './reducers/LoadingReducer';
import MessageReducer from './reducers/MessageReducer';
import CartReducer from './reducers/CartReducer';

const rootReducer = combineReducers({
  LoadingReducer,
  MessageReducer,
  CartReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
