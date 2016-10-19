using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Order.Models
{
    public abstract class OrderBase
    {
        public int id { get; set; }
        public string estShipDt { get; set; }
        public string dueInStoreDt { get; set; }
        public string dispStartDt { get; set; }
        public string dispEndDt { get; set; }
        public int packBy { get; set; }
        public int shipTo { get; set; }
        public int billTo { get; set; }
        public string createdOn { get; set; }
        public int createdBy { get; set; }
        public string modifiedOn { get; set; }
        public int modifiedBy { get; set; }
        public DBUtil dbUtil = new DBUtil();

        public abstract SqlTransaction save(SqlConnection con,SqlTransaction sqltrans);
        public abstract SqlTransaction delete(SqlConnection con, SqlTransaction sqltrans);
        
        protected internal void addSqlParameters(SqlCommand sqlc)
        {
            sqlc.Parameters.AddWithValue("oshipdt", dbUtil.nullToDBNull(estShipDt));
            sqlc.Parameters.AddWithValue("odueinstoredt", dbUtil.nullToDBNull(dueInStoreDt));
            sqlc.Parameters.AddWithValue("odispstrtdt", dbUtil.nullToDBNull(dispStartDt));
            sqlc.Parameters.AddWithValue("odispenddt", dbUtil.nullToDBNull(dispEndDt));
            sqlc.Parameters.AddWithValue("opackby", packBy);
            sqlc.Parameters.AddWithValue("oshipto", shipTo);
            sqlc.Parameters.AddWithValue("obillto", billTo);
            sqlc.Parameters.AddWithValue("omby", modifiedBy);
        }
        protected void init(SqlDataReader reader)
        {
            estShipDt = dbUtil.objToString(reader["EstShipDt"]);
            dueInStoreDt = dbUtil.objToString(reader["DueInStoreDt"]);
            dispStartDt = dbUtil.objToString(reader["DispStartDt"]);
            dispEndDt = dbUtil.objToString(reader["DispEndDt"]);
            initNoDates(reader);
        }
        protected void initNoDates(SqlDataReader reader) {
            packBy = dbUtil.objToInt(reader["PackBy"]);
            shipTo = dbUtil.objToInt(reader["ShipTo"]);
            billTo = dbUtil.objToInt(reader["BillTo"]);
            createdBy = dbUtil.objToInt(reader["createdBy"]);
            createdOn = dbUtil.objToString(reader["createdOn"]);
            modifiedBy = dbUtil.objToInt(reader["modifiedBy"]);
            modifiedOn = dbUtil.objToString(reader["modifiedOn"]);
        }
    }
}