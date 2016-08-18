/*
最简洁的html5文件上传插件 
20150616 gooddeng 采用jquery form
20160725 gooddeng 进一步简化,去掉jquery form，直接ajax，直接input.click

20160809 gooddeng 分离出webuploader方法，使调用方便，直接用函数实现，上传的元素上onclick=webuploader(this,{option});
*/
$.fn.webuploader = function (moption) {
    $(this).each(function () {
        var self = $(this);

        //触发选择文件
        self.click(function () {
            webuploader(this, moption)
        });
    });
};

function webuploader(el, moption) {
    var option = $.extend({
        url: '/manager/UploadImg.ashx?method=upload',
        acceptFiles: '*',
        filesize: 5,
        getParams: function () { return {}; },
        beforeSend: function (a, b, c) { },
        success: function (res) { }
    }, moption);


    var self = $(el);

    var fileInput = $("<input type='file'/>");
    fileInput.attr('accept', option.acceptFiles);

    //选择文件后即提交
    fileInput.change(function (evt) {
        var fileName = fileInput.val();

        var accepts = fileInput.attr('accept').toLowerCase();
        var ext = fileName.split('.').pop().toLowerCase();
        if (accepts != '*' && accepts.indexOf(ext) === -1) {
            jAlert('不允许此类型文件上传。');
            return;
        }

        if (this.files[0].size > option.filesize * 1024 * 1024) {
            jAlert('文件大小超过,限制:' + option.filesize + 'M');
            return;
        }

        //20160721 不再使用jQuery Form Plugin 直接html5 ajax式上传实现
        var formData = new FormData();
        /*添加参数*/
        var ParamData = option.getParams.call(self);
        for (var name in ParamData) {
            formData.append(name, ParamData[name]);
        }
        formData.append('file', this.files[0]);
        //submit
        $.ajax({
            url: option.url, type: 'POST', dataType: 'text', cache: false,
            data: formData,
            processData: false, contentType: false,
            beforeSend: function (x) {
                option.beforeSend.call(self, x);
            },
            success: function (response) {
                option.success.call(self, response);
            },
            error: function (t, r) {
                jAlert(r);
            }
        })
    }).click();

};