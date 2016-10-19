using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Web;

namespace Order.Models
{
    public class Order : OrderBase
    {
        public Order()
        {
            promotions = new List<Promotion>();
        }
        public int customerId { get; set; }
        public string name { get; set; }
        public int shipWithOrderId { get; set; }
        public string notes { get; set; }
        public string custOrderId { get; set; }
        public string custPO { get; set; }
        public string orderDt { get; set; }
        public List<Promotion> promotions { get; set; }
        public string status { get; set; }
        public Boolean test { get; set; }

        public override SqlTransaction save(SqlConnection con, SqlTransaction sqltrans)
        {
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.Parameters.AddWithValue("oname", dbUtil.nullToDBNull(name));
            sqlcmd.Parameters.AddWithValue("onote", dbUtil.nullToDBNull(notes));
            sqlcmd.Parameters.AddWithValue("ocustid", customerId);
            sqlcmd.Parameters.AddWithValue("ocustorderid", dbUtil.nullToDBNull(custOrderId));
            sqlcmd.Parameters.AddWithValue("ocustpo", dbUtil.nullToDBNull(custPO));
            sqlcmd.Parameters.AddWithValue("odate", dbUtil.nullToDBNull(orderDt));
            sqlcmd.Parameters.AddWithValue("otest", dbUtil.nullToDBNull(test));
            base.addSqlParameters(sqlcmd);
            if (id > 0)
            {
                sqlcmd.Parameters.AddWithValue("oid", id);
                sqlcmd.CommandText = "update zzzSBOrder set OrderName=@oname,OrderNotes=@onote,CustOrderId=@ocustorderid,CustPO=@ocustpo,OrderDt=@odate,EstShipDt=@oshipdt,DueInStoreDt=@odueinstoredt,DispStartDt=@odispstrtdt, DispEndDt=@odispenddt, PackBy=@opackby,ShipTo=@oshipto,BillTo=@obillto,test=@otest,modifiedBy=@omby,modifiedOn=CURRENT_TIMESTAMP where orderid=@oid";
                sqlcmd.ExecuteNonQuery();
                if (promotions != null)
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (Promotion promo in promotions)
                    {
                        sb.Append(promo.id).Append(",");
                        promo.save(con,sqltrans);
                    }
                    if (sb.Length > 0)
                    {
                        sb.Remove(sb.Length - 1, 1); //Remove last coma
                        // create delete sql with a NOT IN where clause using sb
                        sqlcmd.CommandText="DELETE from zzzSBPromotion where orderId=@oid and PromoId not in ("+sb.ToString()+")";
                        sqlcmd.ExecuteNonQuery();
                    }
                }
            }
            else
            {
                if (createdBy == 0) createdBy = modifiedBy;
                sqlcmd.Parameters.AddWithValue("ocreatedBy", createdBy);
                sqlcmd.Parameters.AddWithValue("ostatus", dbUtil.nullToDBNull(status));
                sqlcmd.CommandText = "insert into zzzSBOrder (CustomerId,OrderName,status,OrderNotes,CustOrderId,CustPO,OrderDt,EstShipDt,DueInStoreDt,DispStartDt, DispEndDt, PackBy,ShipTo,BillTo,Test,modifiedBy,createdBy,modifiedOn) values(@ocustid,@oname,@ostatus,@onote,@ocustorderid,@ocustpo,@odate,@oshipdt,@odueinstoredt,@odispstrtdt, @odispenddt, @opackby,@oshipto,@obillto,@otest,@omby,@ocreatedby,CURRENT_TIMESTAMP) SELECT SCOPE_IDENTITY()";
                object res = sqlcmd.ExecuteScalar();
                id = Convert.ToInt32(res);
                if (promotions != null)
                {
                    foreach (Promotion promo in promotions)
                    {
                        promo.orderid = id;
                        promo.save(con,sqltrans);
                    }
                }
            }
            return sqltrans;
        }

