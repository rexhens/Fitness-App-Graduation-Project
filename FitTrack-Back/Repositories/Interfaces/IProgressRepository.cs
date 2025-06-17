using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IProgressRepository
    {
        Task AddAsync(Progress progress);
        Task<List<Progress>> GetByUserIdAsync(int userId);
    }
}
