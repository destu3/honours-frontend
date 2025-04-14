import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  useTheme,
  Avatar,
  Stack,
  CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Confetti from 'react-confetti';
import { getTransactions, generateTransactions } from '../../services/transaction/transactionService';
import { getAccountIdFromUserId, getCurrentAccountBalance } from '../../services/account/accountService';
import { getUserId } from '../../utils/authUtils';
import { Restaurant as NeedsIcon, ShoppingCart as WantsIcon, Savings as SavingsIcon } from '@mui/icons-material';
import { formatDate, formatPound } from '../../utils/transactionUtils';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../store/slices/alertSlice';

type Transaction = {
  id: string;
  category: 'needs' | 'wants' | 'savings';
  amount: number;
  description: string;
  created_at: string;
};

interface Notification {
  type: 'goal_completed' | 'goal_nearly_completed';
  message: string;
  goalName?: string;
  firstTimeCompletion?: boolean;
}

const notificationSummarizer = (notifications: Notification[]): string => {
  if (notifications.length === 0) return '';
  const goalsCompleted = notifications.filter(n => n.type === 'goal_completed');
  const goalsCompletedNames = goalsCompleted.map(n => n.goalName).join(', ');
  const nearlyCompleted = notifications.filter(n => n.type === 'goal_nearly_completed');
  const nearlyCompletedNames = nearlyCompleted.map(n => n.goalName).join(', ');

  const completedSummary =
    goalsCompleted.length > 0 ? `You have completed ${goalsCompleted.length} goal(s): ${goalsCompletedNames}.` : '';
  const nearlySummary =
    nearlyCompleted.length > 0 ? `You have nearly completed ${nearlyCompleted.length} goal(s): ${nearlyCompletedNames}.` : '';

  return `${completedSummary} ${nearlySummary}`.trim();
};

export default function Transactions() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountId, setAccountId] = useState<string>('');
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const userId = await getUserId();
        const { accountId } = await getAccountIdFromUserId(userId);
        setAccountId(accountId);

        const transactions = await getTransactions(accountId);
        setTransactions(transactions);

        const { balance } = await getCurrentAccountBalance(accountId);
        setBalance(balance);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleGenerate = async () => {
    const { newTransactions, deductedAmount, notifications } = await generateTransactions(accountId);
    setTransactions([...transactions, ...newTransactions]);

    if (notifications && notifications.length > 0) {
      console.log('Notifications:', notifications);
      if (notifications.filter((n: Notification) => n.type === 'goal_completed' && n.firstTimeCompletion).length > 0) {
        // Activate confetti animation for first-time goal completion
        setIsConfettiActive(true);
        // Automatically turn off confetti after 6 seconds
        setTimeout(() => {
          setIsConfettiActive(false);
        }, 6000);
      }
      dispatch(showAlert({ message: notificationSummarizer(notifications), severity: 'info' }));
    }

    // Update balance when transactions are generated
    setBalance(prevBalance => prevBalance - deductedAmount);
  };

  const getCategoryDetails = (category: 'needs' | 'wants' | 'savings') => {
    switch (category) {
      case 'needs':
        return { icon: <NeedsIcon />, color: 'primary', label: 'Needs' };
      case 'wants':
        return { icon: <WantsIcon />, color: 'secondary', label: 'Wants' };
      case 'savings':
        return { icon: <SavingsIcon />, color: 'success', label: 'Savings' };
      default:
        return { icon: null, color: 'default', label: 'Transaction' };
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8, pt: 4 }}>
      {/* Confetti component that shows when isConfettiActive is true */}
      {isConfettiActive && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
          colors={[
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            '#FFC107', // amber
            '#FF9800', // orange
          ]}
        />
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <>
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
                Transaction History
              </Typography>
              <Typography variant="h6" color="textSecondary">
                Recent financial activities and expenditures
              </Typography>
            </Box>

            <Stack direction="row" spacing={4} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                sx={{
                  alignSelf: 'stretch',
                  fontSize: '1rem',
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  boxShadow: theme.shadows[3],
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                Generate Transactions
              </Button>

              <Card
                sx={{
                  minWidth: 200,
                  px: 2,
                  py: 1.5,
                  borderRadius: 4,
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Available Balance
                </Typography>
                <Typography variant="h5" color="success.main">
                  £{balance.toFixed(2)}
                </Typography>
              </Card>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {transactions.map(tx => {
              const { icon, color, label } = getCategoryDetails(tx.category);

              return (
                <Card
                  key={Math.random()}
                  sx={{
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette[color as 'primary' | 'secondary' | 'success'].main, 0.1),
                          color: theme.palette[color as 'primary' | 'secondary' | 'success'].main,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {icon}
                      </Avatar>

                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {tx.description || 'No description provided'}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={label}
                            color={color as 'primary' | 'secondary' | 'success'}
                            variant="outlined"
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(tx.created_at)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      color={tx.category === 'savings' ? 'success.main' : 'text.primary'}
                      sx={{
                        fontWeight: 'bold',
                        minWidth: 120,
                        textAlign: 'right',
                      }}
                    >
                      {formatPound(tx.amount)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </>
      )}
    </Container>
  );
}
