using System;
using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required(ErrorMessage = "User name is required")]
      
        public string Username { get; set; }
        [Required]
        [StringLength(8,MinimumLength = 4,ErrorMessage = "Must the password lessthan 8 chars and greaterThan 4 chars")]
        public string Password { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
         public string City { get; set; }
         [Required]
        public string Country { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }

        public string KnownAs { get; set; }
    }
}