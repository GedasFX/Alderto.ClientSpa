import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const SLICE_NAME = 'account';

export type User = {
  id: string;
  avatarId: string;
  guilds: {
    id: string;
    name: string;
  };
};

type SliceState = {
  user?: User;
};

const initialState: SliceState = {
  user: undefined,
};

const slice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    login: (_, { payload }: PayloadAction<User>) => ({ user: payload }),
    logout: () => ({}),
  },
});

export const accountActions = slice.actions;
export default slice.reducer;
