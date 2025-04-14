import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  useTheme,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Savings as SavingsIcon, Restaurant as NeedsIcon, ShoppingCart as WantsIcon } from '@mui/icons-material';
import { getGoals } from '../../services/goal/goalService';
import { getUserId } from '../../utils/authUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip, Legend } from 'recharts';

type Goal = {
  id: string;
  name: string;
  target_amount: number;
  current_progress: number;
  type: string;
};

type FinancialProfile = {
  needs_budget: number;
  wants_budget: number;
  savings_budget: number;
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { name: string; value: number; payload: { percent?: number } }[];
}> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card
        sx={{
          p: 1.5,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          {payload[0].name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Amount: £{payload[0].value.toFixed(2)}
        </Typography>
      </Card>
    );
  }
  return null;
};

export default function Goals() {
  const theme = useTheme();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const userId = await getUserId();
        if (userId) {
          const data = await getGoals(userId);
          setGoals(data.goals);
          setFinancialProfile(data.financialProfile);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 8,
          pt: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Container>
    );
  }

  if (!financialProfile) return null;

  const { needs_budget, wants_budget, savings_budget } = financialProfile;
  const totalBudget = needs_budget + wants_budget + savings_budget;

  const budgetCategories = [
    { type: 'needs', budget: needs_budget, icon: <NeedsIcon />, color: 'primary' as const },
    { type: 'wants', budget: wants_budget, icon: <WantsIcon />, color: 'secondary' as const },
    { type: 'savings', budget: savings_budget, icon: <SavingsIcon />, color: 'success' as const },
  ];

  const getGoalProgress = (target: number) => {
    const goal = goals.find(g => g.target_amount === target);
    return goal
      ? {
          current: goal.current_progress,
          percentage: (goal.current_progress / target) * 100,
          isOver: goal.current_progress > target,
          name: goal.name,
        }
      : null;
  };

  const breakdownData = [
    { name: 'Needs', value: needs_budget, color: theme.palette.primary.main },
    { name: 'Wants', value: wants_budget, color: theme.palette.secondary.main },
    { name: 'Savings', value: savings_budget, color: theme.palette.success.main },
  ];

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main];

  return (
    <Container maxWidth="xl" sx={{ py: 8, pt: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 6,
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2.2rem' },
              color: theme.palette.primary.main,
            }}
          >
            Budget Goals
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Track your spending targets and savings progress
          </Typography>
        </Box>

        <Card
          sx={{
            minWidth: 200,
            px: 2,
            py: 1.5,
            borderRadius: 4,
            background: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            Total Budget Allocation
          </Typography>
          <Typography variant="h5" color="textPrimary" fontWeight={600}>
            £{totalBudget.toFixed(2)}
          </Typography>
        </Card>
      </Box>

      {/* Progress Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
        {budgetCategories.map(({ type, budget, icon, color }) => {
          const progress = getGoalProgress(budget);
          if (!progress) return null;

          return (
            <Card
              key={type}
              sx={{
                borderRadius: 4,
                boxShadow: theme.shadows[2],
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette[color].main, 0.1),
                      color: theme.palette[color].main,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="600" fontSize="1.1rem">
                      {progress.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(progress.percentage, 100)}
                      sx={{
                        height: 10,
                        borderRadius: 4,
                        mt: 2,
                        backgroundColor: alpha(theme.palette[color].main, 0.1),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: progress.isOver ? theme.palette.error.main : theme.palette[color].main,
                        },
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" mt={1.5}>
                      <Typography variant="body2" color={progress.isOver ? 'error.main' : 'text.secondary'} fontWeight={600}>
                        {progress.isOver ? 'Limit Exceeded' : `${progress.percentage.toFixed(1)}%`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        £{progress.current.toFixed(2)} of £{budget.toFixed(2)}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Breakdown Section */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: theme.shadows[2],
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 4 }}>
            Budget Allocation Breakdown
          </Typography>

          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  fontWeight={600}
                  fontFamily={theme.typography.fontFamily}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  innerRadius={70}
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  animationDuration={500}
                  animationEasing="ease-out"
                >
                  {breakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  <Label
                    value="Breakdown"
                    position="center"
                    style={{
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                      fill: theme.palette.text.secondary,
                    }}
                  />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    fontFamily: theme.typography.fontFamily,
                    paddingTop: '20px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
