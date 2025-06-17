using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IFitnessGoalRepository
    {
        Task<IEnumerable<FitnessGoal>> GetAllByUserIdAsync(int userId);
        Task<FitnessGoal?> GetByIdAsync(int id);
        Task AddAsync(FitnessGoal goal);
        Task UpdateAsync(FitnessGoal goal);
        Task DeleteAsync(int id);
    }
}
