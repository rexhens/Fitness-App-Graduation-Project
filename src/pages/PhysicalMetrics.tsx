import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { BarChart3, Save } from 'lucide-react';

interface MetricsForm {
  age: number | '';
  gender: string;
  weight_kg: number | '';
  height_cm: number | '';
  body_fat_percentage: number | '';
  muscle_mass: number | '';
  bmi: number | '';
}

const PhysicalMetrics: React.FC = () => {
  const [form, setForm] = useState<MetricsForm>({
    age: '',
    gender: 'Male',
    weight_kg: '',
    height_cm: '',
    body_fat_percentage: '',
    muscle_mass: '',
    bmi: '',
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem('fittrack_user_id');

    if (!userId) return;

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`https://localhost:7054/get-metrics?user_id=${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        setForm({
          age: data.age || '',
          gender: data.gender || 'Male',
          weight_kg: data.weight_kg || '',
          height_cm: data.height_cm || '',
          body_fat_percentage: data.body_fat_percentage || '',
          muscle_mass: data.muscle_mass || '',
          bmi: data.bmi || '',
        });
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  const calculateBMI = (): number => {
    if (typeof form.weight_kg === 'number' && typeof form.height_cm === 'number' && form.height_cm > 0) {
      const heightInMeters = form.height_cm / 100;
      return parseFloat((form.weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    setForm({
      ...form,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const calculatedBMI = form.bmi || calculateBMI();
  const userId = localStorage.getItem('fittrack_user_id');

  if (!userId) {
    toast.error('User ID not found.');
    return;
  }

  // Prepare the data object to be sent to the API
  const dataToSubmit = {
    age: form.age,
    weight: form.weight_kg,
    height: form.height_cm,
    body_fat_percentage: form.body_fat_percentage,
    muscle_mass: form.muscle_mass,
    bmi: calculatedBMI,
    notes: 'string', // Add the note or leave it dynamic as required
  };

  setLoading(true);

  try {
    const response = await fetch(`https://localhost:7054/Progress/save-progress?userId=${userId}`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (!response.ok) throw new Error('Failed to save metrics');

    toast.success('Physical metrics saved successfully');
  } catch (error) {
    console.error('Error saving metrics:', error);
    toast.error('Failed to save metrics. Please try again.');
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-textPrimary">Physical Metrics</h1>
        <p className="mt-1 text-sm text-textSecondary">
          Track your physical measurements to monitor your progress
        </p>
      </div>

      {/* Summary Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Current BMI</p>
              <p className="text-xl font-semibold">{calculateBMI() || '–'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M12 11v6"></path>
                <path d="M9 14h6"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Weight</p>
              <p className="text-xl font-semibold">{form.weight_kg ? `${form.weight_kg} kg` : '–'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Body Fat</p>
              <p className="text-xl font-semibold">{form.body_fat_percentage ? `${form.body_fat_percentage}%` : '–'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-500 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-textSecondary">Muscle Mass</p>
              <p className="text-xl font-semibold">{form.muscle_mass ? `${form.muscle_mass} kg` : '–'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-textPrimary">Update Your Measurements</h2>
          <p className="text-sm text-textSecondary">Enter your most recent physical metrics to track your progress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-textSecondary mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={form.age}
                onChange={handleInputChange}
                className="input-field"
                placeholder="30"
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-textSecondary mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="weight_kg" className="block text-sm font-medium text-textSecondary mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight_kg"
                name="weight_kg"
                value={form.weight_kg}
                onChange={handleInputChange}
                className="input-field"
                placeholder="75"
                required
              />
            </div>

            <div>
              <label htmlFor="height_cm" className="block text-sm font-medium text-textSecondary mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                id="height_cm"
                name="height_cm"
                value={form.height_cm}
                onChange={handleInputChange}
                className="input-field"
                placeholder="175"
                required
              />
            </div>

            <div>
              <label htmlFor="body_fat_percentage" className="block text-sm font-medium text-textSecondary mb-1">
                Body Fat Percentage (optional)
              </label>
              <input
                type="number"
                id="body_fat_percentage"
                name="body_fat_percentage"
                value={form.body_fat_percentage}
                onChange={handleInputChange}
                className="input-field"
                placeholder="15"
              />
            </div>

            <div>
              <label htmlFor="muscle_mass" className="block text-sm font-medium text-textSecondary mb-1">
                Muscle Mass (kg) (optional)
              </label>
              <input
                type="number"
                id="muscle_mass"
                name="muscle_mass"
                value={form.muscle_mass}
                onChange={handleInputChange}
                className="input-field"
                placeholder="30"
              />
            </div>

            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-textSecondary mb-1">
                BMI (optional)
              </label>
              <input
                type="number"
                id="bmi"
                name="bmi"
                value={form.bmi}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Will be calculated if not provided"
              />
              {!form.bmi && calculateBMI() > 0 && (
                <p className="mt-1 text-xs text-textTertiary">
                  Calculated BMI: {calculateBMI()}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <Save size={18} className="mr-2" />
              {loading ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* History Section Placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-textPrimary">Measurement History</h2>
          <p className="text-sm text-textSecondary">Track your physical changes over time</p>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  BMI
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Body Fat %
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Muscle Mass
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { date: '2023-06-15', weight: 78.5, bmi: 24.2, bodyFat: 18.5, muscleMass: 32.1 },
                { date: '2023-05-15', weight: 80.2, bmi: 24.7, bodyFat: 19.2, muscleMass: 31.5 },
                { date: '2023-04-15', weight: 82.0, bmi: 25.3, bodyFat: 20.1, muscleMass: 30.8 },
              ].map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {record.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {record.bmi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {record.bodyFat}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                    {record.muscleMass} kg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PhysicalMetrics;