import { Container, Box, Typography, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { AccountBalanceWallet, ShowChart, Savings, CheckCircle, Security, TipsAndUpdates } from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import React from 'react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function Home() {
  const theme = useTheme();
  const features: FeatureItem[] = [
    {
      icon: <ShowChart fontSize="large" />,
      title: 'Track Spending',
      description: 'Understand where your money goes with smart transaction insights.',
    },
    {
      icon: <Savings fontSize="large" />,
      title: 'Set & Achieve Goals',
      description: 'Define financial milestones and earn rewards as you progress.',
    },
    {
      icon: <CheckCircle fontSize="large" />,
      title: 'Automated Budgeting',
      description: 'Budgets are allocated using the proven 50-30-20 rule.',
    },
    {
      icon: <AccountBalanceWallet fontSize="large" />,
      title: 'Simulated Profiles',
      description: 'Choose from diverse financial scenarios to practice money management.',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Secure & Private',
      description: 'Data encryption ensures a safe financial learning experience.',
    },
    {
      icon: <TipsAndUpdates fontSize="large" />,
      title: 'Personalized Advice',
      description: 'Receive insights and alerts tailored to your spending habits.',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 8, md: 15 },
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
          borderRadius: 4,
          px: 2,
        }}
      >
        <AccountBalanceWallet sx={{ fontSize: { xs: 50, md: 80 }, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" fontSize={{ xs: '1.8rem', md: '2.4rem' }} fontWeight="bold" gutterBottom>
          Master Your Finances with Gamified Learning
        </Typography>
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ maxWidth: 600, mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Learn financial management through interactive budgeting, goal setting, and smart financial insights.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: { xs: 4, md: 6 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: 16, md: 18 },
            borderRadius: 50,
            textTransform: 'none',
            boxShadow: 4,
            '&:hover': {
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          Start Learning Now
        </Button>
      </Box>

      <Grid2 container justifyContent={'center'} spacing={4} sx={{ py: 8 }} id="features">
        {features.map((feature, index) => (
          <Box
            boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
            textAlign={'center'}
            maxWidth={250}
            key={index}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 3,
              },
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                bgcolor: 'primary.light',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              {feature.icon}
            </Box>
            <Typography variant="h5" fontSize={{ xs: '1.2rem', md: '1.5rem' }} fontWeight="bold" gutterBottom>
              {feature.title}
            </Typography>
            <Typography color="textSecondary" fontSize={{ xs: '0.9rem', md: '1rem' }}>
              {feature.description}
            </Typography>
          </Box>
        ))}
      </Grid2>

      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          borderTop: 1,
          borderColor: 'grey.300',
          mt: 8,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Financia. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}
