<%@ WebHandler Language="C#" Class="upload" %>

using System;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.IO;

public class upload : IHttpHandler
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        context.Response.ContentType = "text/html";
        context.Response.Charset = "UTF-8";

        string action = context.Request.Params["method"];
        try
        {
            if (action == null || action == "") throw new Exception("method不能为空");

            if (action=="upload") { 
                upload(context);
            }
            else
            {
                throw new Exception("不支持method");
            }
            
        }
        catch (Exception ex)
        {
            JsonHelper.Write(false, ex.Message, "");
        }
        finally
        {
            context.Response.End();//处理完成，返回Response
        }

    }
    
	public void upload(HttpContext context)
    {
        context.Response.ContentType = "text/json";

        try
        {

            HttpPostedFile hpfile = context.Request.Files[0];
            string ext = System.IO.Path.GetExtension(hpfile.FileName).ToLower();
            string _filename = Path.GetFileName(hpfile.FileName);
            int fileSize = hpfile.ContentLength;

            //检查文件类型asp aspx ashx，htm html等不允许
            if (".htm,.as".Contains(ext))
            {
                throw new Exception("不能上传此类型"+ext);
            }

            string filename = Guid.NewGuid().ToString() + ext;
            string savepath = "/upload_file/" + DateTime.Now.ToString("yyyy") + "/" + DateTime.Now.ToString("MM") + "/";

            string abspath = context.Server.MapPath("~") + savepath;
            if (!Directory.Exists(abspath))
            {
                Directory.CreateDirectory(abspath);
            }

            string path = abspath + filename;

            hpfile.SaveAs(path);

            string responseFileName = savepath + filename;            

            context.Response.Write("1|" + responseFileName + "|" + _filename);
        }
        catch (Exception ex)
        {
            context.Response.Write("0|" + ex.Message);
        }

    }

}