using Microsoft.VisualStudio.TestTools.UnitTesting;
using Order.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Order.Models.Tests
{
    [TestClass()]
    public class OrderTests
    {
        private int origOrderId;
        private int origPromoId;
        private int origSign2Id;
        private static String SQLCONSTR= @"Data Source=TESTDATAW\dev14;Initial Catalog = GSP_PROD01; User ID = GSPUser; Password=gsp#123;Pooling=True;Max Pool Size=10;Connect Timeout=10";
        private static String FINAL_ORDER_NAME = "TOrder1";
        private static String FINAL_ORDER_CUST_PO = "234A123";
        private static String FINAL_PROMO_TEXT = "Double or nothing";
        [TestMethod()]
        public void orderEnd2EndTest()
        {
            //Creating an order with 1 promo containing 2 signs.
            Order order = new Order();
            order.customerId = 12;
            order.custOrderId = "234A123";
            order.custPO = FINAL_ORDER_CUST_PO;
            order.name = FINAL_ORDER_NAME;
            order.notes = "Ship, ship it good!";
            order.orderDt = DateTime.Now.ToString("yyyy-MM-dd");
            order.dispStartDt = DateTime.Now.AddDays(15).ToString("yyyy-MM-dd");
            order.dispEndDt = DateTime.Now.AddDays(30).ToString("yyyy-MM-dd");
            order.shipTo = 1;
            order.modifiedBy = 10;
            Promotion promo = new Promotion();
            promo.dispStartDt = order.dispStartDt;
            promo.dispEndDt = order.dispEndDt;
            promo.promoText = "Go all in";
            order.promotions.Add(promo);
            Sign sign = new Sign();
            sign.packBy = 1;
            sign.priority = 1;
            sign.qty = 100;
            sign.stock = 12;
            sign.custSignType = 1;
            sign.signType = 1;
            sign.width = 2.5;
            sign.height = 2.3;
            promo.signs.Add(sign);
            sign = new Sign();
            sign.packBy = 1;
            sign.priority = 1;
            sign.qty = 50;
            sign.stock = 10;
            sign.custSignType = 2;
            sign.signType = 2;
            sign.width = 8.5;
            sign.height = 11.0;
            promo.signs.Add(sign);
            // Testing the save as a create
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                SqlTransaction sqltrans = con.BeginTransaction();
                order.save(con, sqltrans);
                sqltrans.Commit();
            }
            origOrderId = order.id;
            Assert.AreNotEqual(0, order.id, 0, "Order ID not created!");
            Assert.AreEqual(1, order.promotions.Count, 0, "We do not have one promotion.");
            origPromoId = order.promotions.ElementAt(0).id;
            Assert.AreNotEqual(0, order.promotions.ElementAt(0).id, 0, "Promotion ID not created!");
            Assert.AreEqual(2, order.promotions.ElementAt(0).signs.Count, 0, "We do not have two signs.");
            for (int index = 0; index < order.promotions.ElementAt(0).signs.Count; index++)
            {
                Assert.AreNotEqual(0, order.promotions.ElementAt(0).signs.ElementAt(index).id, 0, "Sign " + index + " ID not created!");
            }
            origSign2Id = order.promotions.ElementAt(0).signs.ElementAt(1).id;
            Console.WriteLine("OrderId:" + origOrderId + ", PromoId:" + origPromoId + ", SignId:" + origSign2Id);
            Assert.AreEqual("Go all in", order.promotions.ElementAt(0).promoText, "Promotion text not original.");
            Assert.AreEqual(11, order.promotions.ElementAt(0).signs.ElementAt(1).height, 0, "Sign 2 Height not original!");
            order.billTo = 3;
            order.promotions.ElementAt(0).promoText = FINAL_PROMO_TEXT;
            order.promotions.ElementAt(0).signs.ElementAt(1).height = 17;
            // Testing the save as an update
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                SqlTransaction sqltrans = con.BeginTransaction();
                order.save(con, sqltrans);
                sqltrans.Commit();
            }
            Assert.AreEqual(origOrderId, order.id, 0, "Order id was updated.");
            Assert.AreEqual(origPromoId, order.promotions.ElementAt(0).id, 0, "Promo id was updated.");
            Assert.AreEqual(origSign2Id, order.promotions.ElementAt(0).signs.ElementAt(1).id, 0, "Sign 2 id was updated.");
            Assert.AreEqual(3, order.billTo, 0, "Order billTo is not updated.");
            Assert.AreEqual(FINAL_PROMO_TEXT, order.promotions.ElementAt(0).promoText, "Promotion text not updated.");
            Assert.AreEqual(17, order.promotions.ElementAt(0).signs.ElementAt(1).height, 0, "Sign 2 Height is not updated.");
            Assert.AreEqual(8.5, order.promotions.ElementAt(0).signs.ElementAt(1).width, 0, "Sign 2 Width was updated.");
            // Getting order back
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                SqlTransaction sqltrans = con.BeginTransaction();
                order = new Order();
                order.id = origOrderId;
                order.get(con,sqltrans);
                Assert.AreEqual(FINAL_ORDER_NAME, order.name,"Order name not as expected after get");
                Assert.AreEqual(FINAL_ORDER_CUST_PO, order.custPO, "Order customer PO not as expected after get");
            }
            //Deleting order created
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                SqlTransaction sqltrans = con.BeginTransaction();
                SqlCommand sqlcmd = con.CreateCommand();
                sqlcmd.Transaction = sqltrans;
                sqlcmd.CommandType = System.Data.CommandType.Text;
                sqlcmd.CommandText = "select count(*) from zSBOrder";
                int nbOrdersBefore = Convert.ToInt32(sqlcmd.ExecuteScalar());
                sqlcmd.CommandText = "select count(*) from zSBPromotion";
                int nbPromosBefore = Convert.ToInt32(sqlcmd.ExecuteScalar());
                sqlcmd.CommandText = "select count(*) from zSBSign";
                int nbSignsBefore = Convert.ToInt32(sqlcmd.ExecuteScalar());
                order = new Order();
                order.id = origOrderId;
                Console.WriteLine("About to delete order id " + order.id);
                order.delete(con, sqltrans);
                sqltrans.Commit();
                sqlcmd.CommandText = "select count(*) from zSBOrder";
                int actual = Convert.ToInt32(sqlcmd.ExecuteScalar());
                Assert.AreEqual(nbOrdersBefore - 1, actual, 0, "Number of orders after delete no correct");
                sqlcmd.CommandText = "select count(*) from zSBPromotion";
                actual = Convert.ToInt32(sqlcmd.ExecuteScalar());
                Assert.AreEqual(nbPromosBefore - 1, actual, 0, "Number of promotions after delete no correct");
                sqlcmd.CommandText = "select count(*) from zSBSign";
                actual = Convert.ToInt32(sqlcmd.ExecuteScalar());
                Assert.AreEqual(nbSignsBefore - 2, actual, 0, "Number of signs after delete no correct");
                sqlcmd.CommandText = "select count(*) from zSBOrder where orderid=" + origOrderId;
                SqlDataReader reader = sqlcmd.ExecuteReader();
                Assert.IsFalse(reader.NextResult());
                reader.Close();
            }
        }
    }
}