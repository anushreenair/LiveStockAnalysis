import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Container,
  Box,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  CircularProgress,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  // Password change states
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || '');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Successfully logged in!");
        setTimeout(() => navigate("/portfolio"), 1000);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/portfolio"), 1000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccess("Successfully logged out!");
      setLogoutDialogOpen(false);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }

      await updatePassword(auth.currentUser, newPassword);
      
      setSuccess('Password updated successfully!');
      setPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update password: ' + error.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.updateProfile({
          displayName: displayName
        });
        setSuccess('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  const UserDetails = () => {
    if (!user) return null;

    return (
      <Box className="account-container">
        <Typography variant="h4" component="h1" className="account-title" gutterBottom>
          Account Settings
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className="profile-card">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: 'primary.main',
                        border: '4px solid #fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                        fontSize: '3rem',
                        fontFamily: '"Times New Roman", Times, serif'
                      }}
                    >
                      {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      Profile Information
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Manage your account details
                    </Typography>
                  </Box>
                </Box>

                {editing ? (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Display Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      margin="normal"
                      variant="outlined"
                    />
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleUpdateProfile}
                        className="save-button"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditing(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Display Name
                      </Typography>
                      <Typography variant="body1">
                        {user.displayName || 'Not set'}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {user.email}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      className="edit-button"
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card className="settings-card">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Account Security
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Manage your account security settings
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setPasswordDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => setLogoutDialogOpen(true)}
            sx={{ '&:hover': { backgroundColor: '#fff1f0', borderColor: '#ff4d4f' } }}
          >
            Logout from Account
          </Button>
        </Box>

        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            Confirm Logout
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to logout from your account?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button 
              onClick={() => setLogoutDialogOpen(false)}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Current Password"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
            <Button onClick={handlePasswordChange} variant="contained">
              Update Password
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {auth.currentUser ? (
        <UserDetails />
      ) : (
        <Card sx={{ p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" align="center">
              {isLogin ? "Login" : "Sign Up"}
            </Typography>

            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>

            <Button
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Account;
