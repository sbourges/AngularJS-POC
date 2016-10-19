using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Order.Models
{
    public class Promotion : OrderBase
    {
        public int orderid;
        public string promoText { get; set; }
        public string notes { get; set; }
        public List<Sign> signs { get; set; }

        public Promotion() {
            signs=new List<Sign>();
        }
        public void get(SqlConnection con, SqlTransaction sqltrans)
        {
            if (id == 0) return;
            SqlCommand sqlc = con.CreateCommand();
            sqlc.CommandType = CommandType.Text;
            sqlc.Transaction = sqltrans;
            sqlc.CommandText = "SELECT * FROM zzzSBPromotion WHERE PromoId=@oid";
            sqlc.Parameters.AddWithValue("oid", id);
            SqlDataReader reader = sqlc.ExecuteReader();
            if (reader.Read())
            {
                init(reader);
            }
            reader.Close();
        }
        public void getWithSigns(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBPromotion where promoId=@pid";
            sqlcmd.Parameters.AddWithValue("pid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            if (reader.Read())
            {
                init(reader);
                reader.Close();
                signs = Sign.getAll(con, sqltrans, this);
            } else
            {
                reader.Close();
            }
        }
        public static List<Promotion> getAll(SqlConnection con, SqlTransaction sqltrans, Order order)
        {
            List<Promotion> promos = new List<Promotion>();
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBPromotion where orderId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", order.id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            while (reader.Read())
            {
                Promotion promo = new Promotion();
                promo.orderid = order.id;
                promo.init(reader);
                promos.Add(promo);
            }
            reader.Close();
            sqlcmd.Dispose();
            return promos;
        }
        public override SqlTransaction save(SqlConnection con,SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.Parameters.AddWithValue("promoText", dbUtil.nullToDBNull(promoText));
            sqlcmd.Parameters.AddWithValue("promoNotes", dbUtil.nullToDBNull(notes));
            base.addSqlParameters(sqlcmd);
            if (id > 0)
            {
                sqlcmd.Parameters.AddWithValue("oid", id);
                sqlcmd.CommandText = "update zzzSBPromotion set promoText=@promoText,promoNotes=@promoNotes,EstShipDt=@oshipdt,DueInStoreDt=@odueinstoredt,DispStartDt=@odispstrtdt, DispEndDt=@odispenddt, PackBy=@opackby,ShipTo=@oshipto,BillTo=@obillto,modifiedBy=@omby,modifiedOn=CURRENT_TIMESTAMP where promoId=@oid";
                sqlcmd.ExecuteNonQuery();
                if (signs != null)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (Sign sign in signs)
                    {
                        sb.Append(sign.id).Append(",");
                        sign.save(con,sqltrans);
                    }
                    if (sb.Length > 0)
                    {
                        sb.Remove(sb.Length - 1, 1); //Remove last coma
                        // create delete sql with a NOT IN where clause using sb
                    }
                }
            } else
            {
                //TBD: Handle not having an order object and id.
                if (createdBy == 0) createdBy = modifiedBy;
                sqlcmd.Parameters.AddWithValue("ocreatedby", createdBy);
                sqlcmd.Parameters.AddWithValue("orderId", orderid);
                if (sqlcmd.Parameters.Contains("oshipdt"))
                {
                    Console.WriteLine("Got it");
                }
                sqlcmd.CommandText = "insert into zzzSBPromotion (OrderId,PromoText,PromoNotes,EstShipDt,DueInStoreDt,DispStartDt, DispEndDt, PackBy,ShipTo,BillTo,modifiedBy,createdBy,modifiedOn) values(@orderId,@promoText,@promoNotes,@oshipdt,@odueinstoredt,@odispstrtdt, @odispenddt, @opackby,@oshipto,@obillto,@omby,@ocreatedby,CURRENT_TIMESTAMP) SELECT SCOPE_IDENTITY()";
                object res = sqlcmd.ExecuteScalar();
                id = Convert.ToInt32(res);
                if (signs != null)
                {
                    foreach (Sign sign in signs)
                    {
                        sign.promoid = id;
                        sign.save(con,sqltrans);
                    }
                }
            }
            return sqltrans;
        }

        public override SqlTransaction delete(SqlConnection con, SqlTransaction sqltrans)
        {
            //Note that cascade deletes have been implemented, so no need to delete signs first.
            SqlCommand sqlc = con.CreateCommand();
            sqlc.CommandType = CommandType.Text;
            sqlc.Transaction = sqltrans;
            sqlc.CommandText = "DELETE FROM zzzSBPromotion WHERE promoid=@oid";
            sqlc.Parameters.AddWithValue("oid", id);
            sqlc.ExecuteNonQuery();
            return sqltrans;
        }

        protected new void init(SqlDataReader reader)
        {
            base.init(reader);
            id = dbUtil.objToInt(reader["promoId"]);
            promoText = dbUtil.objToString(reader["PromoText"]);
            notes = dbUtil.objToString(reader["PromoNotes"]);
            orderid = dbUtil.objToInt(reader["orderId"]);
        }
    }
}