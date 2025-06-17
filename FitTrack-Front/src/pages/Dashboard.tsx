import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Heart, Target, Activity, TrendingUp, Scale, Clock, RefreshCw, Brain, Flame, Cog as Yoga } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'

interface WorkoutRecommendation {
  workout_name: string;
  description: string;
  progress: number;
}

interface Goal {
  id: string;
  goal_description: string;
  target_date: string;
  completed: boolean;
  progress: number;
}

const Dashboard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<WorkoutRecommendation[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
const [weightKg, setWeightKg] = useState<number | null>(null)
const [progressCount, setProgressCount] = useState<number>(0)
const [appUsageTime, setAppUsageTime] = useState<string>('')

  useEffect(() => {
    fetchRecommendations();
    fetchGoals();
    const userId = localStorage.getItem('fittrack_user_id')
  if (!userId) return

  fetchMetrics(userId)
  fetchProgress(userId)
  fetchUserCreatedAt(userId)
  }, []);


const fetchMetrics = async (userId: string) => {
  try {
    const res = await fetch(`https://localhost:7054/get-metrics?user_id=${userId}`, {
      headers: { 'accept': '*/*' }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    setWeightKg(data.weight_kg)
  } catch (err) {
    console.error('Error fetching metrics')
  }
}

const fetchProgress = async (userId: string) => {
  try {
    const res = await fetch(`https://localhost:7054/Progress/get-full-progres?userId=${userId}`, {
      headers: { 'accept': '*/*' }
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    setProgressCount(Array.isArray(data) ? data.length : 0)
  } catch (err) {
    console.error('Error fetching progress')
  }
}

const fetchUserCreatedAt = async (userId: string) => {
  try {
    const res = await fetch(`https://localhost:7054/api/Users/${userId}`, {
      headers: { accept: '*/*' }
    })

    if (!res.ok) throw new Error('Failed to fetch user info')

    const user = await res.json()
    const createdAt = new Date(user.created_at)
    const now = new Date()
    const diffInMs = now.getTime() - createdAt.getTime()

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)
    const months = Math.floor(weeks / 4)

    if (months >= 1) {
      setAppUsageTime(`${months} month${months > 1 ? 's' : ''}`)
    } else if (weeks >= 1) {
      setAppUsageTime(`${weeks} week${weeks > 1 ? 's' : ''}`)
    } else {
      setAppUsageTime(`${days+1} day${days !== 1 ? 's' : ''}`)
    }
  } catch (err) {
    console.error('Failed to calculate app usage time:', err)
  }
}



  const fetchRecommendations = async () => {
    try {
      const userId = localStorage.getItem('fittrack_user_id');
      const response = await fetch(`https://localhost:7054/WorkoutRecomendation/get-recommendation?userId=${userId}`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('fittrack_api_key')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load workout recommendations');
      setRecommendations([
        { workout_name: 'Full Body Strength', description: 'Build strength with this full body routine', progress: 45 },
        { workout_name: 'Cardio Challenge', description: 'Intensive cardio workout for endurance', progress: 60 },
        { workout_name: 'Flexibility & Recovery', description: 'Improve flexibility and speed up recovery', progress: 25 },
        { workout_name: 'Mind-Body Balance', description: 'Combine mental and physical wellness', progress: 30 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const userId = localStorage.getItem('fittrack_user_id');
      const response = await fetch(`https://localhost:7054/Goals/get-all-goals?userId=${userId}`, {
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('fittrack_api_key')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const data = await response.json();
      setGoals(data.map((goal: any) => ({
        id: goal.id.toString(),
        goal_description: goal.goal_description,
        target_date: goal.target_date,
        completed: goal.completed || false,
        progress: Math.round(goal.progress * 100)
      })));
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const userId = localStorage.getItem('fittrack_user_id');
      const response = await fetch(`https://localhost:7054/WorkoutRecomendation/refresh-recommendations?userId=${userId}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('fittrack_api_key')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh recommendations');
      }

      toast.success('Recommendations refreshed successfully');
      await fetchRecommendations();
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast.error('Failed to refresh recommendations');
    } finally {
      setRefreshing(false);
    }
  };

  const handleWorkoutClick = (workout: WorkoutRecommendation) => {
    // Navigate to the workout details page
    navigate(`/workout/${encodeURIComponent(workout.workout_name)}`);
  };

  const getWorkoutIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Dumbbell size={20} />;
      case 1:
        return <Flame size={20} />;
      case 2:
        return <Brain size={20} />;
      case 3:
        return <Yoga size={20} />;
      default:
        return <Activity size={20} />;
    }
  };

  const calculateTimeRemaining = (targetDate: string) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return `${days} days left`;
    if (days < 30) return `${Math.floor(days / 7)} weeks left`;
    return `${Math.floor(days / 30)} months left`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>
          <p className="mt-1 text-sm text-textSecondary">
            Overview of your fitness journey
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            Start Workout
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
     <motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
>
  {/* Weekly Activity - make this more dynamic later */}
  <div className="card bg-blue-50 border-l-4 border-blue-500">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
        <Activity size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-blue-500">Weekly Activity</p>
        <p className="text-xl font-semibold">Keep going!</p>
      </div>
    </div>
  </div>

  {/* Progresses Made */}
  <div className="card bg-green-50 border-l-4 border-green-500">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
        <TrendingUp size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-green-500">Progresses Made</p>
        <p className="text-xl font-semibold">{progressCount} Logs </p>
      </div>
    </div>
  </div>

  {/* Current Weight */}
  <div className="card bg-purple-50 border-l-4 border-purple-500">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
        <Scale size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-purple-500">Current Weight</p>
        <p className="text-xl font-semibold">{weightKg ? `${weightKg} kg` : 'N/A'}</p>
      </div>
    </div>
  </div>

  {/* Time Using App */}
  <div className="card bg-amber-50 border-l-4 border-amber-500">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
        <Clock size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-amber-500">Using FitTrack For</p>
        <p className="text-xl font-semibold">{appUsageTime}</p>
      </div>
    </div>
  </div>
</motion.div>


      {/* Fitness Programs and Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="card h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-textPrimary">Recommended Programs</h2>
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                recommendations.map((program, index) => (
                  <div 
                    key={index} 
                    className="flex p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleWorkoutClick(program)}
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                      {getWorkoutIcon(index)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-textPrimary">{program.workout_name}</h3>
                      <p className="text-sm text-textTertiary">{program.description}</p>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${program.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="card h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-textPrimary">Your Goals</h2>
             <Link to="/goals" className="text-sm font-medium text-primary hover:text-primary-dark">
  Manage
</Link>
            </div>

            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-textPrimary">{goal.goal_description}</h3>
                    <div className="p-1 rounded bg-amber-100 text-amber-600 text-xs font-medium">
                      {calculateTimeRemaining(goal.target_date)}
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 text-right text-xs text-textSecondary">
                    {goal.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendation Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="card bg-gradient-to-r from-blue-500 to-primary text-white">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-xl font-bold mb-2">Need personalized advice?</h2>
              <p className="text-white/80">Try our AI fitness coach for personalized workout and nutrition guidance.</p>
            </div>
            <a href="/chatbot" className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow-sm hover:bg-gray-100 transition-colors">
              Chat with AI Coach
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;