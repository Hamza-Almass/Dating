using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ZwajApp.API.Helpers
{
    public class PagedList<T>: List<T>
    {
        public int TotalCount { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPage { get; set; }
        public int PageSize { get; set; }
        public List<T> Items { get; set; }

       public PagedList(List<T> items , int totalCount , int pageSize , int currentPage)
       {
           this.TotalPage =  (int)Math.Ceiling(totalCount / (double)pageSize);
           this.TotalCount = totalCount;
           this.CurrentPage = currentPage;
           this.PageSize = pageSize;
           this.Items = items;
           this.AddRange(items);
       }

       public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source , int pageSize , int pageNumber){
           var count = await source.CountAsync();
           var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
           return  new PagedList<T>(items,count,pageSize,pageNumber);
       }

    }
}