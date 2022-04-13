using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace ZwajApp.API.Data
{
    public class TrailData
    {
        private readonly DataContext _context;
        public TrailData(DataContext context)
        {
            _context = context;
        }

        public void readDataFromJsonFileToSeedData(){
          var allText = System.IO.File.ReadAllText("Data/UserTrailData.json");
          var users =  JsonConvert.DeserializeObject<List<User>>(allText);

          foreach(var user in users) {
               byte[] passwordHash,passwordSalt;
               CreateHashPassword("password" , out passwordHash,out passwordSalt);
               user.PasswordHash = passwordHash;
               user.PasswordSalt = passwordSalt;
               user.Username = user.Username.ToLower();
               _context.Users.Add(user);
          }

          _context.SaveChanges();

        }

        private void CreateHashPassword(string password , out byte[] passwordHash , out byte[] passwordSalt){
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));      
            }       
         }
    }
}