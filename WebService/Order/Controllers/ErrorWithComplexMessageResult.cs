using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Order.Controllers
{
    public class ErrorWithComplexMessageResult : IHttpActionResult
    {
        private List<string> message;
        private HttpStatusCode code;

        public ErrorWithComplexMessageResult(List<string> message, HttpStatusCode code)
        {
            this.message = message;
            this.code = code;
        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.NotFound);
            response.Content = new StringContent(JArray.FromObject(message).ToString(), Encoding.UTF8, "application/json");
            return Task.FromResult(response);
        }
    }
}