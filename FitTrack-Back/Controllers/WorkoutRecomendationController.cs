using FitnessApp.Models.Entities;
using FitnessApp.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace FitnessApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WorkoutRecomendationController : ControllerBase
    {
        private readonly IRecomendedWorkoutRepository _recomendedWorkoutRepository;
        private readonly IConfiguration _config;
        private readonly IConversationRepository _conversatioonsRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IExistingWorkoutRepository _existingWorkoutRepository;

        public WorkoutRecomendationController(IRecomendedWorkoutRepository recomended,
            IConfiguration configuration, IConversationRepository conversation,
            IMessagesRepository messages, IExistingWorkoutRepository existingWorkoutRepository)
        {
            _recomendedWorkoutRepository = recomended;
            _config = configuration;
            _conversatioonsRepository = conversation;
            _messagesRepository = messages;
            _existingWorkoutRepository = existingWorkoutRepository;
        }

        [HttpGet("get-recommendation")]
        public async Task<IActionResult> GetRecommendation([FromQuery] int userId)
        {
            var recommendations = await _recomendedWorkoutRepository.GetActiveRecomendedWorkoutsAsync(userId);
            if (recommendations != null && recommendations.Any())
            {
                return Ok(recommendations);
            }

            var conversation = await _conversatioonsRepository.GetByClientIdAsync(userId);
            IEnumerable<Message> messages = new List<Message>();

            if (conversation != null)
            {
                messages = await _messagesRepository.GetByConversationIdAsync(conversation.id);
            }

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "OpenAI API key not configured.");

            var existing_workouts = await _existingWorkoutRepository.GetAllAsync();
            string names = "";
            foreach(var w in existing_workouts)
            {
                names += w.name;
                names+= " ";
            }

            string prompt = "Based on my goals list 4 workout titles only that are part of this list: " + names + ", numbered (e.g. 1., 2., 3., 4), each on a new line. Make sure that the names to be exactly like the ones from the list i provided to you.";

            if (messages != null && messages.Any())
            {
                var lastMessage = messages.LastOrDefault();
                if (!string.IsNullOrWhiteSpace(lastMessage.ToString()))
                {
                    prompt = lastMessage + "\n" + prompt;
                }
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
            new { role = "user", content = prompt }
        }
            };

            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch recommendations from OpenAI.");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            if (doc.RootElement.TryGetProperty("error", out var error))
            {
                var message = error.GetProperty("message").GetString();
                return StatusCode(500, $"OpenAI Error: {message}");
            }

            var reply = doc.RootElement
               .GetProperty("choices")[0]
               .GetProperty("message")
               .GetProperty("content")
               .GetString();

            var workoutNames = reply.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                                    .Where(line => line.Contains('.') && char.IsDigit(line.Trim()[0])) // Keep numbered lines
                                    .Select(line =>
                                    {
                                        // Remove numbering like "1. ", "2. ", etc.
                                        int dotIndex = line.IndexOf('.');
                                        return dotIndex != -1 ? line.Substring(dotIndex + 1).Trim() : line.Trim();
                                    })
                                    .ToList();

            var generatedWorkouts = new List<RecomendedWorkout>();

            foreach (var name in workoutNames)
            {
                var workout = new RecomendedWorkout
                {
                    workout_name = name,
                    status = 1,
                    user_id = userId
                };

                await _recomendedWorkoutRepository.AddAsync(workout);
                generatedWorkouts.Add(workout);
            }

            return Ok(generatedWorkouts);
        }

        [HttpPost("refresh-recommendations")]
        public async Task<IActionResult> RefreshRecomendations([FromQuery] int userId)
        {
            var existingRecommendations = await _recomendedWorkoutRepository.GetByUserIdAsync(userId);
            if (existingRecommendations != null && existingRecommendations.Any())
            {
                foreach (var rec in existingRecommendations)
                {
                    await _recomendedWorkoutRepository.DisactivateRecommendation(rec.id);
                }
            }

            var apiKey = _config["OpenAI:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return StatusCode(500, "OpenAI API key not configured.");
            var existing_workouts = await _existingWorkoutRepository.GetAllAsync();
            string names = "";
            foreach (var w in existing_workouts)
            {
                names += w.name;
                names += " ";
            }

            string prompt = "Based on my goals list 4 workout titles only that are part of this list: " + names + ", numbered (e.g. 1., 2., 3., 4), each on a new line. Make sure that the names to be exactly like the ones from the list i provided to you.";

            var conversation = await _conversatioonsRepository.GetByClientIdAsync(userId);
            IEnumerable<Message> messages = new List<Message>();

            if (conversation != null)
            {
                messages = await _messagesRepository.GetByConversationIdAsync(conversation.id);
            }

            if (messages != null && messages.Any())
            {
                var lastMessage = messages.LastOrDefault();
                if (!string.IsNullOrWhiteSpace(lastMessage.ToString()))
                {
                    prompt = lastMessage + "\n" + prompt;
                }
            }

            var client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
            new { role = "user", content = prompt }
        }
            };

            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);
            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Failed to fetch new recommendations from OpenAI.");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseString);

            if (doc.RootElement.TryGetProperty("error", out var error))
            {
                var message = error.GetProperty("message").GetString();
                return StatusCode(500, $"OpenAI Error: {message}");
            }

            var reply = doc.RootElement
                           .GetProperty("choices")[0]
                           .GetProperty("message")
                           .GetProperty("content")
                           .GetString();

            var workoutNames = reply.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                                    .Where(line => line.Contains('.') && char.IsDigit(line.Trim()[0]))
                                    .Select(line =>
                                    {
                                        int dotIndex = line.IndexOf('.');
                                        return dotIndex != -1 ? line.Substring(dotIndex + 1).Trim() : line.Trim();
                                    })
                                    .ToList();

            var generatedWorkouts = new List<RecomendedWorkout>();

            foreach (var name in workoutNames)
            {
                var workout = new RecomendedWorkout
                {
                    workout_name = name,
                    status = 1,
                    user_id = userId
                };

                await _recomendedWorkoutRepository.AddAsync(workout);
                generatedWorkouts.Add(workout);
            }

            return Ok(generatedWorkouts);
        }


    }
}
