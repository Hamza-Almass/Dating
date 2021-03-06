namespace ZwajApp.API.Helpers
{
    public class UserParams
    {
        public int UserId { get; set; }
        public string Gender { get; set; }
        private int maxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize {get;set;} = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > maxPageSize) ? maxPageSize : value; }
        }

       public bool IsLikers { get; set; } = false;
       public bool IsLikees { get; set; } = false;
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;
        public string OrderBy { get; set;}
        

    }
}