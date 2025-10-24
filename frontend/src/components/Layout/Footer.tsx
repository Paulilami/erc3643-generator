import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
            sx={{ fontSize: '0.875rem' }}
          >
            Powered by{' '}
            <Link 
              href="https://trusset.org" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'secondary.main',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Trusset
            </Link>
          </Typography>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center"
            sx={{ fontSize: '0.75rem' }}
          >
            Free to use • Open source • Built on official T-REX protocol contracts
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <Link 
              href="https://github.com/ERC-3643" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.75rem',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              ERC-3643 Standard
            </Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link 
              href="https://docs.erc3643.org/erc-3643" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.75rem',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              Documentation
            </Link>
            <Typography variant="caption" color="text.secondary">•</Typography>
            <Link 
              href="https://tokeny.com/wp-content/uploads/2023/04/Tokeny_TREX-v4_SC_Audit_Report.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.75rem',
                '&:hover': {
                  color: 'text.primary',
                },
              }}
            >
              Security Audit
            </Link>
          </Box>

          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center"
            sx={{ 
              fontSize: '0.7rem',
              mt: 1,
            }}
          >
            This token generator uses the official smart contracts of the T-REX protocol to provide a unified and simple user experience for creating ERC-3643 compliant security tokens.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};