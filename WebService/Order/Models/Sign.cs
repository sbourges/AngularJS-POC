using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Order.Models
{
    public class Sign : OrderBase
    {
        public int promoid { get; set; }
        public List<Shipping> shippings { get; set; }
        public int signType { get; set; }
        public int custSignType { get; set; }
        public double width { get; set; }
        public double height { get; set; }
        public int stock { get; set; }
        public int stock2 { get; set; }
        public int priority { get; set; }
        public int qty { get; set; }
        public string status { get; set; }
        public string notes { get; set; }

        public void get(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBSign where signId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", id);
            SqlDataReader reader=sqlcmd.ExecuteReader();
            if (reader.Read())
            {
                init(reader);
            }
            reader.Close();
            shippings = Shipping.getAll(con, sqltrans, this);
        }
        public static List<Sign> getAll(SqlConnection con, SqlTransaction sqltrans,Promotion parent)
        {
            List<Sign> signs=new List<Sign>();
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandText = "select * from zzzSBSign where promoId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", parent.id);
            try
            {
                SqlDataReader reader = sqlcmd.ExecuteReader();
                while (reader.Read())
                {
                    Sign sign = new Sign();
                    sign.promoid = parent.id;
                    sign.init(reader);
                    signs.Add(sign);
                }
                reader.Close();
            } catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            return signs;
        }
        public new void init(SqlDataReader reader)
        {
            base.initNoDates(reader);
            id = dbUtil.objToInt(reader["signId"]);
            signType = dbUtil.objToInt(reader["signType"]);
            status = dbUtil.objToString(reader["status"]);
            custSignType = dbUtil.objToInt(reader["custType"]);
            width = dbUtil.objToDouble(reader["width"]);
            height = dbUtil.objToDouble(reader["height"]);
            stock = dbUtil.objToInt(reader["stock"]);
            stock2 = dbUtil.objToInt(reader["stock2"]);
            priority = dbUtil.objToInt(reader["priority"]);
            qty = dbUtil.objToInt(reader["qty"]);
            notes = dbUtil.objToString(reader["SignNotes"]);
        }
        public override SqlTransaction save(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Transaction = sqltrans;
            sqlcmd.Parameters.AddWithValue("signType", signType);
            sqlcmd.Parameters.AddWithValue("custSignType", custSignType);
            sqlcmd.Parameters.AddWithValue("width", width);
            sqlcmd.Parameters.AddWithValue("height", height);
            sqlcmd.Parameters.AddWithValue("stock", stock);
            sqlcmd.Parameters.AddWithValue("stock2", stock2);
            sqlcmd.Parameters.AddWithValue("priority", priority);
            sqlcmd.Parameters.AddWithValue("qty", qty);
            sqlcmd.Parameters.AddWithValue("notes", dbUtil.nullToDBNull(notes));
            base.addSqlParameters(sqlcmd);
            if (id > 0)
            {
                sqlcmd.Parameters.AddWithValue("oid", id);
                sqlcmd.CommandText = "update zzzSBSign set signType=@signType,custType=@custSignType,width=@width,height=@height,stock=@stock,stock2=@stock2,priority=@priority,qty=@qty,PackBy=@opackby,ShipTo=@oshipto,BillTo=@obillto,SignNotes=@notes,modifiedBy=@omby,modifiedOn=CURRENT_TIMESTAMP where signId=@oid";
                sqlcmd.ExecuteNonQuery();
                if (shippings != null)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (Shipping ship in shippings)
                    {
                        ship.signId = id;
                        ship.shipType = shipTo;
                        ship.save(con, sqltrans);
                        sb.Append(ship.id).Append(",");
                    }
                    if (sb.Length > 0)
                    {
                        sb.Remove(sb.Length - 1, 1); //Remove last coma
                                                     // create delete sql with a NOT IN where clause using sb
                        sqlcmd.CommandText = "DELETE from zzzSBShipping where signId=@oid and ShipId not in (" + sb.ToString() + ")";
                        sqlcmd.ExecuteNonQuery();
                    }
                }
            }
            else
            {
                sqlcmd.Parameters.AddWithValue("promoId", promoid);
                sqlcmd.Parameters.AddWithValue("ocreatedby", createdBy);
                sqlcmd.CommandText = "insert into zzzSBSign (promoId,signType,custType,status,width,height,stock,stock2,priority,qty, PackBy,ShipTo,BillTo,SignNotes,modifiedBy,createdBy,modifiedOn) values(@promoId,@signType,@custSignType,'Draft',@width,@height,@stock,@stock2,@priority,@qty,@opackby,@oshipto,@obillto,@notes,@omby,@ocreatedby,CURRENT_TIMESTAMP) SELECT SCOPE_IDENTITY()";
                object res = sqlcmd.ExecuteScalar();
                id = Convert.ToInt32(res);
                if (shippings != null)
                {
                    foreach (Shipping ship in shippings)
                    {
                        ship.signId = id;
                        ship.save(con, sqltrans);
                    }
                }
            }
            return sqltrans;
        }

        public override SqlTransaction delete(SqlConnection con, SqlTransaction sqltrans)
        {
            //Note that cascade deletes have been implemented, so no need to delete signs and promotions first.
            SqlCommand sqlc = con.CreateCommand();
            sqlc.CommandType = System.Data.CommandType.Text;
            sqlc.Transaction = sqltrans;
            sqlc.CommandText = "DELETE FROM zzzSBSign WHERE signid=@oid";
            sqlc.Parameters.AddWithValue("oid", id);
            sqlc.ExecuteNonQuery();
            return sqltrans;
        }

        internal Boolean start(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT sgn.status FROM zzzSBSign sgn WHERE signid=@sid";
            sqlcmd.Parameters.AddWithValue("sid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            Boolean valid = false;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                if (status == "Pending")
                {
                    valid = true;
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBSign set status='Started' WHERE signId=@sid";
                    sqlcmd.ExecuteNonQuery();
                    this.status = "Started";
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return valid;
        }
        internal Boolean complete(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT sgn.status FROM zzzSBSign sgn WHERE signid=@sid";
            sqlcmd.Parameters.AddWithValue("sid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            Boolean valid = false;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                if (status == "Started")
                {
                    valid = true;
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBSign set status='Completed' WHERE signId=@sid";
                    sqlcmd.ExecuteNonQuery();
                    this.status = "Completed";
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return valid;
        }
        internal Boolean ship(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT sgn.status, pro.orderId FROM zzzSBSign sgn JOIN zzzSBPromotion pro on sgn.promoId=pro.promoId WHERE sgn.signid=@sid";
            sqlcmd.Parameters.AddWithValue("sid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            Boolean valid = false;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                int orderid = dbUtil.objToInt(reader["orderId"]);
                if (status == "Completed")
                {
                    valid = true;
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBSign set status='Shipped' WHERE signId=@sid";
                    sqlcmd.ExecuteNonQuery();
                    this.status = "Shipped";
                    Order order = new Order();
                    order.id = orderid;
                    order.complete(con, sqltrans);
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return valid;
        }
    }
}