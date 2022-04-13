using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using ZwajApp.API.Data;
using ZwajApp.API.Helpers;

namespace ZwajApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(options => options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddControllers();
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddAutoMapper();
            services.AddTransient<TrailData>();
            services.AddScoped<IAuthRepository,AuthRepository>();
             services.AddScoped<IDatingRepository,DatingRepository>();
             services.AddScoped<LogLastActive>();
             services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)    
                  .AddJwtBearer(options =>    
              {    
               options.TokenValidationParameters = new TokenValidationParameters    
              {    
            ValidateIssuer = false,    
            ValidateAudience = false,    
            ValidateIssuerSigningKey = true,    
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["AppSettings:token"]))    
            };    
        });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ZwajApp.API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env , TrailData trialData)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ZwajApp.API v1"));
            }
            else{
                 // Handle exception Globally
                app.UseExceptionHandler(handler => {
                    handler.Run(async context => {
                           context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                           var error = context.Features.Get<IExceptionHandlerFeature>();
                          
                           if (error != null){
                               context.Response.AddHeaderException(error.Error.Message);
                               await context.Response.WriteAsync(error.Error.Message);
                           }
                    });
                });
            }
            app.UseHttpsRedirection();

            app.UseRouting();
            // If you want to seed new data uncomment the line below
            //trialData.readDataFromJsonFileToSeedData();
            app.UseCors(c => c.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
               
                endpoints.MapControllers();
            });
        }
    }
}
