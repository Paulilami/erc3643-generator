import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { setWallet, disconnectWallet } from '../redux/walletSlice';
import { RootState } from '../redux/store';

export const useWallet = () => {
  const dispatch = useDispatch();
  const walletState = useSelector((state: RootState) => state.wallet);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      dispatch(
        setWallet({
          address,
          chainId: network.chainId,
          provider,
          signer,
        })
      );

      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to connect wallet:', err);
    }
  };

  const disconnect = () => {
    dispatch(disconnectWallet());
  };

  const switchNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) throw new Error('No wallet found');

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        setError('Please add this network to your wallet');
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return {
    address: walletState.address,
    chainId: walletState.chainId,
    provider: walletState.provider,
    signer: walletState.signer,
    isConnected: walletState.isConnected,
    connectWallet,
    disconnect,
    switchNetwork,
    error,
  };
};

declare global {
  interface Window {
    ethereum?: any;
  }
}