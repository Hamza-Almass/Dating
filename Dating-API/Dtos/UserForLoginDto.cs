using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForLoginDto
    {
        [Required]
        public string  Username { get; set; }

        [Required]
        public string password { get; set; }
    }
}