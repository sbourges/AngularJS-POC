using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace Order.Controllers
{
    [RoutePrefix("api/Order")]
    public class OrderController : ApiController
    {
        private static String SQLCONSTR = @"Data Source=TESTDATAW\dev14;Initial Catalog = GSP_PROD01; User ID = GSPUser; Password=gsp#123;Pooling=True;Max Pool Size=10;Connect Timeout=10";
        [Route("")]
        [HttpGet]
        // GET api/Order?id=1
        public Models.Order GetOrder(int id)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                Models.Order order = new Models.Order();
                order.id = id;
                order.get(con,null);
                return order;
            }
        }
        [Route("GetWithPromo")]
        [HttpGet]
        // GET api/Order/GetWithPromo?id=1
        public IHttpActionResult GetOrderWithPromo(int id)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                Models.Order order = new Models.Order();
                order.id = id;
                order.getWithPromo(con, null);
                try
                {
                    return Ok(order);
                } catch(Exception e)
                {
                    Console.WriteLine(e);
                    return InternalServerError(e);
                }
            }
        }
        [Route("All")]
        [HttpGet]
        // GET api/Order/GetAllOrders?customerid=1
        public IHttpActionResult GetAllOrders(int customerId)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                List<Models.Order> orders = Models.Order.getAll(con, customerId);
                return Ok(orders);
            }
        }
        [Route("")]
        [HttpPost,HttpPut]
        public IHttpActionResult SaveOrder([FromBody]Models.Order order)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                order.save(con, null);
                return Ok(order);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("Submit")]
        [HttpPost]
        public IHttpActionResult SubmitOrder([FromBody]Models.Order order)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                List<string> errors=order.submit(con, null);
                if (errors.Count() > 0)
                {
                    return new ErrorWithComplexMessageResult(errors,HttpStatusCode.BadRequest);
                }
                else
                {
                    return Ok(order);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("Approve")]
        [HttpPost]
        public IHttpActionResult ApproveOrder([FromBody]Models.Order order)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                if (order.approve(con, null))
                {
                    return Ok(order);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("Reject")]
        [HttpPost]
        public IHttpActionResult RejectOrder([FromBody]Models.Order order)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                if (order.reject(con, null))
                {
                    return Ok(order);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("")]
        [HttpDelete]
        // DELETE api/Order
        public IHttpActionResult DeleteOrder([FromBody]Models.Order order)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                order.delete(con, null);
                return Ok();
            }
        }
        [Route("Ship")]
        [HttpPost]
        // DELETE api/Order
        public IHttpActionResult ShipOrder([FromBody]Models.Order order)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                int nb=order.shipSigns(con, null);
                return Ok(""+nb);
            }
        }
        [Route(""),Route("Submit"),Route("Approve"), Route("Reject"), Route("Ship")]
        [HttpOptions]
        public IHttpActionResult OptionsOrder()
        {
            return Ok();
        }

        [Route("Promo")]
        [HttpGet]
        // GET api/Order/Promo?id=1
        public Models.Promotion GetPromo(int id)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                Models.Promotion promo = new Models.Promotion();
                promo.id = id;
                promo.get(con, null);
                return promo;
            }
        }
        [Route("PromoWithSign")]
        [HttpGet]
        // GET api/Order/PromoWithSign?id=1
        public Models.Promotion GetPromoWithSign(int id)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                Models.Promotion promo = new Models.Promotion();
                promo.id = id;
                promo.getWithSigns(con, null);
                return promo;
            }
        }
        [Route("Promo")]
        [HttpPost,HttpPut]
        // POST or PUT api/Order/Promo
        public IHttpActionResult SavePromo([FromBody]Models.Promotion promo)
        {
            Console.WriteLine("SavePromo started!" + promo);
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                promo.save(con, null);
                return Ok(promo);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("Promo")]
        [HttpDelete]
        // DELETE api/Order/Promo
        public IHttpActionResult DeletePromo([FromBody]Models.Promotion promo)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                promo.delete(con, null);
                return Ok();
            }
        }
        [Route("Promo")]
        [HttpOptions]
        public IHttpActionResult OptionsPromo()
        {
            return Ok();
        }
        [Route("Sign")]
        [HttpGet]
        // GET api/Order/Sign?id=1
        public Models.Sign GetSign(int id)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                Models.Sign sign = new Models.Sign();
                sign.id = id;
                sign.get(con, null);
                return sign;
            }
        }
        [Route("Sign"),Route("Sign/Start"),Route("Sign/Complete"),Route("Sign/Ship")]
        [HttpOptions]
        public IHttpActionResult OptionsSign()
        {
            return Ok();
        }
        [Route("Sign")]
        [HttpPost, HttpPut]
        // POST or PUT api/Order/Sign
        public IHttpActionResult SaveSign([FromBody]Models.Sign sign)
        {
            SqlConnection con = null;
            try
            {
                con = new SqlConnection(SQLCONSTR);
                con.Open();
                sign.save(con, null);
                return Ok(sign);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Got exception saving sign " + ex);
                return InternalServerError(ex);
            }
            finally
            {
                if (con != null) con.Close();
            }
        }
        [Route("Sign")]
        [HttpDelete]
        // DELETE api/Order/Sign
        public IHttpActionResult DeleteSign([FromBody]Models.Sign sign)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                sign.delete(con, null);
                return Ok();
            }
        }
        [Route("Sign/Start")]
        [HttpPost]
        // DELETE api/Order/Sign
        public IHttpActionResult StartSign([FromBody]Models.Sign sign)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                sign.start(con, null);
                return Ok(sign);
            }
        }
        [Route("Sign/Complete")]
        [HttpPost]
        // DELETE api/Order/Sign
        public IHttpActionResult CompleteSign([FromBody]Models.Sign sign)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                sign.complete(con, null);
                return Ok(sign);
            }
        }
        [Route("Sign/Ship")]
        [HttpPost]
        // DELETE api/Order/Sign
        public IHttpActionResult ShipSign([FromBody]Models.Sign sign)
        {
            using (SqlConnection con = new SqlConnection(SQLCONSTR))
            {
                con.Open();
                if (sign.ship(con, null))
                {
                    return Ok(sign);
                } else
                {
                    return BadRequest("Invalid state!");
                }
            }
        }
    }
}
