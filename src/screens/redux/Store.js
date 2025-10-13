import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loginReducer from "./reducer/loginReducer";
import kycReducer from "./reducer/KYCReducer";
import settingReducer from "./reducer/settingReducer";

// Combine reducers
const rootReducer = combineReducers({
  login: loginReducer,
  kyc: kycReducer,
  settingData: settingReducer,
});

// Configure the store
export const Store = configureStore({
  reducer: rootReducer,
});
