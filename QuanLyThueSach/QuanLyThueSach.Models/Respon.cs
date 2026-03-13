using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuanLyThueSach.Models
{
    public class Respon<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = default!;
        public object? Data { get; set; }
    }
}
