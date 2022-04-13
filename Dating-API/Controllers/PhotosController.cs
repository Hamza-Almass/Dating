using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helpers;

namespace ZwajApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly IDatingRepository _repo;
        private readonly Cloudinary _cloudinary;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;

        public PhotosController(IOptions<CloudinarySettings> cloudinarySettings, IMapper mapper, IDatingRepository repo)
        {
            _cloudinarySettings = cloudinarySettings;
            _repo = repo;
            _mapper = mapper;

            Account acc = new Account(_cloudinarySettings.Value.CloudName,_cloudinarySettings.Value.APIKey , _cloudinarySettings.Value.APISecret);
            _cloudinary = new Cloudinary(acc);
        }

          [HttpPost]
          public async Task<IActionResult> AddPhoto(int userId ,[FromForm] PhotoForCreateDto photoForCreateDto){
              if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value)){
                 return Unauthorized();
              }

              var userFromDB = await _repo.GetUser(userId);

              var imageUploadResult = new ImageUploadResult();
              if (photoForCreateDto.File != null && photoForCreateDto.File.Length > 0){
                  using (var stream = photoForCreateDto.File.OpenReadStream()){
                      var imageUploadParams = new ImageUploadParams(){
                          File = new FileDescription(photoForCreateDto.File.Name , stream),
                          Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                      };
                       imageUploadResult =  _cloudinary.Upload(imageUploadParams);
                       
                       if (photoForCreateDto != null) {
                        photoForCreateDto.Url = imageUploadResult.Url.ToString();
                        photoForCreateDto.PublicId = imageUploadResult.PublicId;
                       }
                  }
              }
             
              var photo = _mapper.Map<Photo>(photoForCreateDto);
              userFromDB.Photos.Add(photo);
              if (!userFromDB.Photos.Any(p => p.IsMain)){
                photo.IsMain = true;
              }
              
              if (await _repo.SaveAll()){
                  var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);
                  return CreatedAtRoute(new {id = photo.Id},photoForReturn);
              }
              return BadRequest("Problem with upload image");
          }

          [HttpGet("{id}",Name = "GetPhoto")]
          public async Task<IActionResult> GetCreatedPhoto(int id){
            var photo = await _repo.GetPhoto(id);
            var photoForReturn = _mapper.Map<PhotoForReturnDto>(photo);
            return Ok(photoForReturn);
          }

          [HttpPost("{photoId}/setMain")]
          public async Task<IActionResult> SetMainPhoto(int photoId , int userId){
              
              var currentUserLoggedIn =  await _repo.GetUser(int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value));
              if (userId != currentUserLoggedIn.Id){
                  return Unauthorized();
              }

              if (currentUserLoggedIn.Photos.FirstOrDefault(p => p.Id == photoId) == null){
               return Unauthorized();
              }

              foreach(var photo in currentUserLoggedIn.Photos){
                  photo.IsMain = false;
              }

              if (await _repo.SaveAll()){
                 if (await _repo.SetMainPhoto(photoId)){
                     return Ok(new {message = "Set main image successfully"});
                 }
              }

              return BadRequest("Someting went wrong with set main photo");
             
          }

          [HttpDelete("{photoId}")]
          public async Task<IActionResult> DeletePhoto(int userId , int photoId){
             if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
             return Unauthorized();

             var userFromDB = await _repo.GetUser(userId);
             if (userFromDB.Photos.Where(p => p.Id == photoId) == null)
             return Unauthorized();

             var photo = await _repo.GetPhoto(photoId);
             if (photo.IsMain){
                 return BadRequest("You can't delete the main photo");
             }

             if (photo.publicId != null){
                  var deletionParameter = new DeletionParams(photo.publicId);
                  var result = _cloudinary.Destroy(deletionParameter);
                  if (result.Result == "ok"){
                      _repo.Delete(photo);
                  }
             }else{
                _repo.Delete(photo);
             }

             if (await _repo.SaveAll()){
               return Ok();
             }

             return BadRequest(new {Error = "Something went wrong when trying deleting image"});
             

          }


    }
}