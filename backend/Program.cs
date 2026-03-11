using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Medals_Api.Hubs;

// Connection info stored in appsettings.json
IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "Hubs",
        builder =>
        {
            // builder
            //     .AllowAnyOrigin()
            //     .AllowAnyMethod()
            //     .AllowAnyHeader();

          builder
              .AllowAnyHeader()
              .AllowAnyMethod()
              // Anonymous origins NOT allowed for web sockets
              .WithOrigins("http://localhost:5173", "https://mcclain113.github.io/medals-react/")
              .AllowCredentials();
        });
});
builder.Services.AddSignalR();
// Add services to the container.
// Register the DataContext service
builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(configuration["ConnectionStrings:DefaultSQLiteConnection"]));
// Add services to the container.

builder.Services.AddControllers().AddNewtonsoftJson();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Medals API", 
        Version = "v1",
        Description = "Olympic Medals API",
    });
    c.TagActionsBy(api => [api.HttpMethod]);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
    app.UseSwagger();
    app.UseSwaggerUI();
// }

// app.UseCors("Open");
app.UseRouting();
app.UseCors("Hubs");

app.UseDefaultFiles();
app.UseStaticFiles();


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<MedalsHub>("/medalsHub");

app.Run();
