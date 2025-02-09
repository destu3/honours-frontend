import { useState, ChangeEvent } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { Google } from '@mui/icons-material';
import { signUp } from '../../services/user/userService';
import supabase from '../../services/supabase/supabase';
const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async () => {
    try {
      const data = await signUp(formData.email, formData.name, formData.password);
      console.log('Sign-up successful:', data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignUp = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error during Google sign-in:', error);
      return;
    }

    console.log('Google sign-in successful:', data);
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: 'primary.main' }} fontFamily={'Montserrat'} variant="h4" fontWeight={600} mb={3}>
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
