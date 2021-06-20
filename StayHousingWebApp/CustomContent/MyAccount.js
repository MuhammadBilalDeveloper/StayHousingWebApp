$(function () {
    $('.dropify').dropify({
        messages: {
            'default': 'Click or drag and drop a image file here',
            'replace': 'Click or drag and drop image file here to replace',
            'remove': 'Remove',
            'error': 'Ooops, something wrong happended.'
        }
    });

    $("#userBasicInfoForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#userBasicInfoForm").parsley().on("form:success", function (formInstance) {
        UpdateBasicInformation();
    });

    $("#userChangePassForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#userChangePassForm").parsley().on("form:success", function (formInstance) {
        UpdatePassword();
    });

    $("#userProfilePicUpdateForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#userProfilePicUpdateForm").parsley().on("form:success", function (formInstance) {
        UpdateProfilePic();
    });

    GetUserBasicInformation();

    
})

function GetUserBasicInformation() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/GetUserBasicInformation",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            if (results.data != null) {
                $.each(results.data, function (i, item) {

                    $("#FirstName").val(item.FirstName);
                    $("#MiddleName").val(item.MiddleName);
                    $("#Surname").val(item.SurName);
                    $("#Email").val(item.Email);
                    $("#Phone").val(item.Phone);
                    $("#OldPassword").val(item.Password); 
                    $("#topLeftImage").prop("src", item.ImagePath);
                    $("#topRightImage").prop("src", item.ImagePath);
                    $("#bigCardImage").prop("src", item.ImagePath);
                    $("#textFullName").text(item.FirstName+" "+item.MiddleName+" "+item.SurName);
                    $("#topLeftFullName").text(item.FirstName+" "+item.MiddleName+" "+item.SurName);
                    $("#topRightFullName").text(item.FirstName+" "+item.MiddleName+" "+item.SurName);

                    $("#DOB").flatpickr(
                        {
                            altInput: false,allowInput: true,
                            altFormat: "F j, Y",
                            dateFormat: "Y-m-d",
                            defaultDate: HumanToOriginal(item.DOB),
                        }
                    );

                    $("#PreviousImage").val(item.ImagePath);
                    UpdateDropifyImg(item.ImagePath);

                })
            } else {
                toastr.warning('Data not found!', 'Error!');
            }

            


        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });
}

function HumanToOriginal(dt) {
    var db = dt.split(" ");
    var month = "";
    if (db[1] == "Jan")
        month = "01";
    else if (db[1] == "Feb")
        month = "02";
    else if (db[1] == "Mar")
        month = "03";
    else if (db[1] == "Apr")
        month = "04";
    else if (db[1] == "May")
        month = "05";
    else if (db[1] == "Jun")
        month = "06";
    else if (db[1] == "Jul")
        month = "07";
    else if (db[1] == "Aug")
        month = "08";
    else if (db[1] == "Sep")
        month = "09";
    else if (db[1] == "Oct")
        month = "10";
    else if (db[1] == "Nov")
        month = "11";
    else if (db[1] == "Dec")
        month = "12";

    return db[2] + '-' + month + '-' + db[0];
}

function UpdateDropifyImg(imagenUrl) {

    var drEvent = $('#ProfilePic').dropify(
        {
            defaultFile: imagenUrl
        });
    drEvent = drEvent.data('dropify');
    drEvent.resetPreview();
    drEvent.clearElement();
    drEvent.settings.defaultFile = imagenUrl;
    drEvent.destroy();
    drEvent.init();
}

function UpdateBasicInformation() {

    var formData = new FormData();
    formData.append('FirstName', $("#FirstName").val());
    formData.append('MiddleName', $("#MiddleName").val());
    formData.append('Surname', $("#Surname").val());
    formData.append('Email', $("#Email").val());
    formData.append('Phone', $("#Phone").val());
    formData.append('DOB', $("#DOB").val());

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/UpdateBasicInformation",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (results) {
            Swal.fire(
                'Saved!',
                'User data has been saved',
                'success'
            );
            GetUserBasicInformation();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function UpdatePassword() {
  
    var formData = new FormData();
    formData.append('Password', $("#Password").val());

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/UpdateBasicInformation",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (results) {
            Swal.fire(
                'Saved!',
                'User data has been saved',
                'success'
            );
            GetUserBasicInformation();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function UpdateProfilePic() {
   
    var formData = new FormData();
    formData.append('PreviousImage', $("#PreviousImage").val());
    formData.append('image', $('#ProfilePic')[0].files[0]); 

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/UpdateBasicInformation",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (results) {
            Swal.fire(
                'Saved!',
                'User data has been saved',
                'success'
            );
            GetUserBasicInformation();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}