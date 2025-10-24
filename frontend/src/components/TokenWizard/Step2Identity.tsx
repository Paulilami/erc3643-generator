import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Chip,
  Alert,
} from '@mui/material';
import { Plus, Trash2, HelpCircle, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateConfig } from '../../redux/tokenSlice';
import { RootState } from '../../redux/store';
import { ethers } from 'ethers';
import { CLAIM_TOPICS } from '../../utils/compliancePresets';

const CLAIM_TOPIC_NAMES: { [key: number]: string } = {
  [CLAIM_TOPICS.KYC]: 'KYC',
  [CLAIM_TOPICS.AML]: 'AML',
  [CLAIM_TOPICS.ACCREDITATION]: 'Accreditation',
  [CLAIM_TOPICS.INVESTOR_TYPE]: 'Investor Type',
};

const CLAIM_TOPIC_DESCRIPTIONS: { [key: number]: string } = {
  [CLAIM_TOPICS.KYC]: 'Know Your Customer - Identity verification',
  [CLAIM_TOPICS.AML]: 'Anti-Money Laundering - Sanctions screening',
  [CLAIM_TOPICS.ACCREDITATION]: 'Verify accredited investor status',
  [CLAIM_TOPICS.INVESTOR_TYPE]: 'Classify investor type (retail/institutional)',
};

export const Step2Identity: React.FC = () => {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.token.config);
  const [newIssuer, setNewIssuer] = useState('');
  const [selectedClaimTopics, setSelectedClaimTopics] = useState<number[]>([]);
  const [error, setError] = useState('');

  const handleAddIssuer = () => {
    setError('');

    if (!newIssuer) {
      setError('Please enter an issuer address');
      return;
    }
    
    if (!ethers.utils.isAddress(newIssuer)) {
      setError('Invalid Ethereum address format');
      return;
    }

    const trustedIssuers = config.trustedIssuers || [];
    if (trustedIssuers.includes(newIssuer)) {
      setError('This issuer is already added');
      return;
    }

    if (selectedClaimTopics.length === 0) {
      setError('Please select at least one claim topic');
      return;
    }

    const issuerClaimTopics = config.issuerClaimTopics || [];

    dispatch(
      updateConfig({
        trustedIssuers: [...trustedIssuers, newIssuer],
        issuerClaimTopics: [...issuerClaimTopics, selectedClaimTopics],
      })
    );
    setNewIssuer('');
    setSelectedClaimTopics([]);
  };

  const handleRemoveIssuer = (index: number) => {
    const trustedIssuers = [...(config.trustedIssuers || [])];
    const issuerClaimTopics = [...(config.issuerClaimTopics || [])];
    
    trustedIssuers.splice(index, 1);
    issuerClaimTopics.splice(index, 1);
    
    dispatch(updateConfig({ trustedIssuers, issuerClaimTopics }));
  };

  const handleClaimTopicToggle = (topic: number) => {
    if (selectedClaimTopics.includes(topic)) {
      setSelectedClaimTopics(selectedClaimTopics.filter(t => t !== topic));
    } else {
      setSelectedClaimTopics([...selectedClaimTopics, topic]);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Identity & Trusted Issuers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure trusted entities that can verify investor identities and issue claims
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
          <Shield size={18} style={{ marginTop: 2, flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
              How Identity Verification Works
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Each investor needs an ONCHAINID (on-chain identity) with claims signed by trusted issuers. 
              These claims prove they've completed KYC, AML checks, and meet investor requirements. 
              The token contract automatically verifies these claims before allowing any transfers.
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
            Add Trusted Issuer
          </Typography>
          <Tooltip 
            title="A trusted issuer is a KYC/AML provider or verification service (like Persona, Jumio, or Onfido) that can issue claims about investor identities. You can also add your own wallet address for testing purposes."
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
                Issuer Wallet Address
              </Typography>
              <Tooltip 
                title="The Ethereum address of the entity that will sign investor claims. This could be a KYC provider's address, or your own wallet address for testing."
                arrow
                placement="top"
              >
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              value={newIssuer}
              onChange={(e) => {
                setNewIssuer(e.target.value);
                setError('');
              }}
              fullWidth
              placeholder="0x..."
              error={!!error && error.includes('address')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                Authorized Claim Topics
              </Typography>
              <Tooltip 
                title="Select which types of claims this issuer is authorized to verify. For example, a KYC provider can verify KYC and AML claims, while an accreditation service verifies investor accreditation."
                arrow
                placement="top"
              >
                <IconButton size="small" sx={{ p: 0.5 }}>
                  <HelpCircle size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {Object.entries(CLAIM_TOPICS).map(([key, value]) => (
                <Box
                  key={value}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: selectedClaimTopics.includes(value) ? 'secondary.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.default',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'secondary.main',
                    },
                  }}
                  onClick={() => handleClaimTopicToggle(value)}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedClaimTopics.includes(value)}
                        onChange={() => handleClaimTopicToggle(value)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {CLAIM_TOPIC_NAMES[value]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {CLAIM_TOPIC_DESCRIPTIONS[value]}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </Box>
            {error && error.includes('claim') && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {error}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            onClick={handleAddIssuer}
            startIcon={<Plus size={18} />}
            disabled={!newIssuer || selectedClaimTopics.length === 0}
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
          >
            Add Trusted Issuer
          </Button>

          {error && (
            <Alert severity="error" sx={{ border: 1, borderColor: 'error.main' }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>

      {config.trustedIssuers && config.trustedIssuers.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Trusted Issuers ({config.trustedIssuers.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {config.trustedIssuers.map((issuer, index) => (
              <Box
                key={issuer}
                sx={{
                  p: 2.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                      Issuer #{index + 1}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        mb: 1.5,
                        wordBreak: 'break-all',
                        fontSize: '0.875rem',
                      }}
                    >
                      {issuer}
                    </Typography>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Can verify:
                      </Typography>
                      {(config.issuerClaimTopics?.[index] || []).map((topic) => (
                        <Chip
                          key={topic}
                          label={CLAIM_TOPIC_NAMES[topic]}
                          size="small"
                          sx={{
                            bgcolor: 'background.default',
                            border: 1,
                            borderColor: 'divider',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveIssuer(index)}
                    sx={{
                      ml: 2,
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'white',
                      },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {(!config.trustedIssuers || config.trustedIssuers.length === 0) && (
        <Alert 
          severity="warning"
          sx={{ 
            border: 1, 
            borderColor: 'warning.main',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2">
            No trusted issuers configured yet. You can add them now or after deployment. 
            For testing, you can add your own wallet address as a trusted issuer.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};