import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PhysicalMetrics from './pages/PhysicalMetrics';
import ChatBot from './pages/ChatBot';
import FitnessGoals from './pages/FitnessGoals';
import NotFound from './pages/NotFound';
import InitialMetrics from './pages/InitialMetrics';
import Signup from './pages/SignUp';
import WorkoutDetails from './pages/WorkoutDetails';

// Layout
import DashboardLayout from './components/layouts/DashboardLayout';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
       <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />
      <Route path="/initial-metrics" element={ <InitialMetrics />} />
      <Route path="/" element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="metrics" element={<PhysicalMetrics />} />
        <Route path="chatbot" element={<ChatBot />} />
        <Route path="goals" element={<FitnessGoals />} />
        <Route path="workout/:id" element={<WorkoutDetails />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;