import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: any | null;
  signer: any | null;
  isConnected: boolean;
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  isConnected: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (
      state,
      action: PayloadAction<{
        address: string;
        chainId: number;
        provider: any;
        signer: any;
      }>
    ) => {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.provider = action.payload.provider;
      state.signer = action.payload.signer;
      state.isConnected = true;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.chainId = null;
      state.provider = null;
      state.signer = null;
      state.isConnected = false;
    },
  },
});

export const { setWallet, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;