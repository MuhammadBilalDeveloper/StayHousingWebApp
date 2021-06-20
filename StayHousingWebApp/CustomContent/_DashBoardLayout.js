$(function () {
  
    $("#dash-daterange").flatpickr(
        {
            altInput: false,allowInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            defaultDate: "today",
        }
    );
    GetUserBasicInformation();
});

function logout() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Login/LogOutUser",
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            window.location.href = "/Login/Index";
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Swal.fire(
                'Success!',
                'Something went wrong!',
                'error'
            );
        }
    });
}

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

                    $("#topLeftImage").prop("src", item.ImagePath);
                    $("#topRightImage").prop("src", item.ImagePath);
                    $("#topLeftFullName").text(item.FirstName + " " + item.MiddleName + " " + item.SurName);
                    $("#topRightFullName").text(item.FirstName + " " + item.MiddleName + " " + item.SurName);
                    
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

