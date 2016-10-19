using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Order.Models
{
    public class Shipping
    {
        public int id;
        public int signId { get; set; }
        public int shipType { get; set; }
        public int shipValue { get; set; }
        public string createdOn { get; set; }
        public int createdBy { get; set; }
        public string modifiedOn { get; set; }
        public int modifiedBy { get; set; }

        public void init(SqlDataReader reader)
        {
            DBUtil dbUtil = new DBUtil();
            id = dbUtil.objToInt(reader["shipId"]);
            signId = dbUtil.objToInt(reader["signId"]);
            shipType = dbUtil.objToInt(reader["shipType"]);
            shipValue = dbUtil.objToInt(reader["shipValue"]);
            createdBy = dbUtil.objToInt(reader["createdBy"]);
            createdOn = dbUtil.objToString(reader["createdOn"]);
            modifiedBy = dbUtil.objToInt(reader["modifiedBy"]);
            modifiedOn = dbUtil.objToString(reader["modifiedOn"]);
        }
        public void get(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBShipping where shipId=@sid";
            sqlcmd.Parameters.AddWithValue("sid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            if (reader.Read())
            {
                init(reader);
            }
            reader.Close();
            sqlcmd.Dispose();
        }
        public static List<Shipping> getAll(SqlConnection con, SqlTransaction sqltrans, Sign sign)
        {
            List<Shipping> shippings = new List<Shipping>();
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBShipping where signId=@sid";
            sqlcmd.Parameters.AddWithValue("sid", sign.id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            while (reader.Read())
            {
                Shipping ship = new Shipping();
                ship.signId = sign.id;
                ship.init(reader);
                shippings.Add(ship);
            }
            reader.Close();
            sqlcmd.Dispose();
            return shippings;
        }
        public void save(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.Parameters.AddWithValue("shipType", shipType);
            sqlcmd.Parameters.AddWithValue("shipValue", shipValue);
            sqlcmd.Parameters.AddWithValue("sid", signId);
            if (id>0)
            {
                sqlcmd.CommandText = "update zzzSBShipping set shipType=@shipType, shipValue=@shipValue, modifiedOn=CURRENT_TIMESTAMP where shipId=@cid";
                sqlcmd.Parameters.AddWithValue("cid", id);
                sqlcmd.ExecuteNonQuery();
            }
            else
            {
                sqlcmd.CommandText = "insert into zzzSBShipping (signId,shipType,shipValue,createdBy,createdOn,modifiedBy,modifiedOn) values(@sid,@shipType,@shipValue,1,CURRENT_TIMESTAMP,1,CURRENT_TIMESTAMP) SELECT SCOPE_IDENTITY()";
                object res = sqlcmd.ExecuteScalar();
                id = Convert.ToInt32(res);
            }
            sqlcmd.Dispose();
        }
    }
}