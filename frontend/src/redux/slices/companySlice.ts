import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompanyState {
    list: Array<{ id: number; name: string; address: string }>;
}

const initialState: CompanyState = {
    list: [],
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setCompanies(state, action: PayloadAction<CompanyState['list']>) {
            state.list = action.payload;
        },
    },
});

export const { setCompanies } = companySlice.actions;
export default companySlice.reducer;
