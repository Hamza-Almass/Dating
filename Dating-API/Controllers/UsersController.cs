using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;

namespace ZwajApp.API.Controllers
{
    [ServiceFilter(typeof(LogLastActive))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo , IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var currentUserLoggedIn = await _repo.GetUser(currentUserId);

            if (currentUserLoggedIn != null){
                userParams.UserId = currentUserId;
                if (string.IsNullOrEmpty(userParams.Gender)){
                    if (currentUserLoggedIn.Gender == "رجل"){
                        userParams.Gender = "إمرأة";
                    }else{
                        userParams.Gender = "رجل";
                    }
                }
            }

            var users = await _repo.GetUsers(userParams);
            var usersForReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            
            Response.AddPagination(new PaginationHeader(){PageSize = userParams.PageSize ,
             CurrentPage = userParams.PageNumber,ItemsPerPage = users.Items.Count
             ,TotalItems = users.TotalCount});

            return Ok(usersForReturn);
        }

        [HttpGet("{id}",Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
          var user = await _repo.GetUser(id);
          var userForReturn = _mapper.Map<UserForDetailsDto>(user);
           return Ok(userForReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id , [FromBody] UserForUpdate updateForUser){
              
              if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                    return Unauthorized("You can't update the details because not your account");
              }
              var userFromDB = await _repo.GetUser(id);
              _mapper.Map(updateForUser,userFromDB);
              if (await _repo.SaveAll()){
                  return NoContent();
              }
              throw new System.Exception("Something wen't wrong with updating user");
        }

        [HttpPost("{id}/Like/{receipentId}")]
        public async Task<IActionResult> LikeUser(int id , int receipentId){
          
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)) {
                return Unauthorized();
            }

            var like = await _repo.GetLike(id , receipentId);
            if (like != null){
                return BadRequest("You Already liked this person");
            }

            var likeeUser = await _repo.GetUser(receipentId);
            if (likeeUser == null){
                return NotFound("This user id: " + receipentId + " " + "Not found in our database");
            }

            var likeObj = new Like(){
               LikerId = id,
               LikeeId = receipentId
            };

            _repo.Add<Like>(likeObj);
            if (await _repo.SaveAll()){
                return Ok();
            }
            return BadRequest("Field to send like");

        }
    }
}