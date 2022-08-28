import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthCredentials,
  AuthenticateResponseSuccess,
  AuthInitialState,
  LoginFormType,
} from "../../global/types";
import { BASE_URL } from "@env";
import { endpoints } from "../../utils/api";
import { saveToAsyncStorage } from "../../utils/helpers";
import { showMessage } from "react-native-flash-message";
import { errorConfig, successConfig } from "../../utils/constants";

const initialState: AuthInitialState = {
  appIsOnline: false,
  isLoggedIn: false,
  rememberMe: false,
  authenticateResponse: {
    success: undefined,
    error: undefined,
    status: undefined,
  },
  onlineAgent: undefined,
  offlineAgent: undefined,
};

export const authenticate = createAsyncThunk<
  AuthenticateResponseSuccess,
  LoginFormType,
  { rejectValue: any }
>("auth/authenticate", async (payload, { rejectWithValue }) => {
  try {
    const finalUrl = `${BASE_URL}${endpoints.authenticate}`;
    const request = await fetch(finalUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
      },
    });

    const response = await request.json();
    return response;
  } catch (error: any) {
    console.log(error);
    if (error.message === `JSON Parse error: Unexpected identifier "Invalid"`) {
      return rejectWithValue("invalid login credentials");
    }
    if (error.message === `Network request failed`) {
      return rejectWithValue("Poor or bad internet connection");
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRememberMe: (state, { payload }: PayloadAction<boolean>) => {
      state.rememberMe = payload;
    },
    setAppIsOnline: (state, { payload }: PayloadAction<boolean>) => {
      state.appIsOnline = payload;
      console.log("appIsOnline : ", state.appIsOnline);
    },
    setOnlineAgent: (state, { payload }) => {
      state.onlineAgent = payload;
      console.log("onlineAgent : ", state.onlineAgent);
    },
    setOfflineAgent: (state, { payload }) => {
      state.offlineAgent = payload;
      console.log("offlineAgent : ", state.offlineAgent);
    },
  },
  extraReducers(builder) {
    builder.addCase(authenticate.pending, (state, { payload }) => {
      state.authenticateResponse.status = "pending";
    });
    builder.addCase(authenticate.fulfilled, (state, { payload }) => {
      state.authenticateResponse.success = payload;
      showMessage({
        ...successConfig,
        description: "Online : Login successful",
      });
      state.authenticateResponse.status = "fulfilled";
      saveToAsyncStorage(
        payload.dcagmtusrname,
        payload.dcagmtpasswrd,
        payload.token
      );
      console.log("login successful : ", payload);
    });
    builder.addCase(authenticate.rejected, (state, { payload }) => {
      state.authenticateResponse.error = payload;
      state.authenticateResponse.status = "rejected";
      showMessage({ ...errorConfig, description: payload });
      console.log("rejected : ", payload);
    });
  },
});

export const {
  setRememberMe,
  setAppIsOnline,
  setOnlineAgent,
  setOfflineAgent,
} = authSlice.actions;
export default authSlice.reducer;
