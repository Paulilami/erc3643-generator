import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Alert,
  Snackbar,
  Chip,
  IconButton,
} from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setWallet, disconnectWallet } from '../../redux/walletSlice';
import { toggleTheme } from '../../redux/themeSlice';
import { RootState } from '../../redux/store';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const SUPPORTED_NETWORKS: { [key: number]: string } = {
  31337: 'Hardhat Local',
  1337: 'Localhost',
  11155111: 'Sepolia Testnet',
};

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { address, isConnected, chainId } = useSelector((state: RootState) => state.wallet);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (isConnecting || isConnected) return;

    try {
      setIsConnecting(true);
      setError(null);

      if (!window.ethereum) {
        setError('Please install MetaMask to use this application');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      const network = await provider.getNetwork();
      if (!SUPPORTED_NETWORKS[network.chainId]) {
        setError(`Unsupported network. Please switch to Localhost (31337) or Sepolia (11155111). Current: ${network.chainId}`);
        return;
      }

      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      dispatch(
        setWallet({
          address: accounts[0],
          chainId: network.chainId,
          provider,
          signer,
        })
      );
    } catch (err: any) {
      if (err.code === -32002) {
        setError('Please check your wallet - there is already a pending connection request');
      } else if (err.code === 4001) {
        console.log('User rejected connection');
      } else {
        console.error('Failed to connect wallet:', err);
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          dispatch(disconnectWallet());
        } else if (isConnected) {
          window.location.reload();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [dispatch, isConnected]);

  const isWrongNetwork = isConnected && !SUPPORTED_NETWORKS[chainId || 0];

  return (
    <>
      <AppBar position="static" elevation={0} color="default">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '1.125rem',
              }}
            >
              ERC-3643 Token Generator
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                component={RouterLink}
                to="/create"
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                }}
              >
                Create Token
              </Button>

              <IconButton
                onClick={handleToggleTheme}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  width: 40,
                  height: 40,
                }}
              >
                {themeMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </IconButton>

              {isConnected ? (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </Typography>
                    {chainId && (
                      <Chip 
                        label={SUPPORTED_NETWORKS[chainId] || `Chain ${chainId}`}
                        size="small"
                        color={SUPPORTED_NETWORKS[chainId] ? "success" : "error"}
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleDisconnect}
                    size="small"
                    sx={{
                      borderColor: 'divider',
                      color: 'text.primary',
                    }}
                  >
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  data-wallet-connect
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'secondary.dark',
                    },
                  }}
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {isWrongNetwork && (
        <Box sx={{ bgcolor: 'error.main', color: 'white', py: 1 }}>
          <Container maxWidth="lg">
            <Typography variant="body2" align="center">
              ⚠️ Wrong network. Please switch to Localhost (31337) or Sepolia Testnet (11155111) in MetaMask
            </Typography>
          </Container>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};