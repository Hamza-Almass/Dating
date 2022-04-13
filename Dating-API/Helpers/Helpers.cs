using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ZwajApp.API.Helpers
{
    public static class Helpers
    {
        public static void AddHeaderException(this HttpResponse response,string message){
                response.Headers.Add("Application-Error",message);
                response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
                response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static void AddPagination(this HttpResponse response , PaginationHeader paginationHeader){
             var serilizingSettings = new JsonSerializerSettings();
             serilizingSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
             response.Headers.Add("pagination", JsonConvert.SerializeObject(paginationHeader,serilizingSettings));
              response.Headers.Add("Access-Control-Expose-Headers","pagination");
        }
        public static int CalculateAge(this DateTime dateTime){
          var age = DateTime.Today.Year - dateTime.Year;
          if (dateTime.AddYears(age) > DateTime.Today) age--;
          return age;
        }
    }
}