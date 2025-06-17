using FitnessApp.Models.Dto;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Implementations;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProgressController : ControllerBase
    {
        private readonly IProgressRepository _progressRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IPhysicalMetricsRepository _physicalMetricsRepository;
        private readonly IUserRepository _userRepository;

        public ProgressController(IProgressRepository progressRepository,
            IConversationRepository conversationRepository, IMessagesRepository messagesRepository,
            IPhysicalMetricsRepository physicalMetricsRepository, IUserRepository user)
        {
            _physicalMetricsRepository = physicalMetricsRepository;
            _progressRepository = progressRepository;
            _conversationRepository = conversationRepository;
            _messagesRepository = messagesRepository;
            _userRepository = user;
        }


        [HttpPost("save-progress")]
        public async Task<IActionResult> SaveProgress(
            [FromBody] ProgressDto progressDto, int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null) return NotFound("User not found.");

            // Calculate BMI if 0
            if (progressDto.bmi == 0)
            {
                progressDto.bmi = progressDto.weight / Math.Pow(progressDto.height / 100.0, 2);
            }

            // Calculate body fat % if 0
            if (progressDto.body_fat_percentage == 0)
            {
                progressDto.body_fat_percentage = 1.20 * progressDto.bmi + 0.23 * 25 - 10.8 * 1 - 5; // assuming 25yo male
            }

            // Calculate muscle mass if 0 (basic approximation)
            if (progressDto.muscle_mass == 0)
            {
                progressDto.muscle_mass = progressDto.weight * (1 - progressDto.body_fat_percentage / 100);
            }

            // Save to Progress table
            var progress = new Progress
            {
                user_id = userId,
                weight = progressDto.weight,
                height = progressDto.height,
                body_fat_percentage = progressDto.body_fat_percentage,
                muscle_mass = progressDto.muscle_mass,
                bmi = progressDto.bmi,
                notes = progressDto.notes
            };

            await _progressRepository.AddAsync(progress);

            // Update PhysicalMetrics
            var metrics = await _physicalMetricsRepository.GetByUserIdAsync(userId);
            if (metrics != null)
            {
                metrics.weight_kg = (float)progressDto.weight;
                metrics.height_cm = (float)progressDto.height;
                metrics.body_fat_percentage = (float)progressDto.body_fat_percentage;
                metrics.muscle_mass = (float)progressDto.muscle_mass;
                metrics.bmi = (float)progressDto.bmi;
                metrics.measured_at = DateTime.UtcNow;

                await _physicalMetricsRepository.UpdateAsync(metrics);
            }
            var conversation = await _conversationRepository.GetByClientIdAsync(userId);
            if(conversation == null)
            {
                conversation = new Conversation { user_id = userId, title = "user " + userId + " conversation" };
                await _conversationRepository.AddAsync(conversation);
            }
            // Add to messages table
            var message = new Message
            {
                role = "user",
                message = $"Here are my updated metrics: Age: {metrics?.age}, Weight: {progressDto.weight} kg, Height: {progressDto.height} cm, Body Fat: {progressDto.body_fat_percentage:F1}%, Muscle Mass: {progressDto.muscle_mass:F1} kg, BMI: {progressDto.bmi:F1}. Notes: {progressDto.notes}",
                created_at = DateTime.UtcNow,
                conversation_id = conversation.id
            };

            await _messagesRepository.AddAsync(message);


            return Ok("Progress recorded successfully.");
        }

        [HttpGet("get-full-progres")]
        public async Task<IActionResult> GetAllProgresses([FromQuery] int userId)
        {
            var progresses = await _progressRepository.GetByUserIdAsync(userId);
            if(progresses == null)
            {
                return NotFound("User has no progresses recorded");
            }
            return Ok(progresses);
        }
    }

}

