using System.Threading.Tasks;

namespace ZwajApp.API.Data
{
    public interface IAuthRepository
    {
         Task<User> Register (User user,string password);
         Task<User> Login (string username , string password);
         Task<bool> UserEXists(string username);
    }
}