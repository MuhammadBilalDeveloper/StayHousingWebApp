$(function () {
    $("#DOB").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-1990",
        }
    );
    $("#HStartDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-2020",
        }
    );
    $('.dropify').dropify({
        messages: {
            'default': 'Click or drag and drop a image file here',
            'replace': 'Click or drag and drop image file here to replace',
            'remove': 'Remove',
            'error': 'Ooops, something wrong happended.'
        }
    });

    $('#UserGroupSelect').select2({
        placeholder: "Select"
    });

    $('#CompanySelect').select2({
        placeholder: "Select"
    });
    $('#ContractType').select2({
        placeholder: "Select"
    });

    $("[data-password]").on('click', function () {
        if ($(this).attr('data-password') == "false") {
            $(this).siblings("input").attr("type", "text");
            $(this).attr('data-password', 'true');
            $(this).addClass("show-password");
        } else {
            $(this).siblings("input").attr("type", "password");
            $(this).attr('data-password', 'false');
            $(this).removeClass("show-password");
        }
    });
   
    $(document).delegate('#AddUserBtn', 'click', function (e) {
        e.preventDefault();
        userAccountFormClear();
    });

    $("#userAccountForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#userAccountForm").parsley().on("form:success", function (formInstance) {
        InsertUserAccount();
    });

    $(document).delegate('.paginate_button a', 'click', function (e) {
        e.preventDefault();
        var elems = Array.prototype.slice.call($('.switchery').not('[data-switchery="true"]'));
        elems.forEach(function (html) {
            html.onchange = function () {
                ChangeAccountStatus(html.defaultValue, html.checked);
            };
            new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor: '#6c757d' });
        });
    });
    
    LoadAllUserAccount();
    LoadAllUserGroup(); 

    
})


function LoadAllUserAccount() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/LoadAllUserAccount",
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {
                var status = item.IsActive == true ? "<div class='tdDiv'><input type='checkbox' checked value='" + item.ID + "' class='switchery'/></div>" : "<div class='tdDiv'><input type='checkbox' value='" + item.ID + "'' class='switchery'/></div>";
                var profilePic = item.ImagePath == "" ? "<img src='/Content/Images/avater.jpg' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>" :"<img src='" + item.ImagePath + "' alt='table-user' class='mr-2 rounded-circle' style='height:40px;width:40px;'>";
                var FullName = item.FirstName + ' ' + item.MiddleName + ' ' + item.SurName;
                var FullNameAndImage = "<div class='tdDiv'>"+ profilePic + "<span>" + FullName + "</span></div>";
                var obj = {
                    'FullName': FullNameAndImage,
                    'Email': "<div class='tdDiv'>" + item.Email +"</div>",
                    'Phone': "<div class='tdDiv'>" + item.Phone + "</div>",
                    'Gender': "<div class='tdDiv'>" + item.Gender + "</div>",
                    'GroupTitle': "<div class='tdDiv'>" + item.GroupTitle + "</div>",
                    'Company': item.CompanyName,
                    'Status': status,
                    'Actions': '<div class="tdDiv"><a href="javascript: void(0);" class="" onclick="LoadSelectedUserAccount(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-1" onclick="DeleteUserAccount(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a></div>',
                }

                data.push(obj);
            });


            $('#userAccount-table').DataTable({
                destroy: true,
                data: data,
                columns: [
                    { data: 'FullName' },
                    { data: 'Email' },
                    { data: 'Phone' },
                    { data: 'Gender' },
                    { data: 'GroupTitle' },
                    { data: 'Company' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    //{ className: 'text-center', targets: [6,7] },
                    { orderable: false, targets: [-1, -2] }
                ]
            });

            var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'), changeField = document.querySelector('.switchery-field'));
            elems.forEach(function (html) {
                html.onchange = function () {
                    ChangeAccountStatus(html.defaultValue, html.checked);
                };
                new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor: '#6c757d' });
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });

}

