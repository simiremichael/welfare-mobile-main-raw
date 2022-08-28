import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/auth/authSlice";
import beneficiarySliceReducer from "./features/beneficiary/beneficiarySlice";
import memberSliceReducer from "./features/member/memberSlice";
import nextOfKinSliceReducer from "./features/NOK/nextOfKinSlice";
const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    nextOfKin: nextOfKinSliceReducer,
    beneficiary: beneficiarySliceReducer,
    member: memberSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
