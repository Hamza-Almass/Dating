using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Helpers;

namespace ZwajApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
           _context.Remove(entity);
        }

        public async Task<Like> GetLike(int currentLoggedInUserId, int receipentUserId)
        {
            return await _context.Likes.FirstOrDefaultAsync(l => l.LikerId == currentLoggedInUserId && l.LikeeId == receipentUserId);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
           return await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include(u => u.Photos)
            .OrderByDescending(u => u.LastActive).AsQueryable();
             users = users.Where(u => u.Gender == userParams.Gender);
             users = users.Where(u => u.Id != userParams.UserId);
             var minAge = DateTime.Today.AddYears(-userParams.MaxAge-1);
             var maxAge = DateTime.Today.AddYears(-userParams.MinAge);
              users = users.Where(u => u.DateOfBirth >= minAge && u.DateOfBirth <= maxAge);

              if (userParams.IsLikers){
                  var likersId = await GetLikersAndLikees(userParams.UserId , true);
                  users = users.Where(u => likersId.Contains(u.Id));
              }

              if (userParams.IsLikees) {
                 var likeesId = await GetLikersAndLikees(userParams.UserId , false);
                  users = users.Where(u => likeesId.Contains(u.Id));
              }

             if (!string.IsNullOrEmpty(userParams.OrderBy)){
                 switch (userParams.OrderBy)
                 {
                     case "createdAt":
                     users = users.OrderByDescending(u => u.Created);
                     break;
                     default:
                     users = users.OrderByDescending(u => u.LastActive);
                     break;
                 }
             }

            return await PagedList<User>.CreateAsync(users,userParams.PageSize , userParams.PageNumber);
        }

        private async Task<IEnumerable<int>> GetLikersAndLikees(int userId , bool isLikers){
                var user = await _context.Users
                .Include(u => u.Likers)
                .Include(u => u.Likees)
                .FirstOrDefaultAsync(u => u.Id == userId);
             if (isLikers){
                return user.Likers.Where(u => u.LikeeId == userId).Select(l => l.LikerId);
             }
             return user.Likees.Where(u => u.LikerId == userId).Select(l => l.LikeeId);
        }

        public async Task<bool> SaveAll()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> SetMainPhoto(int photoId)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == photoId);
            photo.IsMain = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}