function ChangeAccountStatus(ID,IsActive) {
    var formData = new FormData();
    formData.append('ID', ID);
    formData.append('IsActive', IsActive);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/InsertUserAccount",
        data: formData,
        async: true,
        processData: false,
        contentType: false,
        success: function (results) {
            toastr.success('Status has been changed!', 'Success!');
            LoadAllUserAccount();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}


function LoadAllUserGroup() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/LoadAllUserGroup",
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#UserGroupSelect").empty();
            $("#UserGroupSelect").append($("<option></option>"));
            $.each(results.data, function (i, item) {
                $("#UserGroupSelect").append($("<option></option>").val(item.ID).html(item.Title));
            });

            $("#CompanySelect").empty();
            $("#CompanySelect").append($("<option></option>"));
            $.each(results.data[0].CompanyModelList, function (i, item) {
                $("#CompanySelect").append($("<option></option>").val(item.ID).html(item.Company));
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function InsertUserAccount() {
    
    var formData = new FormData();
    formData.append('ID', $("#ID").val());
    formData.append('FirstName', $("#FirstName").val());
    formData.append('MiddleName', $("#MiddleName").val());
    formData.append('Surname', $("#Surname").val());
    formData.append('Email', $("#Email").val());
    formData.append('Password', $("#Password").val());
    formData.append('Phone', $("#Phone").val());
    formData.append('DOB', FlatPickerDateToSQLDate($("#DOB").val()));
    formData.append('GroupID', $("#UserGroupSelect").val());
    formData.append('Gender', $("input[name='GenderRadio']:checked").val());
    formData.append('IsActive', parseInt($("input[name='StatusRadio']:checked").val())==1?true:false);
    formData.append('PreviousImage', $("#PreviousImage").val());
    formData.append('Company', $("#CompanySelect").val());
    formData.append('HolidayStartDate', $("#HStartDate").val());
    formData.append('HolidayEntitlement', $("#HolidayEntitlement").val());
    formData.append('HoursWorked', $("#HoursWorked").val());
    formData.append('Daysworked', $("#Daysworked").val());
    formData.append('ContractType', $("#ContractType").val());
    // Attach file
    formData.append('image', $('#ProfilePic')[0].files[0]); 

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/InsertUserAccount",
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
            userAccountFormClear();
            LoadAllUserAccount();
            $("#userAccount-modal").modal("hide");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });

}

function LoadSelectedUserAccount(ID) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserAccount/LoadSelectedUserAccount?ID=" + ID,
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            $.each(results.data, function (i, item) {

                $("#ID").val(item.ID);
                $("#FirstName").val(item.FirstName);
                $("#MiddleName").val(item.MiddleName);
                $("#Surname").val(item.SurName);
                $("#Password").val(item.Password);
                $("#Email").val(item.Email);
                $("#Phone").val(item.Phone);

                $("#HolidayEntitlement").val(item.HolidayEntitlement);
                $("#HoursWorked").val(item.HoursWorked);
                $("#Daysworked").val(item.Daysworked);

                $("#DOB").flatpickr(
                    {
                        altInput: false,allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.DOB),
                    }
                );
                $("#HStartDate").flatpickr(
                    {
                        altInput: false, allowInput: true,
                        altFormat: "F j, Y",
                        dateFormat: "d-m-Y",
                        defaultDate: HumanToOriginal(item.HolidayStartDate),
                    }
                );

                $("#UserGroupSelect").val(item.GroupID).trigger("change");
                $("#CompanySelect").val(item.Company).trigger("change");

                $("#ContractType").val(item.ContractType).trigger("change");

                $('input[name="GenderRadio"][value="' + item.Gender + '"]').prop('checked', true);
                var val = results.data[0].IsActive == true ? 1 : 0;
                $('input[name="StatusRadio"][value="' + val + '"]').prop('checked', true);
                $("#PreviousImage").val(item.ImagePath);
                UpdateDropifyImg(item.ImagePath);

            })

            $("#userAccount-modal").modal("show");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.','error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
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

    return db[0] + '-' + month + '-' + db[2];
}
function FlatPickerDateToSQLDate(dt) {
    if (dt == "" || dt == null) {
        return "";
    } else {
        var db = dt.split("-");
        return db[2] + '-' + db[1] + '-' + db[0];
    }
}

function userAccountFormClear(){

    $("#ID").val("");
    $("#FirstName").val("");
    $("#MiddleName").val("");
    $("#Surname").val("");
    $("#Password").val("");
    $("#Email").val("");
    $("#Phone").val("");
    $("#HolidayEntitlement").val("");
    $("#HoursWorked").val("");
    $("#Daysworked").val("");
    $("#DOB").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-1990",
        }
    );
    $("#HStartDate").flatpickr(
        {
            altInput: false, allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "d-m-Y",
            defaultDate: "01-01-2020",
        }
    );
    $("#UserGroupSelect").val("").trigger("change");
    $("#CompanySelect").val("").trigger("change");
    $("#ContractType").val("").trigger("change");
    $('input[name="GenderRadio"][value="Male"]').prop('checked', true);
    $('input[name="StatusRadio"][value="1"]').prop('checked', true);
    $("#PreviousImage").val("");
    UpdateDropifyImg("");
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

function DeleteUserAccount(ID) {
    var dbModel = { 'ID': ID }
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: You cannot revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',

    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                url: "/UserAccount/DeleteUserAccount",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    LoadAllUserAccount();
                    Swal.fire(
                        'Deleted!',
                        'Group has been deleted.',
                        'success'
                    );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 403) {
                        var response = $.parseJSON(jqXHR.responseText);
                        Swal.fire('Permission denied!', 'You have no access to this action.','error');
                    } else {
                        toastr.error('Something went wrong!', 'Error!');
                    }
                }
            });

        }
    })


}