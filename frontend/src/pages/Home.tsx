import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Shield, FileCheck, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useSelector((state: RootState) => state.wallet);

  const features = [
    {
      icon: Shield,
      title: 'ERC-3643 Compliant',
      description: 'Full implementation of the T-REX security token standard',
    },
    {
      icon: FileCheck,
      title: 'Identity Management',
      description: 'Built-in ONCHAINID integration for KYC/AML compliance',
    },
    {
      icon: Lock,
      title: 'Compliance Rules',
      description: 'Configurable transfer restrictions and investor limits',
    },
    {
      icon: Zap,
      title: 'Fast Deployment',
      description: 'Deploy your complete token suite in minutes',
    },
  ];

  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/create');
    } else {
      const connectButton = document.querySelector('[data-wallet-connect]');
      if (connectButton instanceof HTMLElement) {
        connectButton.click();
      }
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            pt: { xs: 12, md: 20 },
            pb: { xs: 8, md: 12 },
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
            }}
          >
            Create ERC-3643 Tokens. No Code Required.
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              mb: 5,
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              fontWeight: 400,
            }}
          >
            Deploy compliant security tokens using the official T-REX protocol contracts. Free, open source, and ready in minutes.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'secondary.main',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              '&:hover': {
                bgcolor: 'secondary.dark',
              },
            }}
          >
            {isConnected ? 'Start Creating' : 'Connect Wallet to Start'}
          </Button>
        </Box>
      </Container>

      <Box 
        sx={{           
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            sx={{ mb: 2 }}
          >
            Why ERC-3643?
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              maxWidth: 700, 
              mx: 'auto',
            }}
          >
            The leading standard for permissioned tokens on Ethereum, designed specifically for regulatory-compliant security tokens
          </Typography>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
            }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent sx={{ 
                    textAlign: 'center',
                    p: 4,
                    flex: 1,
                  }}>
                    <Box sx={{ 
                      color: 'text.primary', 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                      <IconComponent size={32} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>

      <Box 
        sx={{           
          py: { xs: 8, md: 12 },
          bgcolor: 'background.paper',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ mb: 2 }}>
            What is ERC-3643?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            ERC-3643 (T-REX) is a comprehensive suite of smart contracts that enables the issuance and management of security tokens fully compliant with regulatory requirements. Built for real-world asset tokenization, it provides:
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              On-chain identity verification through ONCHAINID
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Programmable transfer restrictions based on compliance rules
            </Typography>
            <Typography component="li" variant="body1" sx={{ mb: 1 }}>
              Built-in KYC/AML integration
            </Typography>
            <Typography component="li" variant="body1">
              Flexible compliance rules enforcement at the protocol level
            </Typography>
          </Box>
        </Container>
      </Box>

      <Box 
        sx={{           
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 2 }}>
            Audited & Secure
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              maxWidth: 700, 
              mx: 'auto',
            }}
          >
            The T-REX protocol has been audited by leading blockchain security firms to ensure the highest standards of security and reliability
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card 
              sx={{ 
                maxWidth: 500,
                width: '100%',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                }}>
                  <Typography variant="h5" fontWeight={600}>
                    Hacken
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2023
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2 }}
                >
                  10/10
                </Typography>
                <Box sx={{ 
                  display: 'inline-block',
                  px: 2,
                  py: 0.5,
                  bgcolor: 'success.main',
                  color: 'white',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  mb: 2,
                }}>
                  Well-Secured
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Button
                    href="https://tokeny.com/wp-content/uploads/2023/04/Tokeny_TREX-v4_SC_Audit_Report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      textDecoration: 'underline',
                      p: 0,
                      minWidth: 0,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    View Full Report →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};