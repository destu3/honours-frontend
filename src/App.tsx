import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Outlet, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import { Fade } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store.ts';
import { hideAlert } from './store/slices/alertSlice.ts';
import supabase from './services/supabase/supabase.ts';
import { Session } from '@supabase/supabase-js';

const drawerWidth = 240;
const navItems = ['Register', 'Login', 'About'];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(prevState => !prevState);
  };

  const alertState = useSelector((state: RootState) => state.alert);
  const dispatch = useDispatch();

  // Check auth status using the Supabase client
  useEffect(() => {
    // Get the initial session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
      } else {
        setSession(data.session);
      }
    };

    getSession();

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const user = session?.user;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
    location.href = '/';
  };

  // Mobile drawer content
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Financia
        </Link>
      </Typography>
      <Divider />
      {user ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={user.user_metadata.full_name} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/transactions" sx={{ textAlign: 'center' }}>
              <ListItemText primary="Transactions" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/goals" sx={{ textAlign: 'center' }}>
              <ListItemText primary="Goals" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                textAlign: 'center',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          {navItems.map(item => (
            <ListItem key={item} disablePadding>
              <ListItemButton
                component={Link}
                to={`/${item.toLowerCase()}`}
                sx={{
                  textAlign: 'center',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Financia
            </Link>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user ? (
              <>
                <Typography variant="body1" component="span" sx={{ mr: 2, position: 'relative', top: '1.5px' }}>
                  {user.user_metadata.full_name}
                </Typography>
                <Button
                  color="inherit"
                  component={Link}
                  to="/transactions"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'lightblue' },
                  }}
                >
                  Transactions
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/goals"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': { color: 'lightblue' },
                  }}
                >
                  Goals
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              navItems.map(item => (
                <Button
                  key={item}
                  component={Link}
                  to={`/${item.toLowerCase()}`}
                  sx={{
                    color: '#fff',
                    textDecoration: 'none',
                    '&:hover': { color: 'lightblue' },
                  }}
                >
                  {item}
                </Button>
              ))
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }} width="100%">
        <Toolbar />
        <Fade timeout={150} in={alertState.visible}>
          <Alert
            severity={alertState.severity}
            onClose={() => dispatch(hideAlert())}
            sx={{
              position: 'fixed',
              top: 20,
              left: 20,
              zIndex: 1300,
              minWidth: 250,
              maxWidth: 600,
            }}
          >
            {alertState.message}
          </Alert>
        </Fade>
        <Outlet />
      </Box>
    </Box>
  );
}
