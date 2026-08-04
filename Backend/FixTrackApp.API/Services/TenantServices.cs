using System.Security.Claims;

namespace FixTrackApp.API.Services
{
    public interface ITenantService
    {
        int GetTenantId();
    }

    public class TenantService : ITenantService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TenantService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetTenantId()
        {
            // Leemos el TenantId que guardaremos dentro del JWT Token
            var tenantClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("TenantId")?.Value;

            if (int.TryParse(tenantClaim, out int tenantId))
            {
                return tenantId;
            }

            // Retorna 0 si es un acceso público (ej. el cliente buscando su ticket)
            return 0;
        }
    }
}