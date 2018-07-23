using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MVC_Editable_Gridview.Models;
using System.Web.Script.Serialization;

namespace MVC_Editable_Gridview.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Load(string listnm) {
            //Not using list name field bc only 1 list is here. Otherwise we can.
            return Json(Data.READ(), JsonRequestBehavior.AllowGet);
        }
        public JsonResult Add(string dataStr) {
            DotaObject model = new JavaScriptSerializer().Deserialize<DotaObject>(dataStr);
            return Json(Data.CREATE(model), JsonRequestBehavior.AllowGet);
        }
        public JsonResult Update(string dataStr) {
            DotaObject model = new JavaScriptSerializer().Deserialize<DotaObject>(dataStr);
            return Json(Data.UPDATE(model), JsonRequestBehavior.AllowGet);
        }
        public JsonResult Delete(int id) {
            return Json(Data.DELETE(id), JsonRequestBehavior.AllowGet);
        }
    }
}