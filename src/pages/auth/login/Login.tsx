import React from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import logo from '../../../assets/logo.png'; // Adjust path if needed

const Login = () => {
  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-[3fr_2fr] bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      {/* Left side content - takes up more space */}
      <div className="flex items-center justify-center p-10 bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-700 relative overflow-hidden">
        {/* Decorative background burst */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_40%)] z-0" />
        <div className="relative z-10 text-center max-w-xl">
          <div className="flex items-center justify-center mb-6 space-x-4">
            <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />
            <Typography variant="h3" className="font-extrabold text-white">
              Welcome to KeyValue
            </Typography>
          </div>
          <Typography variant="body1" className="text-blue-100 text-lg leading-relaxed">
            Engineer Allocation Platform – simplify team management and productivity tracking with elegance and clarity.
          </Typography>
        </div>
      </div>

      {/* Right side login card */}
      <div className="relative flex items-center justify-center bg-blue-950/60">
        {/* Subtle animated gradient overlay */}
        <div className="absolute w-full h-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 animate-pulse opacity-20 blur-3xl z-0" />

        <Card className="z-10 w-full max-w-md px-6 py-10 shadow-2xl rounded-3xl backdrop-blur-lg bg-white mx-4">
          <CardContent>
            
            <form className="flex flex-col gap-6">
              <h1
              className="text-center mb-6 text-gray-800 font-extrabold text-4xl"
            >
              Sign In
            </h1>
              <TextField label="Email" type="email" fullWidth variant="outlined" />
              <TextField label="Password" type="password" fullWidth variant="outlined" />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
