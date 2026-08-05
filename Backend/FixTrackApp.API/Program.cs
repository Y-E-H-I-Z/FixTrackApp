using FixTrackApp.API.Models;
using FixTrackApp.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. BASE DE DATOS
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. SERVICIOS MULTI-TENANT
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantService, TenantService>();

// 3. IDENTITY (Usuarios y Contraseñas)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 4. AUTENTICACIÓN JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// 5. CONTROLADORES
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();

// 6. SWAGGER (Con Botón Authorize)
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FixTrack API",
        Version = "v1"
    });

    // 1. Botón para ingresar el Token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Ingresa tu token JWT así: Bearer {tu token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    // 2. Candado global para los endpoints (nueva sintaxis con delegate)
    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});

// 7. CORS
// --- AÑADE ESTO ANTES DE builder.Build() ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("NuevaPoliticaCors", policy =>
    {
        policy.AllowAnyOrigin()    // Permite peticiones desde cualquier dominio (Vercel, localhost, etc.)
              .AllowAnyMethod()    // Permite GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader();   // Permite cualquier cabecera (incluyendo el Token de Autorización)
    });
});

var app = builder.Build();

// --- PIPELINE HTTP ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("NuevaPoliticaCors");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();