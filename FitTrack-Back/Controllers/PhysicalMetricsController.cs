using FitnessApp.Models.Dto;
using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Intrinsics.X86;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PhysicalMetricsController : ControllerBase
    {
        private readonly IPhysicalMetricsRepository _physicalMetricsRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IMessagesRepository _messagesRepository;

        public PhysicalMetricsController(
            IPhysicalMetricsRepository physicalMetricsRepository,
            IConversationRepository conversationRepository,
            IMessagesRepository messagesRepository)
        {
            _physicalMetricsRepository = physicalMetricsRepository;
            _conversationRepository = conversationRepository;
            _messagesRepository = messagesRepository;
        }

        [HttpPost("/save-metrics")]
        public async Task<IActionResult> SavePhysicalMetrics([FromBody] PhysicalMetricDto metricsDto,[FromQuery] int user_id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            PhysicalMetrics metrics = new PhysicalMetrics { gender = metricsDto.gender, age = metricsDto.age,
                user_id = user_id, bmi = metricsDto.bmi, body_fat_percentage = metricsDto.body_fat_percentage,
                height_cm = metricsDto.height_cm, weight_kg = metricsDto.weight_kg, muscle_mass = metricsDto.muscle_mass };

            if (metrics.bmi == -1 || metrics.bmi == 0)
            {
                metrics.bmi = metrics.weight_kg / (float)Math.Pow(metrics.height_cm / 100.0, 2);
            }

            if (metrics.body_fat_percentage == -1 || metrics.body_fat_percentage == 0)
            {
                // Simple BMI-based formula (men assumed by default; you can condition this with gender if needed)
                metrics.body_fat_percentage = (float)((1.20 * metrics.bmi) + (0.23 * metrics.age) - (metrics.gender.ToLower() == "male" ? 16.2 : 5.4));
            }

            if (metrics.muscle_mass == -1 || metrics.muscle_mass == 0)
            {
                // Lean Body Mass = weight * (1 - body fat %), muscle mass is ~55% of that
                float leanBodyMass = metrics.weight_kg * (1 - (metrics.body_fat_percentage / 100));
                metrics.muscle_mass = leanBodyMass * 0.55f;
            }
            await _physicalMetricsRepository.AddAsync(metrics);

            // Get or create conversation
            var conversation = await _conversationRepository.GetByClientIdAsync(user_id);
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    user_id = user_id,
                    title = "User " + user_id + " conversation",
                    started_at = DateTime.UtcNow
                };
                await _conversationRepository.AddAsync(conversation);
            }

            string userMessage = metrics.ToString();

            await _messagesRepository.SaveMessage(userMessage, "user", conversation.id);

            return Ok(new { success = true, message = "Physical metrics and user message saved successfully." });
        }

        [HttpGet("/get-metrics")]
        public async Task<IActionResult> GetPhysicalMetrics([FromQuery] int user_id)
        {
            var metrics = await _physicalMetricsRepository.GetByUserIdAsync(user_id);
            if(metrics == null)
            {
                return NotFound("User not found");
            }
            return Ok(metrics);
        }
    }
}