        internal List<string> submit(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT ord.orderId,pro.PromoId, sum(case when pro.promoText is null then 0 else 1 end) as promoCnt, sum(case when sig.signid is null then 0 else 1 end) as signCnt FROM zzzSBOrder ord LEFT JOIN zzzSBPromotion pro ON ord.orderid=pro.orderid LEFT JOIN zzzSBSign sig ON pro.promoid=sig.promoid WHERE ord.OrderId=@oid group by ord.OrderId,pro.PromoId";
            sqlcmd.Parameters.AddWithValue("oid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            List<string> errors = new List<string>();
            while (reader.Read())
            {
                int promoCnt = dbUtil.objToInt(reader["promoCnt"]);
                int signCnt = dbUtil.objToInt(reader["signCnt"]);
                if (promoCnt == 0)
                {
                    errors.Add("Please specify at least one promotion with signs for the order!");
                } else if (signCnt ==0)
                {
                    int promoId = dbUtil.objToInt(reader["PromoId"]);
                    errors.Add("Please specify at least one sign for promotion "+promoId+"!");
                }
            }
            reader.Close();
            if (errors.Count()==0)
            {
                // No errors, so submit the order
                sqlcmd.CommandText = "UPDATE zzzSBOrder set status='Submitted' WHERE OrderId=@oid";
                sqlcmd.ExecuteNonQuery();
                status = "Submitted";
            }
            reader.Close();
            sqlcmd.Dispose();
            return errors;

        }
        internal Boolean approve(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT ord.status FROM zzzSBOrder ord WHERE OrderId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            List<string> errors = new List<string>();
            Boolean valid = false;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                if (status == "Submitted")
                {
                    valid = true;
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBOrder set status='Approved' WHERE OrderId=@oid";
                    sqlcmd.ExecuteNonQuery();
                    sqlcmd.CommandText = "UPDATE zzzSBSign set status='Pending' WHERE promoId in (select promoId from zzzSBPromotion where OrderId=@oid)";
                    sqlcmd.ExecuteNonQuery();
                    this.status = "Approved";
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return valid;
        }
        internal Boolean reject(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT ord.status FROM zzzSBOrder ord WHERE OrderId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            List<string> errors = new List<string>();
            Boolean valid = false;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                if (status == "Submitted")
                {
                    valid = true;
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBOrder set status='Draft' WHERE OrderId=@oid";
                    sqlcmd.ExecuteNonQuery();
                    this.status = "Draft";
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return valid;
        }
        internal int shipSigns(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT ord.status FROM zzzSBOrder ord WHERE OrderId=@oid";
            sqlcmd.Parameters.AddWithValue("oid", id);
            SqlDataReader reader = sqlcmd.ExecuteReader();
            List<string> errors = new List<string>();
            int nbSigns = 0;
            if (reader.Read())
            {
                string status = dbUtil.objToString(reader["status"]);
                if (status == "Approved")
                {
                    reader.Close();
                    sqlcmd.CommandText = "UPDATE zzzSBSign set status='Shipped' WHERE promoId in (select promoId from zzzSBPromotion where OrderId=@oid) and status='Completed'";
                    nbSigns = sqlcmd.ExecuteNonQuery();
                    if (nbSigns>0)
                    {
                        complete(con, sqltrans);
                    }
                }
            }
            reader.Close();
            sqlcmd.Dispose();
            return nbSigns;
        }
        /**
         * Verify if all signs have been shipped and the order is completed.
         */
        internal void complete(SqlConnection con, SqlTransaction sqltrans)
        {
            // Do we have at least one promotion and each promotion having at least one sign.
            SqlCommand sqlcmd = con.CreateCommand();
            sqlcmd.Transaction = sqltrans;
            sqlcmd.CommandType = System.Data.CommandType.Text;
            sqlcmd.CommandText = "SELECT count(*) as cnt FROM zzzSBsign sgn JOIN zzzSBPromotion pro ON pro.promoId=sgn.promoId WHERE pro.OrderId=@oid and sgn.status!='Shipped'";
            sqlcmd.Parameters.AddWithValue("oid", id);
            int nbLeft = Convert.ToInt32(sqlcmd.ExecuteScalar());
            if (nbLeft==0)
            {
                sqlcmd.CommandText = "UPDATE zzzSBOrder set status='Completed' WHERE OrderId=@oid";
                sqlcmd.ExecuteNonQuery();
                this.status = "Completed";
            }
            sqlcmd.Dispose();
        }

        public override SqlTransaction delete(SqlConnection con, SqlTransaction sqltrans)
        {
            //Note that cascade deletes have been implemented, so no need to delete signs and promotions first.
            SqlCommand sqlc=con.CreateCommand();
            sqlc.CommandType = CommandType.Text;
            sqlc.Transaction = sqltrans;
            sqlc.CommandText = "DELETE FROM zzzSBOrder WHERE orderid=@oid";
            sqlc.Parameters.AddWithValue("oid", id);
            sqlc.ExecuteNonQuery();
            sqlc.Dispose();
            return sqltrans;
        }

        public void get(SqlConnection con, SqlTransaction sqltrans)
        {
            if (id == 0) return;
            SqlCommand sqlc = con.CreateCommand();
            sqlc.CommandType = CommandType.Text;
            sqlc.Transaction = sqltrans;
            sqlc.CommandText = "SELECT * FROM zzzSBOrder WHERE OrderId=@oid";
            sqlc.Parameters.AddWithValue("oid", id);
            SqlDataReader reader=sqlc.ExecuteReader();
            if (reader.Read())
            {
                init(reader);
            }
            reader.Close();
            sqlc.Dispose();
        }

        protected new void init(SqlDataReader reader)
        {
            base.init(reader);
            id = dbUtil.objToInt(reader["orderId"]);
            name = dbUtil.objToString(reader["OrderName"]);
            status = dbUtil.objToString(reader["status"]);
            test = dbUtil.objToBoolean(reader["test"]);
            customerId = dbUtil.objToInt(reader["customerId"]); 
            custOrderId = dbUtil.objToString(reader["CustOrderId"]);
            custPO = dbUtil.objToString(reader["CustPO"]);
            orderDt = dbUtil.objToString(reader["OrderDt"]);
        }

        public void getWithPromo(SqlConnection con,SqlTransaction sqltrans)
        {
            get(con, sqltrans);
            promotions=Promotion.getAll(con, sqltrans, this);
        }
        public static List<Order> getAll(SqlConnection con,int customerId)
        {
            SqlCommand sqlc = con.CreateCommand();
            sqlc.CommandType = CommandType.Text;
            sqlc.CommandText = "SELECT * FROM zzzSBOrder WHERE CustomerId=@ocustId";
            sqlc.Parameters.AddWithValue("ocustId", customerId);
            SqlDataReader reader = sqlc.ExecuteReader();
            List<Order> orders = new List<Order>();
            while(reader.Read())
            {
                Order order = new Order();
                order.init(reader);
                orders.Add(order);
            }
            reader.Close();
            return orders;
        }
    }
}