import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    value: 0,
};

export const incrementAsync = createAsyncThunk(
    'counter/incrementAsync',
    async (amount) => {
        await new Promise((resolve) => setTimeout(() => resolve(amount), 1000));
        return amount;
    }
);

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
    },

    extraReducers: (builder) => {

        builder.addCase(incrementAsync.pending, (state) => {
            // You can set a loading state here if needed
            console.log('Incrementing asynchronously...');
        })
        .addCase(incrementAsync.fulfilled, (state, action) => {
            state.value += action.payload;
        });
    },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;