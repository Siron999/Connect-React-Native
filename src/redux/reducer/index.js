import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from "redux";
import AuthReducer from './authReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  Auth:AuthReducer,
});

export default persistReducer(persistConfig,rootReducer);
