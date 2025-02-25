import { useState, ChangeEvent } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import supabase from '../../services/supabase/supabase';
import { showAlert } from '../../store/slices/alertSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async () => {
    const { email, password } = formData;

    // Check if fields are filled
    if (!email || !password) {
      dispatch(showAlert({ message: 'Please enter both email and password.', severity: 'warning' }));
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch(showAlert({ message: error.message, severity: 'error' }));
      console.error('Error during sign-in:', error);
      return;
    }

    dispatch(showAlert({ message: 'Sign in successful!', severity: 'success' }));
    console.log('Sign-in successful:', data);
    location.href = '/';
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      dispatch(showAlert({ message: error.message, severity: 'error' }));
      console.error('Error during Google sign-in:', error);
      return;
    }

    dispatch(showAlert({ message: 'Google sign in successful!', severity: 'success' }));
    console.log('Google sign-in successful:', data);
  };

  return (
    <Container maxWidth="xs">
      <Typography
        sx={{ color: 'primary.main' }}
        fontFamily={'Montserrat'}
        variant="h4"
        fontWeight={600}
        width={'fit-content'}
        mx={'auto'}
        mb={3}
      >
        Sign in
      </Typography>

      <Box component="form" width="100%" display="flex" flexDirection="column" gap={2}>
        <TextField name="email" label="Email" variant="outlined" fullWidth required onChange={handleChange} />
        <TextField
          name="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          onChange={handleChange}
        />

        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleSignIn}>
          Sign In
        </Button>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<Google />}
        sx={{ mt: '1rem', textTransform: 'none', bgcolor: '#f1f1f1' }}
        onClick={handleGoogleSignIn}
      >
        {'Sign in with Google'.toUpperCase()}
      </Button>
    </Container>
  );
};

export default Login;
