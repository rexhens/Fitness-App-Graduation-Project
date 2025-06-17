using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IRecomendedWorkoutRepository
    {
        Task<List<RecomendedWorkout>> GetAllAsync();
        Task<RecomendedWorkout?> GetByIdAsync(int id);
        Task<List<RecomendedWorkout>> GetByUserIdAsync(int userId);
        Task AddAsync(RecomendedWorkout workout);
        Task UpdateAsync(RecomendedWorkout workout);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<List<RecomendedWorkout>> GetActiveRecomendedWorkoutsAsync(int userId);
        Task DisactivateRecommendation(int id);
    }
}
