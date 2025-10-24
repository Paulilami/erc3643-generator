import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { Rocket, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setContractAddresses, setDeployingContracts, setContractDeploymentError } from '../../redux/tokenSlice';
import { RootState } from '../../redux/store';
import { deployContractsWithProgress, getDeployedContracts, DeploymentProgress } from '../../utils/deployContracts';

interface DeploymentStep {
  name: string;
  status: 'pending' | 'deploying' | 'complete' | 'error';
  address?: string;
}

export const Step0Contracts: React.FC = () => {
  const dispatch = useDispatch();
  const { contractAddresses, contractDeploymentError } = useSelector(
    (state: RootState) => state.token
  );
  const { address: userAddress, chainId, isConnected, signer } = useSelector((state: RootState) => state.wallet);
  const [checking, setChecking] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    const checkExistingDeployment = async () => {
      if (!chainId || !userAddress) {
        setChecking(false);
        return;
      }

      setChecking(true);
      try {
        const existing = await getDeployedContracts(userAddress, chainId);
        
        if (existing && existing.trexGateway && existing.trexFactory) {
          dispatch(setContractAddresses(existing));
        }
      } catch (error) {
        console.error('Error checking deployment:', error);
      } finally {
        setChecking(false);
      }
    };

    if (isConnected && userAddress && chainId) {
      checkExistingDeployment();
    }
  }, [chainId, userAddress, isConnected, dispatch]);

  const handleDeploy = async () => {
    if (!isConnected || !userAddress || !chainId || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    setIsDeploying(true);
    dispatch(setDeployingContracts(true));
    dispatch(setContractDeploymentError(null));
    
    const steps: DeploymentStep[] = [
      { name: 'Loading artifacts', status: 'pending' },
      { name: 'Token', status: 'pending' },
      { name: 'ClaimTopicsRegistry', status: 'pending' },
      { name: 'TrustedIssuersRegistry', status: 'pending' },
      { name: 'IdentityRegistryStorage', status: 'pending' },
      { name: 'IdentityRegistry', status: 'pending' },
      { name: 'ModularCompliance', status: 'pending' },
      { name: 'TREXImplementationAuthority', status: 'pending' },
      { name: 'Configuring implementations', status: 'pending' },
      { name: 'TREXFactory', status: 'pending' },
      { name: 'TREXGateway', status: 'pending' },
      { name: 'Transferring ownership', status: 'pending' },
      { name: 'Configuring gateway', status: 'pending' },
    ];
    
    setDeploymentSteps(steps);

    try {
      const addresses = await deployContractsWithProgress(
        chainId,
        userAddress,
        signer,
        (progress: DeploymentProgress) => {
          setDeploymentSteps(prev => {
            const updated = [...prev];
            const stepIndex = updated.findIndex(s => s.name === progress.step);
            
            if (stepIndex !== -1) {
              updated[stepIndex] = {
                name: progress.step,
                status: progress.status === 'deploying' ? 'deploying' : progress.status === 'complete' ? 'complete' : 'error',
                address: progress.address,
              };
            }
            
            return updated;
          });
        }
      );
      
      dispatch(setContractAddresses(addresses));
      setDeploymentSteps([]);
    } catch (error: any) {
      dispatch(setContractDeploymentError(error.message || 'Deployment failed'));
      
      setDeploymentSteps(prev => {
        const updated = [...prev];
        const deployingIndex = updated.findIndex(s => s.status === 'deploying');
        if (deployingIndex !== -1) {
          updated[deployingIndex].status = 'error';
        }
        return updated;
      });
    } finally {
      setIsDeploying(false);
      dispatch(setDeployingContracts(false));
    }
  };

  const handleRedeploy = () => {
    dispatch(setContractAddresses(null));
    dispatch(setContractDeploymentError(null));
    setDeploymentSteps([]);
  };

  if (checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (contractAddresses && contractAddresses.trexGateway && contractAddresses.trexFactory) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
              Contract Infrastructure Ready
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your ERC-3643 contract suite is deployed and ready to use
            </Typography>
          </Box>
          <Tooltip title="Deploy new contracts">
            <IconButton onClick={handleRedeploy} sx={{ color: 'text.secondary' }}>
              <RefreshCw size={20} />
            </IconButton>
          </Tooltip>
        </Box>

        <Alert severity="success" sx={{ border: 1, borderColor: 'success.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle size={18} />
            <Typography variant="body2">
              All contracts are deployed and configured. You can now create tokens.
            </Typography>
          </Box>
        </Alert>

        <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            Deployed Contracts
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                TREX Gateway
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {contractAddresses.trexGateway}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                TREX Factory
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {contractAddresses.trexFactory}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
          Deploy Contract Infrastructure
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Deploy your own ERC-3643 smart contracts using your wallet
        </Typography>
      </Box>

      {!isConnected && (
        <Alert severity="warning" sx={{ border: 1, borderColor: 'warning.main' }}>
          <Typography variant="body2">
            Please connect your wallet to deploy contracts
          </Typography>
          </Alert>
      )}

      <Alert severity="info" sx={{ border: 1, borderColor: 'divider' }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          What will be deployed from your wallet:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Token Implementation Contract<br />
          • Identity Registry Implementation<br />
          • Compliance Module Implementation<br />
          • TREX Factory<br />
          • TREX Gateway (your deployment controller)<br />
          • Implementation Authority
        </Typography>
      </Alert>

      {contractDeploymentError && (
        <Alert severity="error" sx={{ border: 1, borderColor: 'error.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
            <AlertCircle size={18} style={{ marginTop: 2 }} />
            <Box>
              <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                Deployment Failed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-word' }}>
                {contractDeploymentError}
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}

      {isDeploying && deploymentSteps.length > 0 && (
        <Paper sx={{ p: 3, border: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Deployment Progress
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {deploymentSteps.map((step, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                  {step.status === 'pending' && (
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: 2, borderColor: 'divider' }} />
                  )}
                  {step.status === 'deploying' && (
                    <CircularProgress size={20} thickness={5} />
                  )}
                  {step.status === 'complete' && (
                    <CheckCircle size={20} color="#10b981" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle size={20} color="#ef4444" />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={step.status === 'deploying' ? 600 : 400}
                      color={step.status === 'pending' ? 'text.secondary' : 'text.primary'}
                    >
                      {step.name}
                    </Typography>
                    {step.address && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {step.address}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {step.status === 'deploying' && (
                  <LinearProgress sx={{ height: 2, mt: 1 }} />
                )}
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 4, border: 1, borderColor: 'divider', textAlign: 'center' }}>
        {isDeploying ? (
          <Box>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
              <CircularProgress size={60} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Deploying Contracts...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please confirm each transaction in your wallet
            </Typography>
          </Box>
        ) : (
          <Box>
            <Rocket size={60} style={{ marginBottom: 24 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Deploy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You will pay for the deployment gas fees with your connected wallet
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleDeploy}
              disabled={!isConnected || isDeploying}
              sx={{
                bgcolor: isDeploying ? 'action.disabledBackground' : 'secondary.main',
                color: 'white',
                px: 4,
                py: 1.5,
                minWidth: 200,
                position: 'relative',
                '&:hover': {
                  bgcolor: isDeploying ? 'action.disabledBackground' : 'secondary.dark',
                },
                '&:disabled': {
                  bgcolor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              {isDeploying && (
                <CircularProgress 
                  size={20} 
                  sx={{ 
                    position: 'absolute',
                    left: 16,
                    color: 'white'
                  }} 
                />
              )}
              <Box sx={{ ml: isDeploying ? 3 : 0 }}>
                {isDeploying ? 'Deploying...' : isConnected ? 'Deploy Contracts' : 'Connect Wallet First'}
              </Box>
            </Button>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
              Estimated cost: ~0.05-0.15 ETH on mainnet (minimal on testnets)
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};