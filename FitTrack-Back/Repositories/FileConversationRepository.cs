using FitnessApp.Models.Dto;
using System.Text.Json;

namespace FitnessApp.Repositories
{
    public class FileConversationRepository
    {
        public async Task SaveConversationToJsonAsync(string userQuestion, string botReply, string userId = "defaultUser")
        {
            var directory = Path.Combine(Directory.GetCurrentDirectory(), "Conversations");
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            var filePath = Path.Combine(directory, $"{userId}.json");

            List<ChatEntry> chatLog;

            if (File.Exists(filePath))
            {
                var existingJson = await File.ReadAllTextAsync(filePath);
                chatLog = JsonSerializer.Deserialize<List<ChatEntry>>(existingJson) ?? new List<ChatEntry>();
            }
            else
            {
                chatLog = new List<ChatEntry>();
            }

            chatLog.Add(new ChatEntry
            {
                Timestamp = DateTime.Now,
                User = userQuestion,
                Assistant = botReply
            });

            var updatedJson = JsonSerializer.Serialize(chatLog, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(filePath, updatedJson);
        }

        public async Task<string> GetPreviousConversationsAsync(string userId = "defaultUser")
        {
            var directory = Path.Combine(Directory.GetCurrentDirectory(), "Conversations");
            var filePath = Path.Combine(directory, $"{userId}.json");

            if (!System.IO.File.Exists(filePath))
                return string.Empty;

            var existingJson = await System.IO.File.ReadAllTextAsync(filePath);
            var chatLog = JsonSerializer.Deserialize<List<ChatEntry>>(existingJson) ?? new List<ChatEntry>();

            var messages = new List<object>();

            // Add previous conversations (user + assistant) as messages
            foreach (var entry in chatLog)
            {
                messages.Add(new { role = "user", content = entry.User });
                messages.Add(new { role = "assistant", content = entry.Assistant });
            }

            return JsonSerializer.Serialize(messages);
        }
    }
}
