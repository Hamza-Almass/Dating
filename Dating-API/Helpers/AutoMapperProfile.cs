using System.Linq;
using AutoMapper;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;

namespace ZwajApp.API.Helpers
{
    public class AutoMapperProfile: Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User,UserForListDto>()
            .ForMember(dest => dest.Age , opt => {opt.ResolveUsing(src => src.DateOfBirth.CalculateAge());})
            .ForMember(dest => dest.PhotoUrl,opt => {opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);});

            CreateMap<User,UserForDetailsDto>()
            .ForMember(dest => dest.PhotoUrl , opt => {opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);});
            
            CreateMap<Photo,PhotoForDetailsDto>();

            CreateMap<UserForUpdate,User>();

            CreateMap<PhotoForCreateDto,Photo>();
            CreateMap<Photo,PhotoForReturnDto>();

            CreateMap<UserForRegisterDto,User>();

        }
    }
}