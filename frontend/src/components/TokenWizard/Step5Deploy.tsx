import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Link,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Download,
  Loader,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getExplorerUrl } from '../../utils/deploy3643';

export const Step5Deploy: React.FC = () => {
  const { deployedSuite, isDeploying, deploymentError } = useSelector(
    (state: RootState) => state.token
  );
  const { chainId } = useSelector((state: RootState) => state.wallet);

  const handleDownloadConfig = () => {
    if (!deployedSuite) return;
    
    const dataStr = JSON.stringify(deployedSuite, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `erc3643-token-suite-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (isDeploying) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          py: 8,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CircularProgress 
            size={100} 
            thickness={2}
            sx={{ color: 'secondary.main' }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Loader size={40} />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight={600}>
          Deploying Token Suite...
        </Typography>
        <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="body2" color="text.secondary">
            This may take a few minutes. Please don't close this window.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your wallet may prompt you to confirm the transaction.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (deploymentError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <XCircle size={48} color="#ef4444" />
          <Typography variant="h5">
            Deployment Failed
          </Typography>
        </Box>
        <Alert 
          severity="error"
          sx={{ 
            border: 1, 
            borderColor: 'error.main',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
            Error Details:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {deploymentError}
          </Typography>
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
          <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
            Common Issues:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            • Insufficient gas funds in your wallet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            • Wrong network selected in MetaMask
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            • Transaction rejected in wallet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Network congestion or RPC issues
          </Typography>
        </Box>
      </Box>
    );
  }

  if (deployedSuite) {
    const contracts = [
      { label: 'Token Contract', address: deployedSuite.token, description: 'Main ERC-3643 token contract' },
      { label: 'Identity Registry', address: deployedSuite.identityRegistry, description: 'Manages investor identities' },
      { label: 'Identity Registry Storage', address: deployedSuite.identityRegistryStorage, description: 'Stores identity data' },
      { label: 'Compliance Module', address: deployedSuite.compliance, description: 'Enforces compliance rules' },
      { label: 'Claim Topics Registry', address: deployedSuite.claimTopicsRegistry, description: 'Manages required claims' },
      { label: 'Trusted Issuers Registry', address: deployedSuite.trustedIssuersRegistry, description: 'Manages claim issuers' },
    ];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CheckCircle size={48} color="#10b981" />
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Deployment Successful! 🎉
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your ERC-3643 token suite has been deployed
            </Typography>
          </Box>
        </Box>

        <Alert 
          severity="success"
          sx={{ 
            border: 1, 
            borderColor: 'success.main',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2">
            All contracts have been successfully deployed and configured on the blockchain. 
            Save the contract addresses below for your records.
          </Typography>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Contract Addresses
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download size={16} />}
              onClick={handleDownloadConfig}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
              }}
            >
              Download JSON
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {contracts.map((contract) => (
              <Box key={contract.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {contract.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    {contract.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      flex: 1,
                    }}
                  >
                    {contract.address}
                  </Typography>
                  {chainId && (
                    <IconButton
                      component={Link}
                      href={getExplorerUrl(contract.address, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <ExternalLink size={16} />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            p: 3,
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            📝 Next Steps
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24 }}>
                1.
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Save Contract Addresses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download or copy the contract addresses above for your records
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24 }}>
                2.
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Register Investor Identities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add investor addresses and their ONCHAINID to the Identity Registry
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24 }}>
                3.
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Issue Identity Claims
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trusted issuers must sign and issue claims (KYC, AML, etc.) to investor identities
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="body2" fontWeight={600} sx={{ minWidth: 24 }}>
                4.
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Mint Tokens
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mint tokens to verified investors using the Token Contract
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Alert 
          severity="info"
          sx={{ 
            border: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body2">
            <strong>Need Help?</strong> Visit the{' '}
            <Link 
              href="https://erc3643.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: 'secondary.main' }}
            >
              ERC-3643 Documentation
            </Link>
            {' '}for guides on identity registration, claim issuance, and token management.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return null;
};