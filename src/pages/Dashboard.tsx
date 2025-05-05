import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Heart, Target, Activity, TrendingUp, Scale, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
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
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-500">Weekly Activity</p>
              <p className="text-xl font-semibold">4/7 days</p>
            </div>
          </div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-green-500">Weekly Progress</p>
              <p className="text-xl font-semibold">+12%</p>
            </div>
          </div>
        </div>

        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <Scale size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-500">Current Weight</p>
              <p className="text-xl font-semibold">75 kg</p>
            </div>
          </div>
        </div>

        <div className="card bg-amber-50 border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-500">Workout Time</p>
              <p className="text-xl font-semibold">5.4 hours</p>
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
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
                View All
              </a>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Full Body Strength', icon: <Dumbbell size={20} />, description: 'Build strength with this full body routine', progress: 45 },
                { name: 'Cardio Challenge', icon: <Heart size={20} />, description: 'Intensive cardio workout for endurance', progress: 60 },
                { name: 'Flexibility & Recovery', icon: <Activity size={20} />, description: 'Improve flexibility and speed up recovery', progress: 25 },
              ].map((program, index) => (
                <div key={index} className="flex p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">
                    {program.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-textPrimary">{program.name}</h3>
                    <p className="text-sm text-textTertiary">{program.description}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${program.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
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
              <a href="/goals" className="text-sm font-medium text-primary hover:text-primary-dark">
                Manage
              </a>
            </div>

            <div className="space-y-4">
              {[
                { goal: 'Lose 5kg in 2 months', deadline: '3 weeks left', progress: 65 },
                { goal: 'Run 5km without stopping', deadline: '2 weeks left', progress: 80 },
                { goal: 'Meditate daily for 10 minutes', deadline: '1 month left', progress: 40 },
              ].map((goal, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-textPrimary">{goal.goal}</h3>
                    <div className="p-1 rounded bg-amber-100 text-amber-600 text-xs font-medium">
                      {goal.deadline}
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }}></div>
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