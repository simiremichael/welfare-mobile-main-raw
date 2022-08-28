import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
  PayloadAction,
} from "@reduxjs/toolkit";

import {
  fetchMemberId,
  fetchToken,
  saveMemberIdToAsyncStore,
  saveToAsyncStorage,
} from "../../utils/helpers";
import { MemberInitialState, SaveMemberSuccess } from "../../global/types";
import { saveBeneficiary } from "../beneficiary/beneficiarySlice";
import { saveNextOfKin } from "../NOK/nextOfKinSlice";
import { showMessage } from "react-native-flash-message";
import { errorConfig, successConfig } from "../../utils/constants";
import { AppDispatch, RootState } from "../../store";

const initialState: MemberInitialState = {
  mbrno: null,
  memberInStore: null,
  saveMemberResponse: {
    success: null,
    error: null,
    status: null,
  },
  membersGoodToGo: false,
  memberTableData: [],
};

export const saveMember = createAsyncThunk<
  SaveMemberSuccess,
  any,
  { rejectValue: any; state: RootState; dispatch: AppDispatch }
>(
  "member/saveMember",
  async (image, { dispatch, getState, rejectWithValue }) => {
    const formData = new FormData();
    const { memberInStore } = getState().member;
    let localUri = image.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    Object.keys(memberInStore).forEach((key) =>
      formData.append(key, memberInStore[key])
    );
    formData.append("MBR_PHOTO", {
      name: filename,
      type: type,
      uri: localUri,
    });
    try {
      const request = await fetch(
        "http://54.158.67.206:8090/v1/harley-welfare/members/save",
        {
          method: "POST",
          body: formData,
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${await fetchToken()}`,
          },
        }
      );

      dispatch(memberIsReady);
      const response = await request.json();
      console.log(response);
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status in response === false
      ) {
        return response;
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error: any) {
      console.log(error);
      if (error.message === `Network request failed`) {
        return rejectWithValue("Poor or bad internet connection");
      }
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    saveMemberToStore: (state, { payload }) => {
      state.memberInStore = payload;
      console.log("memberInStore : ", payload);
    },
    memberNotReady: (state) => {
      state.membersGoodToGo = false;
    },
    setMbrno: (state, { payload }) => {
      state.mbrno = payload;
    },
    memberIsReady: (state) => {
      state.membersGoodToGo = true;
    },
    setMemberTableData: (state, { payload }) => {
      state.memberTableData = payload;
      console.log("memberTableData : ", state.memberTableData);
    },
  },
  extraReducers(builder) {
    builder.addCase(saveMember.pending, (state) => {
      state.saveMemberResponse.status = "pending";
    });
    builder.addCase(saveMember.fulfilled, (state, { payload }) => {
      state.saveMemberResponse.status = "fulfilled";
      state.saveMemberResponse.success = payload;
      saveMemberIdToAsyncStore(payload.mbrno);
      showMessage({ ...successConfig, description: "member registered" });
      console.log("saveMemberResponse : ", state.saveMemberResponse.success);
    });
    builder.addCase(saveMember.rejected, (state, { payload }) => {
      state.saveMemberResponse.status = "rejected";
      showMessage({ ...errorConfig, description: payload });
    });
  },
});

export const {
  saveMemberToStore,
  memberNotReady,
  memberIsReady,
  setMemberTableData,
  setMbrno,
} = memberSlice.actions;
export default memberSlice.reducer;
