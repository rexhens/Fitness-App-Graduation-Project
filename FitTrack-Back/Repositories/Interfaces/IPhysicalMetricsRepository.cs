using FitnessApp.Models.Entities;

namespace FitnessApp.Repositories.Interfaces
{
    public interface IPhysicalMetricsRepository
    {
        Task<IEnumerable<PhysicalMetrics>> GetAllAsync();
        Task<PhysicalMetrics?> GetByIdAsync(int id);
        Task<PhysicalMetrics> GetByUserIdAsync(int user_id);
        Task AddAsync(PhysicalMetrics metrics);
        Task UpdateAsync(PhysicalMetrics metrics);
        Task DeleteAsync(int id);
    }
}
