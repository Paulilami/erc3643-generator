import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { HelpCircle, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../../redux/tokenSlice';
import { RootState } from '../../redux/store';
import { CLAIM_TOPICS } from '../../utils/compliancePresets';

const CLAIM_TOPIC_INFO = {
  [CLAIM_TOPICS.KYC]: {
    name: 'KYC (Know Your Customer)',
    description: 'Verifies investor identity through government-issued documents',
    detail: 'Investors must provide passport, national ID, or driver\'s license verification. This is the most basic requirement for regulated securities.',
  },
  [CLAIM_TOPICS.AML]: {
    name: 'AML (Anti-Money Laundering)',
    description: 'Checks investor against sanctions and PEP databases',
    detail: 'Screens investors against OFAC, UN sanctions lists, and politically exposed persons (PEP) databases to prevent money laundering.',
  },
  [CLAIM_TOPICS.ACCREDITATION]: {
    name: 'Accredited Investor',
    description: 'Verifies investor meets income/net worth requirements',
    detail: 'Confirms investor meets minimum financial thresholds (e.g., $200k annual income or $1M net worth in US) for restricted securities.',
  },
  [CLAIM_TOPICS.INVESTOR_TYPE]: {
    name: 'Investor Type',
    description: 'Categorizes investor as retail, professional, or institutional',
    detail: 'Classifies investors by type (retail, qualified purchaser, QIB) to determine which securities they can access.',
  },
};

export const Step3Compliance: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.token.config);
  const [newCountry, setNewCountry] = useState('');

  const handleClaimTopicChange = (topic: number, checked: boolean) => {
    const claimTopics = config.claimTopics || [];
    if (checked) {
      dispatch(updateConfig({ claimTopics: [...claimTopics, topic] }));
    } else {
      dispatch(
        updateConfig({
          claimTopics: claimTopics.filter((t) => t !== topic),
        })
      );
    }
  };

  const handleAddCountry = () => {
    if (!newCountry || newCountry.length !== 2) {
      alert('Please enter a valid 2-letter ISO country code');
      return;
    }

    const countries = config.allowedCountries || [];
    const countryCode = newCountry.toUpperCase();
    
    if (countries.includes(countryCode)) {
      alert('This country is already added');
      return;
    }

    dispatch(
      updateConfig({
        allowedCountries: [...countries, countryCode],
      })
    );
    setNewCountry('');
  };

  const handleRemoveCountry = (country: string) => {
    const countries = (config.allowedCountries || []).filter((c) => c !== country);
    dispatch(updateConfig({ allowedCountries: countries }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Compliance Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure regulatory compliance rules that will be enforced at the smart contract level
        </Typography>
      </Box>

      <Alert 
        severity="info"
        sx={{ 
          border: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
          <AlertTriangle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
              Compliance Rules Are Immutable
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All token transfers are automatically checked against these rules before execution. 
              Non-compliant transfers will be rejected by the smart contract.
            </Typography>
          </Box>
        </Box>
      </Alert>

      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6">
            Required Claim Topics
          </Typography>
          <Tooltip 
            title="Claims are digital certificates issued by trusted KYC providers that verify investor credentials. Select which claims investors must have to hold your token. Most security tokens require at least KYC verification."
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(CLAIM_TOPICS).map(([key, value]) => {
            const info = CLAIM_TOPIC_INFO[value];
            const isSelected = config.claimTopics?.includes(value) || false;
            
            return (
              <Box
                key={value}
                sx={{
                  p: 2.5,
                  border: 1,
                  borderColor: isSelected ? 'secondary.main' : 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'secondary.main',
                  },
                }}
                onClick={() => handleClaimTopicChange(value, !isSelected)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => handleClaimTopicChange(value, e.target.checked)}
                    sx={{ mt: -0.5 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {info.name}
                      </Typography>
                      <Chip 
                        label={`Topic ${value}`} 
                        size="small" 
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: 'background.paper',
                          border: 1,
                          borderColor: 'divider',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {info.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {info.detail}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {(!config.claimTopics || config.claimTopics.length === 0) && (
          <Alert 
            severity="warning" 
            sx={{ 
              mt: 2,
              border: 1,
              borderColor: 'warning.main',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2">
              Please select at least one claim topic. Most security tokens require KYC at minimum.
            </Typography>
          </Alert>
        )}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6">
            Token Supply
          </Typography>
          <Tooltip 
            title="The number of tokens to mint immediately upon deployment. You can mint additional tokens later through the token contract. Leave at 0 if you want to mint tokens individually to investors after deployment."
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Initial Supply (Premint)
            </Typography>
          </Box>
          <TextField
            type="number"
            value={config.initialSupply || ''}
            onChange={(e) =>
              dispatch(updateConfig({ initialSupply: e.target.value }))
            }
            fullWidth
            placeholder="0"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Leave empty or set to 0 for zero initial supply. You can mint tokens to verified investors later.
          </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6">
            Investor Limits
          </Typography>
          <Tooltip 
            title="Set maximum limits for token holders to help manage regulatory requirements and control token distribution. These limits are common in regulated securities offerings."
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                Maximum Token Holders
              </Typography>
              <Tooltip 
                title="Maximum number of unique addresses that can hold tokens. Common regulatory limits: 2000 for Reg D offerings, 500 for Reg A+ offerings. This helps comply with securities regulations."
                arrow
                placement="top"
              >
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              type="number"
              value={config.maxInvestors || 2000}
              onChange={(e) =>
                dispatch(updateConfig({ maxInvestors: parseInt(e.target.value) }))
              }
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Default is 2000. Adjust based on your offering type and regulatory requirements.
            </Typography>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                Maximum Tokens Per Investor
              </Typography>
              <Tooltip 
                title="Maximum tokens a single investor can hold. This prevents concentration of ownership and can help with regulatory compliance. Leave empty for no per-investor limit."
                arrow
                placement="top"
              >
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              type="number"
              value={config.maxTokensPerInvestor || ''}
              onChange={(e) =>
                dispatch(updateConfig({ maxTokensPerInvestor: e.target.value }))
              }
              fullWidth
              placeholder="No limit"
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Optional: Set a cap on individual holdings to prevent ownership concentration.
            </Typography>
          </Box>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography variant="h6">
            Geographic Restrictions
          </Typography>
          <Tooltip 
            title="Restrict token ownership to specific countries using ISO 3166-1 alpha-2 codes (e.g., US, GB, DE). Leave empty to allow investors from all countries (subject to claim verification)."
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <HelpCircle size={16} />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add ISO country codes (2 letters) to whitelist specific jurisdictions
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Country Code"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value.toUpperCase())}
            placeholder="US"
            inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
            sx={{ 
              width: 200,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'background.default',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddCountry}
            startIcon={<Plus size={18} />}
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
          >
            Add Country
          </Button>
        </Box>

        {config.allowedCountries && config.allowedCountries.length > 0 ? (
          <Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Allowed Countries ({config.allowedCountries.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {config.allowedCountries.map((country) => (
                <Chip
                  key={country}
                  label={country}
                  onDelete={() => handleRemoveCountry(country)}
                  deleteIcon={<Trash2 size={14} />}
                  sx={{
                    bgcolor: 'background.default',
                    border: 1,
                    borderColor: 'divider',
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Alert 
            severity="info"
            sx={{ 
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2">
              No country restrictions. Token can be held by verified investors from any country.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
};