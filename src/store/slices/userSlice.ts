// userSlice.ts
import { User } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      console.log("was here");
      state.currentUser = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

export const { setCurrentUser, setLoading, setError, clearCurrentUser } =
  userSlice.actions;
export default userSlice.reducer;
