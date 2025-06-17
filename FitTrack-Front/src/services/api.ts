import { toast } from 'react-toastify';

// Base URL for the API
const API_BASE_URL = 'https://localhost:7054';

// Helper to get the auth header
const getAuthHeader = () => {
  const apiKey = localStorage.getItem('fittrack_api_key');
  return apiKey ? { Authorization: `Bearer ${apiKey}` } : {};
};

// Generic fetch function with error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const authHeaders = getAuthHeader();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // For demo purposes, we're showing helpful error messages
      // In production, you might want to handle errors more gracefully
      const errorMessage = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorMessage || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    toast.error('Failed to communicate with the server. Please try again.');
    throw error;
  }
};

// API functions for each endpoint
export const saveMetrics = async (metrics: any) => {
  return fetchWithAuth('/save-metrics?user_id=1', {
    method: 'POST',
    body: JSON.stringify(metrics),
  });
};

export const askQuestion = async (question: string) => {
  return fetchWithAuth('/ClientCall/ask?user_id=1', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
};

export const setGoal = async (goalData: { goal_description: string; target_date: string }) => {
  return fetchWithAuth('/set-goal?user_id=1', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
};

export default {
  saveMetrics,
  askQuestion,
  setGoal,
};