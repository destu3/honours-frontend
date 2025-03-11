import { useState, useEffect, useRef } from 'react';
import { Container, Card, CardContent, Typography, CardActionArea, Box, Chip, useTheme, Button } from '@mui/material';
import { getBaseProfiles } from '../../services/profile/profileService';
import { alpha } from '@mui/material/styles';
import DetailItem from '../../components/DetailItem';
import { createUserFinancialProfile } from '../../services/profile/profileService';
import { createAccounts } from '../../services/account/accountService';
import { getUserId } from '../../utils/authUtils';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../store/slices/alertSlice';

type FinancialProfile = {
  id: number;
  profile_name: string;
  description?: string;
  starting_income: number;
  starting_expenses: number;
  starting_debt: number;
  goals?: string;
};

export default function ProfileSelection(): JSX.Element {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [profiles, setProfiles] = useState<FinancialProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<FinancialProfile | null>(null);
  const selectedProfileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await getBaseProfiles();
        setProfiles(fetchedProfiles);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfiles();
  }, []);

  const handleProfileSelect = async () => {
    if (!selectedProfile) return;
    const userId = await getUserId();
    const { userFinancialProfile } = await createUserFinancialProfile(selectedProfile.id, userId);
    console.log('User financial profile:', userFinancialProfile);
    if (userFinancialProfile) {
      createAccounts(userFinancialProfile.id, userFinancialProfile.current_income);
    }
    dispatch(
      showAlert({
        message: 'Financial profile created successfully! You can now start adding transactions.',
        severity: 'success',
      })
    );

    setTimeout(() => {
      selectedProfileRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const handleCardClick = (profile: FinancialProfile) => {
    setSelectedProfile(profile);
    setTimeout(() => {
      selectedProfileRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8, pt: 0 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2.2rem' },
            color: theme.palette.primary.main,
          }}
        >
          Choose Your Financial Scenario
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Select a profile that matches your current financial situation or learning goals
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'center',
        }}
      >
        {profiles.map(profile => (
          <Box
            key={profile.id}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(33.333% - 32px)' },
              flexGrow: 0,
              flexShrink: 0,
              maxWidth: 400,
            }}
          >
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                border: selectedProfile?.id === profile.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => handleCardClick(profile)} sx={{ height: '100%', p: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {profile.profile_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {profile.description}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={`£${profile.starting_income.toLocaleString()}`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                    <Chip label={`£${profile.starting_debt.toLocaleString()}`} color="error" variant="outlined" size="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>

      {selectedProfile && (
        <Box
          ref={selectedProfileRef}
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 4,
            background: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: 2,
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              mt: 2,
              alignItems: 'center',
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {selectedProfile.profile_name}
              </Typography>
              <Typography variant="body1">{selectedProfile.description}</Typography>
              {selectedProfile.goals && (
                <Typography variant="body1">
                  <strong>Learning Goals:</strong> {selectedProfile.goals}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 2,
                p: 2,
                borderRadius: 3,
                background: theme.palette.background.paper,
                width: '100%',
              }}
            >
              <DetailItem label="Monthly Income" value={`£${selectedProfile.starting_income}`} />
              <DetailItem label="Monthly Expenses" value={`£${selectedProfile.starting_expenses}`} />
              <DetailItem label="Total Debt" value={`£${selectedProfile.starting_debt}`} />
              <DetailItem
                label="Disposable Income"
                value={`£${selectedProfile.starting_income - selectedProfile.starting_expenses}`}
              />
            </Box>
          </Box>
          <Box textAlign="center" mt={4}>
            <Button variant="contained" color="primary" onClick={handleProfileSelect}>
              Select Profile
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
