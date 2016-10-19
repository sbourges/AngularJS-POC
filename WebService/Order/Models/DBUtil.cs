using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Order.Models
{
    public class DBUtil
    {
        public String objToString(Object obj)
        {
            if (obj == null) return null;
            if (obj.GetType() == typeof(DateTime)) return Convert.ToDateTime(obj).ToString("yyyy-MM-dd");
            return obj.ToString();
        }
        public Boolean objToBoolean(Object obj)
        {
            if (obj == null) return false;
            return obj.ToString().Equals("True");
        }
        public int objToInt(Object obj)
        {
            if (obj == null) return 0;
            return Int32.Parse(obj.ToString());
        }
        public double objToDouble(Object obj)
        {
            if (obj == null) return 0;
            return Double.Parse(obj.ToString());
        }
        public Object nullToDBNull(Object obj)
        {
            if (obj == null) return DBNull.Value;
            return obj;
        }

    }
}