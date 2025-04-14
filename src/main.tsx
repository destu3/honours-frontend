import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import theme from './mui.config.ts';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import Register from './pages/register/Register.tsx';
import Login from './pages/login/Login.tsx';
import ProfileSelection from './pages/profile-selection/ProfileSelection.tsx';
import Transactions from './pages/transactions/Transactions.tsx';
import Goals from './pages/goals/Goals.tsx';
import './index.css';
import './services/supabase/supabase.ts';
import store from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* Wrap the entire app with Redux Provider */}
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Home />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="profile-select" element={<ProfileSelection />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="goals" element={<Goals />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
