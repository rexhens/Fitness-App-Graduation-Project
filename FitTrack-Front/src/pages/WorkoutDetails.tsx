import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Flame, 
  Target, 
  ChevronLeft, 
  Dumbbell, 
  Users, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';

interface WorkoutDetails {
  id: number;
  name: string;
  duration: string;
  calories: number;
  difficulty: string;
  equipment: string;
  targetMuscles: string;
  steps: string;
}

const WorkoutDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchWorkoutDetails();
    }
  }, [id]);

  const fetchWorkoutDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7054/ExistingWorkout/get-by-name?name=${encodeURIComponent(id ?? '')}`, {
        headers: {
          'accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workout details');
      }

      const data = await response.json();
      setWorkout(data);
    } catch (error) {
      console.error('Error fetching workout details:', error);
      toast.error('Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleAskTrainer = () => {
    navigate('/chatbot', {
      state: {
        initialQuestion: `Tell me more about the "${workout?.name}" workout and how to get started with it.`
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Workout not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const equipmentList = workout.equipment.split(',').map(item => item.trim());
  const targetMusclesList = workout.targetMuscles.split(',').map(muscle => muscle.trim());
  const stepsList = workout.steps.split('\n').filter(step => step.trim());

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to Dashboard
            </button>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{workout.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workout Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="card flex items-center p-6">
                <Clock className="h-8 w-8 text-primary mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-lg font-semibold">{workout.duration}</p>
                </div>
              </div>
              <div className="card flex items-center p-6">
                <Flame className="h-8 w-8 text-orange-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="text-lg font-semibold">{workout.calories}</p>
                </div>
              </div>
              <div className="card flex items-center p-6">
                <Target className="h-8 w-8 text-blue-500 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="text-lg font-semibold">{workout.difficulty}</p>
                </div>
              </div>
            </motion.div>

            {/* Workout Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-6">Workout Steps</h2>
              <div className="space-y-4">
                {stepsList.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Equipment Needed */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4">Equipment Needed</h2>
              <div className="space-y-3">
                {equipmentList.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Dumbbell className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Target Muscles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card"
            >
              <h2 className="text-xl font-semibold mb-4">Target Muscles</h2>
              <div className="flex flex-wrap gap-2">
                {targetMusclesList.map((muscle, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-4"
            >
              <button
                onClick={handleAskTrainer}
                className="w-full btn-primary flex items-center justify-center"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask AI Trainer
              </button>

              <button className="w-full btn-secondary flex items-center justify-center">
                <Users className="mr-2 h-5 w-5" />
                Find Workout Buddy
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;