import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Chip,
  Alert,
  Grid,
} from '@mui/material';
import { CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { CLAIM_TOPICS } from '../../utils/compliancePresets';

const CLAIM_TOPIC_NAMES: { [key: number]: string } = {
  [CLAIM_TOPICS.KYC]: 'KYC',
  [CLAIM_TOPICS.AML]: 'AML',
  [CLAIM_TOPICS.ACCREDITATION]: 'Accreditation',
  [CLAIM_TOPICS.INVESTOR_TYPE]: 'Investor Type',
};

export const Step4Review: React.FC = () => {
  const config = useSelector((state: RootState) => state.token.config);

  const getClaimTopicName = (topic: number) => {
    return CLAIM_TOPIC_NAMES[topic] || `Topic ${topic}`;
  };

  const isValid = () => {
    return (
      config.name &&
      config.symbol &&
      config.decimals !== undefined &&
      config.claimTopics &&
      config.claimTopics.length > 0
    );
  };

  const InfoRow = ({ label, value, mono = false }: { label: string; value: string | React.ReactNode; mono?: boolean }) => (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Typography 
        variant="body1" 
        fontWeight={500}
        sx={{ 
          fontFamily: mono ? 'monospace' : 'inherit',
          fontSize: mono ? '0.875rem' : '1rem',
        }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Review & Confirm
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review your ERC-3643 token configuration before deployment
        </Typography>
      </Box>

      {!isValid() && (
        <Alert 
          severity="error"
          sx={{ 
            border: 1, 
            borderColor: 'error.main',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
            <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography variant="body2">
              Please complete all required fields in previous steps (name, symbol, and at least one claim topic)
            </Typography>
          </Box>
        </Alert>
      )}

      <Box
        sx={{
          p: 3,
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Token Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Token Name" value={config.name || 'Not set'} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Token Symbol" value={config.symbol || 'Not set'} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Decimals" value={config.decimals?.toString() || '18'} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Initial Supply" value={config.initialSupply || '0'} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoRow label="Standard" value="ERC-3643 (T-REX)" />
          </Grid>
        </Grid>
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
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Identity & Trusted Issuers
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {config.trustedIssuers && config.trustedIssuers.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {config.trustedIssuers.map((issuer, index) => (
              <Box
                key={issuer}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'background.default',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                  Issuer #{index + 1}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.875rem', 
                    mb: 1.5,
                    wordBreak: 'break-all',
                  }}
                >
                  {issuer}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                    Can verify:
                  </Typography>
                  {(config.issuerClaimTopics?.[index] || []).map((topic) => (
                    <Chip
                      key={topic}
                      label={getClaimTopicName(topic)}
                      size="small"
                      sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        height: 24,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert 
            severity="warning"
            sx={{ 
              border: 1, 
              borderColor: 'warning.main',
              bgcolor: 'background.default',
            }}
          >
            <Typography variant="body2">
              ⚠️ No trusted issuers configured. Add them after deployment before minting tokens.
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
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Compliance Rules
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Required Claim Topics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {config.claimTopics && config.claimTopics.length > 0 ? (
                config.claimTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={getClaimTopicName(topic)}
                    sx={{
                      bgcolor: 'background.default',
                      border: 1,
                      borderColor: 'secondary.main',
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="error.main">
                  ⚠️ No claim topics selected
                </Typography>
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InfoRow label="Maximum Token Holders" value={config.maxInvestors?.toString() || '2000'} />
            </Grid>
            {config.maxTokensPerInvestor && (
              <Grid item xs={12} sm={6}>
                <InfoRow label="Maximum Tokens Per Investor" value={config.maxTokensPerInvestor} />
              </Grid>
            )}
          </Grid>

          {config.allowedCountries && config.allowedCountries.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Allowed Countries
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {config.allowedCountries.map((country) => (
                  <Chip
                    key={country}
                    label={country}
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
          )}
        </Box>
      </Box>

      <Box
        sx={{
          p: 3,
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'secondary.main',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Layers size={24} />
          <Typography variant="h6">
            Deployment Information
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The following ERC-3643 compliant contracts will be deployed:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Token Contract (ERC-3643/ERC-20)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Identity Registry</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Identity Registry Storage</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Modular Compliance Contract</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Claim Topics Registry</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle2 size={16} />
            <Typography variant="body2">Trusted Issuers Registry</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">
          Estimated gas cost: ~0.05 - 0.15 ETH on mainnet (free on localhost/testnet)
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
        <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
          After deployment, you'll be able to:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Register investor identities in the Identity Registry<br />
          • Mint tokens to verified investors using the Token Contract<br />
          • Manage compliance rules and transfer restrictions<br />
          • Transfer ownership and agent roles through contract interfaces
        </Typography>
      </Alert>
    </Box>
  );
};