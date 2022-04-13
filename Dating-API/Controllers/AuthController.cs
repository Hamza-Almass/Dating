using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;

namespace ZwajApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config , IMapper mapper)
        {
            _config = config;
            _repo = repo;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserForRegisterDto userForRegisterDto)
        {
            if (!ModelState.IsValid)
            {
                BadRequest(ModelState);
            }
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();
            if (await _repo.UserEXists(userForRegisterDto.Username))
            {
                return BadRequest("User already registered");
            }
            var userForCreate = _mapper.Map<User>(userForRegisterDto);

            var userCreated = await _repo.Register(userForCreate, userForRegisterDto.Password);
            if (userCreated == null)
            {
                return BadRequest("User not registered , something went wrong");
            }
            var userForReturn = _mapper.Map<UserForDetailsDto>(userForCreate);
            return CreatedAtRoute("GetUser",new {controller = "Users",id = userForCreate.Id},userForReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserForLoginDto userForLoginDto)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userFromDB = await _repo.Login(userForLoginDto.Username, userForLoginDto.password);
            if (userFromDB == null)
            {
                return Unauthorized("Username or password are incorrect");
            }

             var claims = new [] {
                new Claim(ClaimTypes.NameIdentifier,userFromDB.Id.ToString()),
                new Claim(ClaimTypes.Name , userFromDB.Username)
             };

             var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:token").Value));
             var credentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha512);
             var tokenDescriptor = new SecurityTokenDescriptor(){
                 Subject = new ClaimsIdentity(claims),
                 Expires = DateTime.Now.AddDays(1),
                 SigningCredentials = credentials
             };

             var userForListDto = _mapper.Map<UserForListDto>(userFromDB);

             var tokenHandler =  new JwtSecurityTokenHandler();
             var token = tokenHandler.CreateToken(tokenDescriptor);
             return Ok(new {Token = tokenHandler.WriteToken(token), User = userForListDto});

        }
    }
}