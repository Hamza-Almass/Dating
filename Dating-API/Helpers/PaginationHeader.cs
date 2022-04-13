namespace ZwajApp.API.Helpers
{
    public class PaginationHeader
    {
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int ItemsPerPage { get; set; }
    }
}