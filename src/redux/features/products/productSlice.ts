import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: {
	products: any[];
	product: any | null;
	meta: any | null;
} = {
	products: [],
	product: null,
	meta: null,
};

const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		setProducts: (state, action: PayloadAction<any[]>) => {
			state.products = action.payload;
		},
		setMeta: (state, action: PayloadAction<any>) => {
			state.meta = action.payload;
		},
		setTableProducts: (
			state,
			action: PayloadAction<{
				products: any[];
				meta: any | null;
			}>
		) => {
			state.products = action.payload.products;
			state.meta = action.payload.meta;
		},
		setProduct: (state, action: PayloadAction<any>) => {
			state.product = action.payload;
			// console.log(state.product);
			
		},
		clearProducts: (state) => {
			state.products = [];
			state.meta = null;
            state.product = null
		},
	},
});
export const { setProducts, setMeta, setTableProducts, setProduct,clearProducts } =
	productSlice.actions;
export default productSlice.reducer;
