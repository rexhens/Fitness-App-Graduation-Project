import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Scale, ArrowRight } from 'lucide-react';

const InitialMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState({
    age: '',
    weight: '',
    gender: '',
    height: '',
    body_fat_percentage: '',
    muscle_mass: '',
    bmi: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = localStorage.getItem('fittrack_user_id');
    const apiKey = localStorage.getItem('fittrack_api_key');

    if (!userId || !apiKey) {
      toast.error('Please sign up first');
      navigate('/signup');
      return;
    }

    try {
      const response = await fetch(`https://localhost:7054/save-metrics?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          age: parseInt(metrics.age),
          weight_kg: parseFloat(metrics.weight),
          height_cm: parseFloat(metrics.height),
          gender: metrics.gender,
          body_fat_percentage: metrics.body_fat_percentage!=''? parseFloat(metrics.body_fat_percentage): 0,
          muscle_mass: metrics.muscle_mass!=''? parseFloat(metrics.muscle_mass) : 0,
          bmi: metrics.bmi!=''? parseFloat(metrics.bmi) : 0,
          notes: metrics.notes || '',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save metrics');
      }

      toast.success('Physical metrics saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast.error('Failed to save metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Your Physical Metrics</h2>
          <p className="mt-2 text-sm text-gray-600">Help us personalize your fitness journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={metrics.age}
                onChange={(e) => setMetrics({ ...metrics, age: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
    Gender
  </label>
  <select
    id="gender"
    value={metrics.gender}
    onChange={(e) => setMetrics({ ...metrics, gender: e.target.value })}
    className="input-field"
    required
  >
    <option value="" disabled>Select your gender</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="other">Other</option>
  </select>
</div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                id="weight"
                value={metrics.weight}
                onChange={(e) => setMetrics({ ...metrics, weight: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                type="number"
                step="0.1"
                id="height"
                value={metrics.height}
                onChange={(e) => setMetrics({ ...metrics, height: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="body_fat_percentage" className="block text-sm font-medium text-gray-700">
                Body Fat Percentage (optional)
              </label>
              <input
                type="number"
                step="0.1"
                id="body_fat_percentage"
                value={metrics.body_fat_percentage}
                onChange={(e) => setMetrics({ ...metrics, body_fat_percentage: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="muscle_mass" className="block text-sm font-medium text-gray-700">
                Muscle Mass (kg) (optional)
              </label>
              <input
                type="number"
                step="0.1"
                id="muscle_mass"
                value={metrics.muscle_mass}
                onChange={(e) => setMetrics({ ...metrics, muscle_mass: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={metrics.notes}
                onChange={(e) => setMetrics({ ...metrics, notes: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default InitialMetrics;