using FitnessApp.Models.Entities;
using Microsoft.EntityFrameworkCore;
namespace FitnessApp.Data
{
    public class FitnessAppDbContext : DbContext
    {
        public FitnessAppDbContext(DbContextOptions<FitnessAppDbContext> options)
        : base(options) { }

        public DbSet<User> users { get; set; }
        public DbSet<Conversation> conversations { get; set; }
        public DbSet<Message> messages { get; set; }
        public DbSet<PhysicalMetrics> physical_metrics { get; set; }
        public DbSet<FitnessGoal> fitness_goals { get; set; }
        public DbSet<Progress> progress { get; set; }
        public DbSet<Models.Entities.System> system { get; set; }
        public DbSet<ExistingWorkout> existing_workouts { get; set; }

        public DbSet<RecomendedWorkout> recomended_workouts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.ToTable("conversations");
                entity.HasKey(e => e.id);
                entity.Property(e => e.id).HasColumnName("id");
                entity.Property(e => e.user_id).HasColumnName("user_id");
                entity.Property(e => e.title).HasColumnName("title");
                entity.Property(e => e.started_at).HasColumnName("started_at");

                entity.HasOne(e => e.user)
                      .WithMany()
                      .HasForeignKey(e => e.user_id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.ToTable("messages");
                entity.HasKey(e => e.id);
                entity.Property(e => e.id).HasColumnName("id");
                entity.Property(e => e.role).HasColumnName("role");
                entity.Property(e => e.message).HasColumnName("message");
                entity.Property(e => e.created_at).HasColumnName("created_at");
                entity.Property(e => e.conversation_id).HasColumnName("conversation_id");

                
                entity.HasOne<Conversation>()
                      .WithMany(c => c.messages)
                      .HasForeignKey(m => m.conversation_id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<FitnessGoal>(entity =>
            {
                entity.ToTable("fitness_goals");
                entity.HasKey(e => e.id);
                entity.Property(e => e.id).HasColumnName("id");
                entity.Property(e => e.user_id).HasColumnName("user_id");
                entity.Property(e => e.goal_description).HasColumnName("goal");
                entity.Property(e => e.target_date).HasColumnName("target_date");
                entity.Property(e => e.created_at).HasColumnName("created_at");
                entity.Property(e => e.progress).HasColumnName("progress_of_goal");

                entity.HasOne(e => e.user)
                      .WithMany()
                      .HasForeignKey(e => e.user_id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PhysicalMetrics>(entity =>
            {
                entity.ToTable("physical_metrics");

                entity.HasKey(e => e.id);

                entity.Property(e => e.id).HasColumnName("id");
                entity.Property(e => e.user_id).HasColumnName("user_id");
                entity.Property(e => e.age).HasColumnName("age");
                entity.Property(e => e.gender).HasColumnName("gender");
                entity.Property(e => e.weight_kg).HasColumnName("weight_kg");
                entity.Property(e => e.height_cm).HasColumnName("height_cm");
                entity.Property(e => e.body_fat_percentage).HasColumnName("body_fat_percentage");
                entity.Property(e => e.muscle_mass).HasColumnName("muscle_mass");
                entity.Property(e => e.bmi).HasColumnName("bmi");
                entity.Property(e => e.measured_at).HasColumnName("measured_at");

                entity.HasOne(e => e.user)
                      .WithMany()
                      .HasForeignKey(e => e.user_id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Progress>(entity =>
            {
                entity.ToTable("progress");

                entity.HasKey(p => p.id);
                entity.Property(p => p.id).HasColumnName("id");
                entity.Property(p => p.user_id).HasColumnName("user_id");
                entity.Property(p => p.weight).HasColumnName("weight_kg");
                entity.Property(p => p.height).HasColumnName("height_cm");
                entity.Property(p => p.body_fat_percentage).HasColumnName("body_fat_percent");
                entity.Property(p => p.bmi).HasColumnName("bmi");
                entity.Property(p => p.muscle_mass).HasColumnName("muscle_mass");
                entity.Property(p => p.notes).HasColumnName("notes");
                entity.Property(p => p.measured_at).HasColumnName("measured_at");

                entity.HasOne(p => p.user)
                      .WithMany()
                      .HasForeignKey(p => p.user_id)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<RecomendedWorkout>(entity =>
            {
                entity.ToTable("recomended_workouts");

                entity.HasKey(e => e.id);

                entity.Property(e => e.id)
                    .HasColumnName("id");

                entity.Property(e => e.workout_name)
                    .IsRequired()
                    .HasMaxLength(60)
                    .HasColumnName("workout_name");


                entity.Property(e => e.status)
                    .IsRequired()
                    .HasColumnName("status");

                entity.Property(e => e.user_id)
                    .IsRequired()
                    .HasColumnName("user_id");

                entity.HasOne(e => e.user)
                    .WithMany()
                    .HasForeignKey(e => e.user_id)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ExistingWorkout>(entity =>
            {
                entity.ToTable("existing_workouts");

                entity.HasKey(e => e.id);
                entity.Property(e => e.name).HasColumnName("name");
                entity.Property(e => e.duration).HasColumnName("duration");
                entity.Property(e => e.calories).HasColumnName("calories");
                entity.Property(e => e.difficulty).HasColumnName("difficulty");
                entity.Property(e => e.equipment).HasColumnName("equipment");
                entity.Property(e => e.targetMuscles).HasColumnName("target_muscles");
                entity.Property(e => e.steps).HasColumnName("steps");
            });

        }
    }
    }
