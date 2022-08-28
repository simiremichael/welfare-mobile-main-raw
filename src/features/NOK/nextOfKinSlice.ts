import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthenticateResponseSuccess,
  AuthInitialState,
  LoginFormType,
  NextOfKinInitialState,
  SaveNextOfKinSuccessResponse,
  section1cFormType,
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
import { errorConfig, successConfig } from "../../utils/constants";

const initialState: NextOfKinInitialState = {
  NOKTableData: [],
  saveNextOfKinResponse: {
    success: undefined,
    error: undefined,
    status: undefined,
  },
  NOKinStoreData: undefined,
  NOKGoodToGo: false,
};

export const saveNextOfKin = createAsyncThunk<
  void,
  any,
  { rejectValue: string; state: RootState; dispatch: AppDispatch }
>(
  "nextOfKin/saveNextOfKin",
  async (formData, { rejectWithValue, getState, dispatch }) => {
    const finalUrl = `${BASE_URL}${
      endpoints.saveNextOfKin
    }/${await fetchMemberId()}`;

    console.log("memberIdFromNOK : ", await fetchMemberId());
    console.log("NOKFormData :", formData);

    await fetch(finalUrl, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await fetchToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("saveNextOfKinResponse : ", res);
        if (
          res.status === 200 ||
          res.status === 201 ||
          res.status in res === false
        ) {
          showMessage({ ...successConfig, description: "next of kin saved" });
          dispatch(NOKIsReady);
        } else {
          showMessage({ ...errorConfig, description: res.error });
        }
      })
      .catch((err) => console.log("saveNextOfKinError: ", err));
  }
);

const nextOfKinSlice = createSlice({
  name: "nextOfKin",
  initialState,
  reducers: {
    saveNOKtoStore: (state, { payload }: PayloadAction<section1cFormType>) => {
      state.NOKinStoreData = payload;
      console.log("NOKinStoreData : ", payload);
    },
    NOKNotReady: (state) => {
      state.NOKGoodToGo = false;
    },
    NOKIsReady: (state) => {
      state.NOKGoodToGo = true;
    },
    setNOKTableData: (
      state,
      { payload }: PayloadAction<section1cFormType[]>
    ) => {
      state.NOKTableData = payload;
      console.log("NOKTableData : ", state.NOKTableData);
    },
  },
  extraReducers(builder) {
    builder.addCase(saveNextOfKin.pending, (state, { payload }) => {
      state.saveNextOfKinResponse.status = "pending";
    });
    builder.addCase(saveNextOfKin.fulfilled, (state, { payload }) => {
      state.saveNextOfKinResponse.success = payload;
      state.saveNextOfKinResponse.status = "fulfilled";
      state.NOKGoodToGo = true;
    });
    builder.addCase(saveNextOfKin.rejected, (state, { payload }) => {
      state.saveNextOfKinResponse.error = payload;
      state.saveNextOfKinResponse.status = "rejected";
    });
  },
});

export const { saveNOKtoStore, NOKNotReady, NOKIsReady, setNOKTableData } =
  nextOfKinSlice.actions;
export default nextOfKinSlice.reducer;
