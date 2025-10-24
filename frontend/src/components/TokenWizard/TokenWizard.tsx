import React from 'react';
import {
  Box,
  Container,
  Paper,
  IconButton,
  Typography,
  Button,
  LinearProgress,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep, setDeploying, setDeployedSuite, setDeploymentError } from '../../redux/tokenSlice';
import { RootState } from '../../redux/store';
import { Step0Contracts } from './Step0Contracts';
import { Step1General } from './Step1General';
import { Step2Identity } from './Step2Identity';
import { Step3Compliance } from './Step3Compliance';
import { Step4Review } from './Step4Review';
import { Step5Deploy } from './Step5Deploy';
import { deployTokenSuite } from '../../utils/deploy3643';
import { TokenConfig } from '../../types/token.types';

const steps = [
  { id: 0, title: 'Contract Setup', subtitle: 'Deploy your contract infrastructure' },
  { id: 1, title: 'General Details', subtitle: 'Basic token information' },
  { id: 2, title: 'Identity & Issuers', subtitle: 'Configure trusted claim issuers' },
  { id: 3, title: 'Compliance', subtitle: 'Set regulatory requirements' },
  { id: 4, title: 'Review', subtitle: 'Confirm your configuration' },
  { id: 5, title: 'Deploy', subtitle: 'Deploy to blockchain' },
];

export const TokenWizard: React.FC = () => {
  const dispatch = useDispatch();
  const { currentStep, config, deployedSuite, isDeploying, contractAddresses } = useSelector(
    (state: RootState) => state.token
  );
  const { signer, isConnected } = useSelector((state: RootState) => state.wallet);

  const handleNext = async () => {
    if (currentStep === 0 && !contractAddresses) {
      alert('Please deploy contracts first');
      return;
    }

    if (currentStep === 4) {
      if (!isConnected || !signer || !contractAddresses) {
        alert('Please connect your wallet and deploy contracts first');
        return;
      }

      if (!config.name || !config.symbol || !config.claimTopics?.length) {
        alert('Please complete all required fields');
        return;
      }

      dispatch(setCurrentStep(5));
      
      try {
        dispatch(setDeploying(true));
        const suite = await deployTokenSuite(config as TokenConfig, signer, contractAddresses);
        dispatch(setDeployedSuite(suite));
      } catch (error: any) {
        dispatch(setDeploymentError(error.message));
      }
    } else {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    dispatch(setCurrentStep(currentStep - 1));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return !!contractAddresses;
      case 1:
        return config.name && config.symbol && config.decimals !== undefined;
      case 2:
        return true;
      case 3:
        return config.claimTopics && config.claimTopics.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step0Contracts />;
      case 1:
        return <Step1General />;
      case 2:
        return <Step2Identity />;
      case 3:
        return <Step3Compliance />;
      case 4:
        return <Step4Review />;
      case 5:
        return <Step5Deploy />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)', py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                Create ERC-3643 Token
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </Typography>
            </Box>
            {currentStep < 5 && !deployedSuite && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleBack}
                  disabled={currentStep === 0 || isDeploying}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '&:disabled': { opacity: 0.3 },
                  }}
                >
                  <ChevronLeft size={20} />
                </IconButton>
                <IconButton
                  onClick={handleNext}
                  disabled={!canGoNext() || isDeploying}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: currentStep === 4 ? 'secondary.main' : 'transparent',
                    color: currentStep === 4 ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: currentStep === 4 ? 'secondary.dark' : 'action.hover',
                    },
                    '&:disabled': { opacity: 0.3 },
                  }}
                >
                  <ChevronRight size={20} />
                </IconButton>
              </Box>
            )}
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 2,
              bgcolor: 'divider',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'secondary.main',
              },
            }} 
          />
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Paper 
              sx={{ 
                p: { xs: 3, md: 5 },
                minHeight: 500,
                border: 1,
                borderColor: 'divider',
              }}
            >
              {renderStepContent()}
            </Paper>
          </motion.div>
        </AnimatePresence>

        {deployedSuite && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              href="/"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
              }}
            >
              Create Another Token
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};