using System.Collections.Generic;
using System.Threading.Tasks;
using ZwajApp.API.Helpers;

namespace ZwajApp.API.Data
{
    public interface IDatingRepository
    {
         void Add<T> (T entity) where T: class;
         void Delete<T> (T entity) where T: class;
         Task<bool> SaveAll();
         Task<PagedList<User>> GetUsers(UserParams userParams);
         Task<User> GetUser(int id);

         Task<Photo> GetPhoto(int id);

         Task<Like> GetLike(int currentLoggedInUserId , int ReceipentUserId);

         Task<bool> SetMainPhoto(int photoId);
    }
}