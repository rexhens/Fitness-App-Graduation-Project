import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Target, Edit, Trash2, Check, X, Plus, ArrowRight } from 'lucide-react';

interface Goal {
  id: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  progress: number;
}

const FitnessGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<{
    description: string;
    targetDate: string;
  }>({
    description: '',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

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
        description: goal.goal_description,
        targetDate: new Date(goal.target_date),
        completed: goal.completed || false,
        progress: Math.round(goal.progress * 100) // Convert decimal to percentage
      })));
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    }
  };
  
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.description || !newGoal.targetDate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userId = localStorage.getItem('fittrack_user_id');
      const response = await fetch(`https://localhost:7054/set-goal?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fittrack_api_key')}`
        },
        body: JSON.stringify({
          goal_description: newGoal.description,
          target_date: new Date(newGoal.targetDate).toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add goal');
      }

      await fetchGoals(); // Refresh goals list
      
      setNewGoal({
        description: '',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      toast.success('Goal added successfully');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to add goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleComplete = async (id: string) => {
    try {
      const updatedGoals = goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed, progress: goal.completed ? goal.progress : 100 } : goal
      );
      setGoals(updatedGoals);

      const completedGoal = updatedGoals.find(g => g.id === id);
      if (completedGoal) {
        await handleUpdateProgress(id, completedGoal.completed ? 100 : completedGoal.progress);
      }

      toast.success(completedGoal?.completed ? 'Goal marked as complete' : 'Goal marked as incomplete');
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
      fetchGoals(); // Revert changes if API call fails
    }
  };
  
  const handleUpdateProgress = async (id: string, progress: number) => {
    try {
      const userId = localStorage.getItem('fittrack_user_id');
      const response = await fetch(`https://localhost:7054/Goals/set-progress?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('fittrack_api_key')}`
        },
        body: JSON.stringify({
          goalId: parseInt(id),
          progress: progress / 100 // Convert percentage to decimal
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      setGoals(goals.map(goal =>
        goal.id === id ? { ...goal, progress } : goal
      ));

      toast.success('Progress updated successfully');
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
      fetchGoals(); // Revert changes if API call fails
    }
  };
  
  const handleEditGoal = (id: string) => {
    setEditingGoal(id);
  };
  
  const handleSaveEdit = (id: string, description: string, targetDate: Date) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, description, targetDate } : goal
      )
    );
    setEditingGoal(null);
  };
  
  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast.success('Goal deleted');
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const calculateTimeRemaining = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
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
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-textPrimary">Fitness Goals</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Set and track your fitness objectives
        </p>
      </div>

      {/* Add New Goal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-textPrimary">Add New Goal</h2>
          <p className="text-sm text-textSecondary">What do you want to achieve?</p>
        </div>

        <form onSubmit={handleAddGoal} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-textSecondary mb-1">
              Goal Description
            </label>
            <input
              type="text"
              id="description"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="input-field"
              placeholder="e.g., Run a 5K under 30 minutes"
              required
            />
          </div>

          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-textSecondary mb-1">
              Target Date
            </label>
            <input
              type="date"
              id="targetDate"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <Plus size={18} className="mr-2" />
              {loading ? 'Adding...' : 'Add Goal'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Goals List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold text-textPrimary">Your Goals</h2>

        {goals.length === 0 ? (
          <div className="card text-center py-10">
            <Target size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-textSecondary">You haven't set any fitness goals yet.</p>
            <p className="text-sm text-textTertiary mt-1">Set a goal to start tracking your progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className={`card border-l-4 ${goal.completed ? 'border-green-500' : 'border-primary'}`}>
                {editingGoal === goal.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={goal.description}
                      onChange={(e) => {
                        setGoals(
                          goals.map((g) =>
                            g.id === goal.id ? { ...g, description: e.target.value } : g
                          )
                        );
                      }}
                      className="input-field"
                    />
                    <input
                      type="date"
                      value={new Date(goal.targetDate).toISOString().split('T')[0]}
                      onChange={(e) => {
                        setGoals(
                          goals.map((g) =>
                            g.id === goal.id ? { ...g, targetDate: new Date(e.target.value) } : g
                          )
                        );
                      }}
                      className="input-field"
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => setEditingGoal(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-md"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(goal.id, goal.description, goal.targetDate)}
                        className="p-2 text-green-500 hover:text-green-700 rounded-md"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => handleToggleComplete(goal.id)}
                          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
                            goal.completed
                              ? 'bg-green-500 border-green-500 flex items-center justify-center'
                              : 'border-gray-300'
                          }`}
                        >
                          {goal.completed && <Check size={12} className="text-white" />}
                        </button>
                        <div>
                          <h3 className={`text-base font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-textPrimary'}`}>
                            {goal.description}
                          </h3>
                          <div className="flex items-center mt-1 space-x-2">
                            <span className="text-xs text-textTertiary">Target: {formatDate(goal.targetDate)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                              {calculateTimeRemaining(goal.targetDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditGoal(goal.id)}
                          className="p-1.5 text-gray-400 hover:text-primary rounded-md"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-textSecondary">Progress</span>
                        <span className="text-xs font-medium text-textSecondary">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full ${goal.completed ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-textSecondary">Update progress:</span>
                        <div className="flex space-x-1">
                          {[0, 25, 50, 75, 100].map((progress) => (
                            <button
                              key={progress}
                              onClick={() => handleUpdateProgress(goal.id, progress)}
                              className={`h-6 w-6 text-xs rounded-full ${
                                goal.progress === progress
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-textSecondary hover:bg-gray-200'
                              }`}
                            >
                              {progress}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Goal Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-blue-500 to-primary text-white rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Setting Effective Fitness Goals</h3>
        <ul className="space-y-2">
          {[
            "Be specific about what you want to achieve",
            "Make your goals measurable to track progress",
            "Set realistic timeframes for success",
            "Break big goals into smaller milestones",
            "Regularly review and adjust your goals"
          ].map((tip, index) => (
            <li key={index} className="flex items-start">
              <ArrowRight size={16} className="mt-1 mr-2 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default FitnessGoals;