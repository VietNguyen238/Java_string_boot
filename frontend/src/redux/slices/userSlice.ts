import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    list: Array<{ id: number; name: string; email: string }>;
}

const initialState: UserState = {
    list: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<UserState['list']>) {
            state.list = action.payload;
        },
    },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
