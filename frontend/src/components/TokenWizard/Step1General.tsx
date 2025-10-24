import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import { HelpCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../../redux/tokenSlice';
import { RootState } from '../../redux/store';

export const Step1General: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.token.config);

  const handleChange = (field: string, value: any) => {
    dispatch(updateConfig({ [field]: value }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Token General Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define the basic information for your ERC-3643 compliant security token
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Token Name
            </Typography>
            <Tooltip 
              title="The full legal name of your security token. This will be displayed on blockchain explorers and in wallets. Example: 'Acme Real Estate Investment Token'"
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ p: 0.5 }}>
                <HelpCircle size={16} />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            value={config.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            required
            placeholder="e.g., Acme Real Estate Token"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Token Symbol
            </Typography>
            <Tooltip 
              title="A short 3-6 character ticker symbol for your token, similar to stock tickers (e.g., AAPL, TSLA). Use only uppercase letters. This will be displayed alongside the token name."
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ p: 0.5 }}>
                <HelpCircle size={16} />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            value={config.symbol || ''}
            onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
            fullWidth
            required
            placeholder="e.g., ACME"
            inputProps={{ maxLength: 6 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Decimals
            </Typography>
            <Tooltip 
              title={
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Decimals determine how divisible your token is:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>0 decimals:</strong> Whole units only (e.g., real estate shares)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>2 decimals:</strong> Like USD cents (e.g., $100.00)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • <strong>6 decimals:</strong> Like stablecoins (USDC, USDT)
                  </Typography>
                  <Typography variant="body2">
                    • <strong>18 decimals:</strong> Like ETH, maximum divisibility
                  </Typography>
                </Box>
              }
              arrow
              placement="top"
            >
              <IconButton size="small" sx={{ p: 0.5 }}>
                <HelpCircle size={16} />
              </IconButton>
            </Tooltip>
          </Box>
          <FormControl 
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <InputLabel>Select decimals</InputLabel>
            <Select
              value={config.decimals ?? 18}
              onChange={(e) => handleChange('decimals', e.target.value)}
              label="Select decimals"
            >
              <MenuItem value={0}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>0 - Whole units only</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Best for indivisible assets like real estate shares
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={2}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>2 - Like fiat currency</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Similar to dollars and cents (e.g., $100.00)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={6}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>6 - Stablecoin standard</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Used by USDC, USDT (1,000,000 = 1 token)
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value={18}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>18 - Ethereum standard</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Maximum divisibility, like ETH
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>What is ERC-3643?</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ERC-3643 is a security token standard that enables compliant token transfers with built-in KYC/AML verification, 
          transfer restrictions, and regulatory compliance rules enforced at the smart contract level.
        </Typography>
      </Box>
    </Box>
  );
};