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
    public class GoalsController : ControllerBase
    {
        private readonly IFitnessGoalRepository _fitnessGoalRepository;
        private readonly IMessagesRepository _messagesRepository;
        private readonly IConversationRepository _conversationRepository;
        private readonly IUserRepository _userRepository;

        public GoalsController(IFitnessGoalRepository fitnessGoalRepository,
            IMessagesRepository messageRepository, IConversationRepository conversationRepository,
            IUserRepository userRepository)
        {
            _fitnessGoalRepository = fitnessGoalRepository;
            _messagesRepository = messageRepository;
            _conversationRepository = conversationRepository;
            _userRepository = userRepository;
        }


        [HttpPost("/set-goal")]
        public async Task<IActionResult> SetGoal([FromBody] FitnessGoalDto fitnessGoalDto, int user_id)
        {
            if (string.IsNullOrWhiteSpace(fitnessGoalDto.goal_description))
                return BadRequest("Goal description cannot be empty.");

            // Store the goal in the FitnessGoals table
            var goal = new FitnessGoal
            {
                user_id = user_id,
                goal_description = fitnessGoalDto.goal_description,
                target_date = fitnessGoalDto.target_date,
            };
            await _fitnessGoalRepository.AddAsync(goal);

            // Ensure there's a conversation
            var conversation = await _conversationRepository.GetByClientIdAsync(user_id);
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    user_id = user_id,
                    title = "user " + user_id + " conversation"
                };
                await _conversationRepository.AddAsync(conversation);
            }

            await _messagesRepository.SaveMessage(goal.ToString(), "user", conversation.id);

            return Ok(new { message = "Fitness goal saved successfully." });
        }

        [HttpGet("get-all-goals")]
        public async Task<IActionResult> GetAllGoals([FromQuery] int userId)
        {
            var goals = await _fitnessGoalRepository.GetAllByUserIdAsync(userId);
            if(goals == null)
            {
                return NotFound("User has not any goals set");
            }
            return Ok(goals);
        }

        [HttpPost("set-progress")]
        public async Task<IActionResult> setProgressOfGoal([FromBody] GoalProgressDto goalProgress,[FromQuery] int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if(user == null)
            {
                return NotFound("User not found");
            }
            var goal = await _fitnessGoalRepository.GetByIdAsync(goalProgress.goalId);
            if(goal == null)
            {
                return NotFound("Goal does not exist");
            }
            goal.progress = goalProgress.progress;
            await _fitnessGoalRepository.UpdateAsync(goal);
            return Ok(goal);
        }

    }
}
