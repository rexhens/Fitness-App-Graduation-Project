using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ExistingWorkoutController : Controller
    {
        private readonly IExistingWorkoutRepository _existingWorkoutRepository;
        public ExistingWorkoutController(IExistingWorkoutRepository existing)
        {
            _existingWorkoutRepository = existing;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllExistingWorkoutsAsync()
        {
            return Ok(await _existingWorkoutRepository.GetAllAsync());
        }


        [HttpGet("get-by-name")]
        public async Task<IActionResult> GetWorkoutByName([FromQuery] string name)
        {
            var workout = await _existingWorkoutRepository.GetByNameAsync(name);
            if(workout == null)
            {
                return NotFound();
            }
            return Ok(workout);
        }
    }
}
