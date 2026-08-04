using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FixTrackApp.API.Models;

namespace FixTrackApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IConfiguration configuration)
        {
            _userManager = userManager;
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/register (Crea el Taller y su primer Usuario Admin)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // 1. Creamos el nuevo Taller en la BD
            var tenant = new Tenant { BusinessName = request.BusinessName };
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync(); // Se guarda y se le asigna un ID automático

            // 2. Creamos al dueño del taller vinculándolo a ese TenantId
            var user = new ApplicationUser
            {
                UserName = request.Username,
                FullName = request.FullName,
                TenantId = tenant.Id // ¡Conexión vital!
            };

            // UserManager se encarga de encriptar (hashear) la contraseña automáticamente
            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "¡Taller registrado con éxito!" });
            }

            // Si la contraseña es muy débil, etc.
            return BadRequest(result.Errors);
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Buscamos al usuario en la BD
            var user = await _userManager.FindByNameAsync(request.Username);

            // 2. Verificamos que exista y que la contraseña coincida con el hash
            if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
            {
                // 3. Creamos el Token JWT y le metemos el TenantId adentro
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Name, user.UserName!),
                    new Claim("TenantId", user.TenantId.ToString()) // Nuestro servicio lo leerá de aquí
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(8),
                    signingCredentials: creds
                );

                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
            }

            return Unauthorized("Usuario o contraseña incorrectos.");
        }
    }

    // Clases auxiliares para recibir los datos (DTOs)
    public class RegisterRequest
    {
        public string BusinessName { get; set; } = string.Empty; // Ej: "Reparaciones Juan"
        public string FullName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}