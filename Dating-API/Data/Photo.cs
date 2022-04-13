using System;

namespace ZwajApp.API.Data
{
    public class Photo
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public DateTime AddedDate { get; set; }
        public string Description { get; set; }
        public bool  IsMain { get; set; }
        public string publicId {get;set;}
        public User User { get; set; }
        public int UserId { get; set; }
    }
}