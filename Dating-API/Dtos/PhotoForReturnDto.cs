using System;

namespace ZwajApp.API.Dtos
{
    public class PhotoForReturnDto
    {
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime AddedDate { get; set; }
        public bool IsMain { get; set; }
    }
}