function compostajax(parmsinfo) {
    try
    {
        var strurl = parmsinfo["url"];
        if (strurl.indexOf('?') == -1)
            strurl += "?" + Date.parse(new Date());
        else
            strurl += "&" + Date.parse(new Date());
        var callback1 = parmsinfo["callback1"];
        var postdata = parmsinfo["postdata"];
        jQuery.ajax({
            type: "POST",
            url: strurl,
            data: postdata,
            dataType: 'json',
            success: function (msg) {
                if (typeof (callback1) != "undefined") {
                    parmsinfo["msg"] = msg;
                    callback1(parmsinfo);
                }
            }
        });
    }
    catch(e){
        alert("compostajax error: " + e.message);
    }
}
function comgetajax(parmsinfo) {
    try {
        var strurl = parmsinfo["url"];
        if (strurl.indexOf('?') == -1)
            strurl += "?" + Date.parse(new Date());
        else
            strurl += "&" + Date.parse(new Date());
        var callback1 = parmsinfo["callback1"];
        jQuery.ajax({
            type: "GET",
            url: strurl,
            dataType: 'json',
            success: function (msg) {
                if (typeof (callback1) != "undefined") {
                    parmsinfo["msg"] = msg;
                    callback1(parmsinfo);
                }
            }
        });
    }
    catch (e) {
        alert("comgetajax error: " + e.message);
    }
}
function ajaxmsgprompt(parmsinfo) {
    var oText = parmsinfo["msg"];
    if (typeof (oText) == "undefined")
        return true;
    if (typeof (oText["nRetCode"]) == "undefined") {
        if (typeof (oText["data"]) != "undefined") {
            oText = oText["data"];
        }
    }
    if (typeof (oText) == "string")//服务器器解析成JSON字符串后，在这里做个判断
        oText = JSON.parse(oText);
    parmsinfo["msg"] = oText;
    try {
        if (oText["nRetCode"] >= 0)
        {
            var callback2 = parmsinfo["callback2"];
            if (typeof (callback2) != "undefined")
                callback2(parmsinfo); //操作页回调
        }
        if (oText["nRetCode"] == 0) {
            return true;
        }
        if (oText["nRetCode"] == 1) {
            if (parent == null)
                location.href = oText["shtml"];
            else
                parent.location.href = oText["shtml"];
            return true;
        }
        else if (oText["nRetCode"] == 2) {
            f_alert(oText, parmsinfo);
            return false;
        }
    }
    catch (e) {
        alert("ajaxmsgprompt error: " + e.message);
    }
    return false;
}
function z_exitlogin(pexit)
{
    var parmsinfo = new Array();
    var data = {};
    data["nRetCode"] = 1;
    data["shtml"] = pexit;
    parmsinfo["msg"] = data;
    ajaxmsgprompt(parmsinfo);
}
function z_Refresh()
{
    location.replace(location);
}
function f_alert(tmpRet, parmsinfo) {
    try {
        var sRetText = tmpRet["sRetText"];
        var sTitle = tmpRet["sTitle"];
        var stype = tmpRet["stype"];
        var dialogid = parmsinfo["dialogid"];
        if (typeof(dialogid) == "undefined")
        {
            console.log("dialogid error.");
        }
        else
        {
            //第三方协同库
            //jQuery.ligerDialog.alert(sRetText, title, stype);
            if (parmsinfo["nowin"])
            {
                if (tmpRet["toggle"]) {
                    jQuery("#" + parmsinfo["ctrlid"]).modal("toggle");
                    dialog(stype, dialogid, sTitle, sRetText)
                }
                else { toasterror(sRetText, sTitle); }
            }
            else
            {
                dialog(stype, dialogid, sTitle, sRetText);
            }
        }
    }
    catch (e) {
        alert("f_alert error: " + e.message);
    }
}
function dialog(stype, dialogid, sTitle, sRetText)
{
    show_loading_bar({
        delay: .5,
        pct: 100,
        finish: function () {
            jQuery('#' + dialogid + ' .modal-header').html('<h4 class="modal-title">' + sTitle + '</h4>');
            jQuery('#' + dialogid + ' .modal-body').html(sRetText);
            if (stype != "") {
                jQuery('#' + dialogid + ' .modal-footer').
                    html(stype);
            }
            jQuery('#' + dialogid + '').modal('show', { backdrop: 'static' });
        }
    });
}
function toasterror(sRetText, sTitle)
{
    var opts = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-full-width",
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    toastr.error(sRetText, sTitle, opts);
}
function f_confirm(parmsinfo) {
    var sTitle = parmsinfo["sTitle"];
    var callback = parmsinfo["callback"];
    var param = parmsinfo["param"];
    //第三方协同库
    //jQuery.ligerDialog.confirm(sTitle, function (yes) {
    //    if (typeof (callback) != "undefined")
    //        callback(yes, param);
    //});
}
function f_openwin(id, url, p1)
{
    jQuery('#' + id).html("<form id='hiddenlink' action='" + url + "' target='_blank'><input type='hidden' name='token' value='" + p1 + "'></form>");
    var s = jQuery("#hiddenlink");
    s.submit();
}
function zyGetCtrlText(parmsinfo)
{
    var ctrlid = parmsinfo["ctrlid"];
    var data = {};
    var arrctrlid = ctrlid.split("|");
    if (arrctrlid.length == 1) {
        jQuery("#" + arrctrlid[0] + " input,select,textarea").each(function () {
            var name = jQuery(this).attr("name");
            var title = jQuery(this).attr("title");
            if (name/* && name.indexOf('ligerui') == -1*/) {
                if (name.indexOf('upfilecontrol') == -1) {
                    data[name] = this.value;
                }
            }
        });
    }
    else {
        for (var i = 0; i < arrctrlid.length; i++) {
            var subdata = {};
            jQuery("#" + arrctrlid[i] + " input,select,textarea").each(function () {
                var name = jQuery(this).attr("name");
                var title = jQuery(this).attr("title");
                if (name/* && name.indexOf('ligerui') == -1*/) {
                    if (name.indexOf('upfilecontrol') == -1) {
                        subdata[name] = this.value;
                    }
                }
            });
            data[arrctrlid[i]] = subdata;
        }
    }
    //alert(JSON.stringify(data));
    return data;
}
function zySubmitData(parmsinfo) {
    var data = zyGetCtrlText(parmsinfo);
    //alert(JSON.stringify(data));
    parmsinfo["postdata"] = data;
    parmsinfo["callback1"] = ajaxmsgprompt;
    compostajax(parmsinfo);
}
function zyps(parmsinfo)
{
    parmsinfo["callback1"] = ajaxmsgprompt;
    comgetajax(parmsinfo);
}
function clone3(obj) {
    function Clone() { }
    Clone.prototype = obj;
    var o = new Clone();
    for (var a in o) {
        if (typeof o[a] == "object") {
            o[a] = clone3(o[a]);
        }
    }
    return o;
}
function getQueryString1(strurl, name1) {
    var name, value;
    var str = strurl;
    var num = str.indexOf("?")
    str = str.substr(num + 1);
    var arr = str.split("&");
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            if (name == name1)
                return value;
        }
    }
    return null;
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function getableidIndex(ctrlid, filedidvalue)
{
    var nIndex;
    var trList = jQuery("#" + ctrlid).find("tr");
    for (nIndex = 1; nIndex < trList.length; nIndex++) {
        var tdArr = trList.eq(nIndex).find("td input");
        if (tdArr.val() == filedidvalue)
            break;
    }
    return nIndex;
}
function getableRowIndex(ctrlid,filedidvalue)
{
    var nIndex;
    var trList = jQuery("#" + ctrlid).find("tr");
    for (nIndex = 1; nIndex < trList.length; nIndex++) {
        var tdArr = trList.eq(nIndex).find("td input");
        if (tdArr.val() == filedidvalue)
            break;
    }
    return jQuery("#" + ctrlid + " tr").eq(nIndex);
}
function StringBuffer() {
    this.__strings__ = new Array;
}
StringBuffer.prototype.append = function (str) {
    this.__strings__.push(str);
};
StringBuffer.prototype.clear = function (str) {
    this.__strings__.length = 0;
};
StringBuffer.prototype.toString = function () {
    return this.__strings__.join("");
};