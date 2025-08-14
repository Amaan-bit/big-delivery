// cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/app/lib/config";

interface CartItem {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  brand_name?: string;
  quantity: number;
  thumbnail?: string;
  price?: number;
  total?: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  sub_total: number;
  discount: number;
  net_amount: number;
  tax: number;
  payable_amount: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  sub_total: 0,
  discount: 0,
  net_amount: 0,
  tax: 0,
  payable_amount: 0,
};

// Fetch cart
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (token: string | null) => {
    const res = await axios.get(`${BASE_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      items: res.data.data.items,
      sub_total: res.data.data.sub_total,
      discount: res.data.data.discount,
      net_amount: res.data.data.net_amount,
      tax: res.data.data.tax,
      payable_amount: res.data.data.payable_amount,
    };
  }
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    product_id,
    variant_id,
    token,
  }: {
    product_id: number;
    variant_id: number;
    token: string | null;
  }) => {
    const res = await axios.post(
      `${BASE_URL}/cart/add`,
      { product_id, variant_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      product_id,
      variant_id,
      quantity: res.data.data.quantity,
      sub_total: res.data.data.sub_total,
      discount: res.data.data.discount,
      net_amount: res.data.data.net_amount,
      tax: res.data.data.tax,
      payable_amount: res.data.data.payable_amount,
    };
  }
);

// Increment quantity
export const incrementCart = createAsyncThunk(
  "cart/incrementCart",
  async ({
    product_id,
    variant_id,
    token,
  }: {
    product_id: number;
    variant_id: number;
    token: string | null;
  }) => {
    const res = await axios.put(
      `${BASE_URL}/cart/increment`,
      { product_id, variant_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      product_id,
      variant_id,
      quantity: res.data.data.quantity,
      sub_total: res.data.data.sub_total,
      discount: res.data.data.discount,
      net_amount: res.data.data.net_amount,
      tax: res.data.data.tax,
      payable_amount: res.data.data.payable_amount,
    };
  }
);

// Decrement quantity
export const decrementCart = createAsyncThunk(
  "cart/decrementCart",
  async ({
    product_id,
    variant_id,
    token,
  }: {
    product_id: number;
    variant_id: number;
    token: string | null;
  }) => {
    const res = await axios.put(
      `${BASE_URL}/cart/decrement`,
      { product_id, variant_id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      product_id,
      variant_id,
      quantity: res.data.data.quantity,
      sub_total: res.data.data.sub_total,
      discount: res.data.data.discount,
      net_amount: res.data.data.net_amount,
      tax: res.data.data.tax,
      payable_amount: res.data.data.payable_amount,
    };
  }
);


export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // For instant UI updates if needed
    updateQuantity: (
      state,
      action: PayloadAction<{
        product_id: number;
        variant_id: number;
        quantity: number;
      }>
    ) => {
      const index = state.items.findIndex(
        (item) =>
          item.product_id === action.payload.product_id &&
          item.variant_id === action.payload.variant_id
      );
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // getCart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.sub_total = action.payload.sub_total;
        state.discount = action.payload.discount;
        state.net_amount = action.payload.net_amount;
        state.tax = action.payload.tax;
        state.payable_amount = action.payload.payable_amount;
      })
      .addCase(getCart.rejected, (state) => {
        state.loading = false;
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const { product_id, variant_id, quantity, sub_total, discount, net_amount, tax, payable_amount } = action.payload;

        const existing = state.items.find(
          (item) => item.product_id === product_id && item.variant_id === variant_id
        );
        if (existing) {
          existing.quantity = quantity;
        } else {
          state.items.push({
            id: Date.now(),
            product_id,
            variant_id,
            product_name: "",
            variant_name: "",
            quantity,
          });
        }

        // ✅ Always update amounts
        state.sub_total = sub_total;
        state.discount = discount;
        state.net_amount = net_amount;
        state.tax = tax;
        state.payable_amount = payable_amount;
      })
      .addCase(addToCart.rejected, (state) => {
        state.loading = false;
      })

      // incrementCart
      .addCase(incrementCart.fulfilled, (state, action) => {
        const { product_id, variant_id, quantity, sub_total, discount, net_amount, tax, payable_amount } = action.payload;

        const existing = state.items.find(
          (item) => item.product_id === product_id && item.variant_id === variant_id
        );
        if (existing) {
          existing.quantity = quantity;
        }

        // Update amounts
        state.sub_total = sub_total;
        state.discount = discount;
        state.net_amount = net_amount;
        state.tax = tax;
        state.payable_amount = payable_amount;
      })

      .addCase(decrementCart.fulfilled, (state, action) => {
        const { product_id, variant_id, quantity, sub_total, discount, net_amount, tax, payable_amount } = action.payload;

        if (quantity === 0) {
          // Remove item from cart
          state.items = state.items.filter(
            (item) => !(item.product_id === product_id && item.variant_id === variant_id)
          );

          // Optional: If API doesn't send amounts after removal, reset to 0 or keep old values until refreshed
          if (sub_total !== undefined) {
            state.sub_total = sub_total;
            state.discount = discount;
            state.net_amount = net_amount;
            state.tax = tax;
            state.payable_amount = payable_amount;
          }
        } else {
          const existing = state.items.find(
            (item) => item.product_id === product_id && item.variant_id === variant_id
          );
          if (existing) {
            existing.quantity = quantity;
          }

          // Update amounts if present
          if (sub_total !== undefined) {
            state.sub_total = sub_total;
            state.discount = discount;
            state.net_amount = net_amount;
            state.tax = tax;
            state.payable_amount = payable_amount;
          }
        }
      })

  },
});

export const { updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
