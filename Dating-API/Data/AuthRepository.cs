using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ZwajApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _dbContext;
        public AuthRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _dbContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return null;
            if (!VerifyPassword(password , user.PasswordHash , user.PasswordSalt)){
                 return null;
            }
           return user;
        }

        private bool VerifyPassword(string password , byte[] passwordHash , byte[] passwordSalt){
                using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)){
                var computedPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                 for (var i = 0 ; i < computedPasswordHash.Length ; i++){
                     if (computedPasswordHash[i] != passwordHash[i]){
                         return false;
                     }
                 }
                 return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordSalt,passwordHash;
            CreateHashPassword(password,out passwordHash,out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _dbContext.Users.AddAsync(user);
            await _dbContext.SaveChangesAsync();
            return user;
        }

        private void CreateHashPassword(string password , out byte[] passwordHash , out byte[] passwordSalt){
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));      
            }       
         }

        public async Task<bool> UserEXists(string username)
        {
           return await _dbContext.Users.AnyAsync(u => u.Username == username);
        }
    }
}