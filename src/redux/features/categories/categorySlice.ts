import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: {
	categories: any[];
	category: any | null;
	meta: any | null;
} = {
	categories: [],
	category: null,
	meta: null,
};

const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		setCategories: (state, action: PayloadAction<any[]>) => {
			state.categories = action.payload;
		},
		setMeta: (state, action: PayloadAction<any>) => {
			state.meta = action.payload;
		},
		setTableCategories: (
			state,
			action: PayloadAction<{
				categories: any[];
				meta: any | null;
			}>
		) => {
			state.categories = action.payload.categories;
			state.meta = action.payload.meta;
		},
		setCategory: (state, action: PayloadAction<any>) => {
			state.category = action.payload;
			// console.log(state.category);
			
		},
		clearCategories: (state) => {
			state.categories = [];
			state.meta = null;
            state.category = null
		},
	},
});
export const { setCategories, setMeta, setTableCategories, setCategory,clearCategories } =
	categorySlice.actions;
export default categorySlice.reducer;
