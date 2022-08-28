import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthenticateResponseSuccess,
  AuthInitialState,
  BeneficiaryFormType,
  BeneficiaryInitialState,
  BeneficiaryTableData,
  FinalBeneficiaryFormType,
  LoginFormType,
  NextOfKinInitialState,
  SaveBeneficiarySuccessResponse,
  SaveNextOfKinSuccessResponse,
  section1cFormType,
  Section2FormType,
} from "../../global/types";
import { BASE_URL } from "@env";
import { endpoints } from "../../utils/api";
import {
  fetchMemberId,
  fetchToken,
  saveToAsyncStorage,
} from "../../utils/helpers";
import { AppDispatch, RootState } from "../../store";
import { showMessage } from "react-native-flash-message";
import { successConfig } from "../../utils/constants";

const initialState: BeneficiaryInitialState = {
  beneficiaryTableData: [],
  saveBeneficiaryResponse: {
    success: undefined,
    error: undefined,
    status: undefined,
  },
  benInStore: undefined,
  benGoodToGo: false,
  beneficiaryCount: 0,
};

export const saveBeneficiary = createAsyncThunk<
  void,
  any,
  { rejectValue: any; state: RootState; dispatch: AppDispatch }
>(
  "beneficiary/saveBeneficiary",
  async (benToPush, { rejectWithValue, getState, dispatch }) => {
    const finalUrl = `${BASE_URL}/v1/harley-welfare/ben/save/${await fetchMemberId()}`;
    await fetch(finalUrl, {
      method: "POST",
      body: JSON.stringify(benToPush),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await fetchToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        res;
        console.log("saveBenResponse : ", res);
        dispatch(addToBenCount());
        showMessage({ ...successConfig, description: "beneficiary added" });
      })
      .catch((error) => console.log("saveBenResponse Error : ", error.message));
  }
);

const beneficiarySlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {
    saveBenToStore: (state, { payload }) => {
      state.benInStore = payload;
      state.beneficiaryCount += 1;
      console.log("benInStore : ", payload);
    },
    benNotReady: (state) => {
      state.benGoodToGo = false;
    },
    resetBen: (state) => {
      state.beneficiaryCount = 0;
    },
    addToBenCount: (state) => {
      state.beneficiaryCount += 1;
    },
    setBeneficiaryTableData: (
      state,
      { payload }: PayloadAction<BeneficiaryTableData[]>
    ) => {
      state.beneficiaryTableData = payload;
      console.log("beneficiaryTableData : ", state.beneficiaryTableData);
    },
  },
  extraReducers(builder) {
    builder.addCase(saveBeneficiary.pending, (state) => {
      state.saveBeneficiaryResponse.status = "pending";
    });
    builder.addCase(saveBeneficiary.fulfilled, (state) => {
      console.log("Beneficiary good to go");
      state.benGoodToGo = true;
      state.saveBeneficiaryResponse.status = "fulfilled";
    });
    builder.addCase(saveBeneficiary.rejected, (state) => {
      state.saveBeneficiaryResponse.status = "rejected";
    });
  },
});

export const {
  saveBenToStore,
  benNotReady,
  resetBen,
  addToBenCount,
  setBeneficiaryTableData,
} = beneficiarySlice.actions;
export default beneficiarySlice.reducer;
