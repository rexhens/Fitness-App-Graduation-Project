using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IExistingWorkoutRepository
    {
            Task<IEnumerable<ExistingWorkout>> GetAllAsync();
            Task<ExistingWorkout?> GetByIdAsync(int id);
            Task AddAsync(ExistingWorkout workout);
            Task UpdateAsync(ExistingWorkout workout);
            Task DeleteAsync(int id);
        Task<ExistingWorkout> GetByNameAsync(string name);
    }
}
