
$(function () {

    LoadAllCompany();


    $("#companyForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#companyForm").parsley().on("form:success", function (formInstance) {
        InsertCompany();
    });
})

function LoadAllCompany() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Company/LoadAllCompany",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {
                var obj = {

                    'Name': item.Company,
                    'Status': status,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadSelectedCompany(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-1" onclick="DeleteCompany(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>' 
                }

                data.push(obj);
            });


            $('#company-table').DataTable({
                destroy: true,
                data: data,
                columns: [

                    { data: 'Name' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-left', targets: [0] },
                    { orderable: false, targets: [-1] }
                ]
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {
                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });

}



function LoadSelectedCompany(ID) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Company/LoadSelectedCompany?ID=" + ID,
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#ID").val(results.data[0].ID);
            $("#txtCompany").val(results.data[0].Company);
            $("#company-modal").modal('show');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {

                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function DeleteCompany(ID) {
    var dbModel = { 'ID': ID }
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: Once deleted can't be undo!",
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
                url: "/Company/DeleteCompany",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    LoadAllCompany();
                    Swal.fire(
                        'Deleted!',
                        'Company been deleted.',
                        'success'
                    );
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 403) {
                        var response = $.parseJSON(jqXHR.responseText);
                        Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
                    } else {

                        toastr.error('Something went wrong!', 'Error!');
                    }
                }
            });

        }
    })


}


function InsertCompany() {
    var ID = $("#ID").val();
    var Company = $("#txtCompany").val();
    var dbModel = { 'ID': ID, 'Company': Company, }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Company/InsertCompany",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Data has been saved',
                'success'
            );
            clearCompanyForm();
            $("#company-modal").modal('hide');
            LoadAllCompany();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 403) {
                var response = $.parseJSON(jqXHR.responseText);
                Swal.fire('Permission denied!', 'You have no access to this action.', 'error');
            } else {

                toastr.error('Something went wrong!', 'Error!');
            }
        }
    });
}

function clearCompanyForm() {
    $("#ID").val("");
    $("#txtCompany").val("");
}



