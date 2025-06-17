using FitnessApp.Data;
using FitnessApp.Repositories;
using FitnessApp.Repositories.Implementations;
using FitnessApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Register Db Context
builder.Services.AddDbContext<FitnessAppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 34)) // use your MySQL version
    ));

// Register Repositories
builder.Services.AddSingleton<FileConversationRepository>();
builder.Services.AddScoped<IUserRepository, UsersRepository>();
builder.Services.AddScoped<IConversationRepository, ConversatioonsRepository>();
builder.Services.AddScoped<IMessagesRepository, MessagesRepository>();
builder.Services.AddScoped<IFitnessGoalRepository,FitnessGoalRepository>();
builder.Services.AddScoped<IPhysicalMetricsRepository, PhysicalMetricsRepository>();
builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<IRecomendedWorkoutRepository, RecomendedWorkoutRepository>();
builder.Services.AddScoped<IExistingWorkoutRepository, ExistingWorkoutRepository>();

// Other services (e.g., OpenAI API key configuration, etc.)
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
