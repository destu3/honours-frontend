import { useState, ChangeEvent } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import supabase from '../../services/supabase/supabase';
import { showAlert } from '../../store/slices/alertSlice';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    const { email, password, name } = formData;

    // Validate fields
    if (!email || !password || !name) {
      dispatch(showAlert({ message: 'Please fill in all fields.', severity: 'warning' }));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    if (error) {
      dispatch(showAlert({ message: error.message, severity: 'error' }));
      console.error('Error during sign-up:', error);
      return;
    }

    dispatch(showAlert({ message: 'Sign-up successful!', severity: 'success' }));
    console.log('Sign-up successful:', data);

    setTimeout(() => {
      location.href = '/profile-select';
    }, 2000);
  };

  const handleGoogleSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      dispatch(showAlert({ message: error.message, severity: 'error' }));
      console.error('Error during Google sign-up:', error);
      return;
    }

    dispatch(showAlert({ message: 'Google sign-up successful!', severity: 'success' }));
    console.log('Google sign-in successful:', data);
  };

  return (
    <Container maxWidth="xs">
      <Typography
        sx={{ color: 'primary.main' }}
        width={'fit-content'}
        fontFamily={'Montserrat'}
        variant="h4"
        fontWeight={600}
        mx={'auto'}
        mb={3}
      >
        Create an account
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
        <TextField name="name" label="Full name" variant="outlined" fullWidth required onChange={handleChange} />

        <Button variant="contained" color="primary" fullWidth size="large" onClick={handleSignUp}>
          Sign up
        </Button>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        size="large"
        startIcon={<Google />}
        sx={{ mt: '1rem', textTransform: 'none', bgcolor: '#f1f1f1' }}
        onClick={handleGoogleSignUp}
      >
        {'Sign up with Google'.toUpperCase()}
      </Button>
    </Container>
  );
};

export default Register;
