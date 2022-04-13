using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Dtos
{
    public class PhotoForCreateDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string PublicId { get; set; }
        public DateTime AddedDate { get; set; }
        public bool IsMain { get; set; }
    }
}