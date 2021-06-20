


$(function () {

    LoadAllUserGroup();


    $("#userGroupForm").parsley().on("field:validated", function () { var e = 0 === $(".parsley-error").length; $(".alert-info").toggleClass("d-none", !e), $(".alert-warning").toggleClass("d-none", e) }).on("form:submit", function () { return !1 });

    $("#userGroupForm").parsley().on("form:success", function (formInstance) {
        InsertUserGroup();
    });

    $(document).delegate('.paginate_button a', 'click', function (e) {
        e.preventDefault();
        var elems = Array.prototype.slice.call($('.switchery').not('[data-switchery="true"]'));
        elems.forEach(function (html) {
            html.onchange = function () {
                ChangeGroupStatus(html.defaultValue, html.checked);
            };
            new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor: '#6c757d' });
        });
    });
})

function LoadAllUserGroup() {

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserGroup/LoadAllUserGroup",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {

            var data = [];

            $.each(results.data, function (i, item) {
                var status = item.isActive == true ? "<input type='checkbox' checked value='" + item.ID + "' class='switchery'/>" : "<input type='checkbox' value='" + item.ID +"'' class='switchery'/>";

                var obj = {

                    'Title': item.Title,
                    'Status': status,
                    'Actions': '<a href="javascript: void(0);" class="" onclick="LoadEditData(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-square-edit-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-1" onclick="DeleteUserGroup(' + item.ID + ')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-delete-outline"></i></a>' +
                        '<a href="javascript: void(0);" class="ml-1" onclick="SelectUserGroup(' + item.isActive + ',' + item.ID + ',\'' + item.Title + '\')" style="color:#8093B9;font-size:20px;"><i class="mdi mdi-account-arrow-right-outline"></i></a>'
                }

                data.push(obj);
            });


            $('#userGroup-table').DataTable({
                destroy: true,
                data: data,
                columns: [

                    { data: 'Title' },
                    { data: 'Status' },
                    { data: 'Actions' }
                ],
                columnDefs: [
                    { className: 'text-left', targets: [0] },
                    { className: 'text-center', targets: [1, 2] },
                    { orderable: false, targets: [-1,-2] }
                ]
            });

            var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'), changeField = document.querySelector('.switchery-field'));
            elems.forEach(function (html) {
                html.onchange = function () {
                    ChangeGroupStatus(html.defaultValue,html.checked);
                };
                new Switchery(html, { color: '#4fc6e1', jackColor: '#1abc9c', size: 'small', secondaryColor: '#bac0c4', jackSecondaryColor:'#6c757d' });
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

function ChangeGroupStatus(ID, isActive) {
    var dbModel = { 'ID': ID, 'isActive': isActive };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserGroup/InsertUserGroup",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            toastr.success('Status has been changed!', 'Success!');
            LoadAllUserGroup();

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


function LoadEditData(ID) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/UserGroup/LoadSelectedUserGroup?ID=" + ID,
        data: {},
        async: false,
        dataType: "json",
        success: function (results) {
            $("#ID").val(results.data[0].ID);
            $("#title").val(results.data[0].Title);
            var val = results.data[0].isActive == true ? 1 : 0;
            $('input[name="statusRadio"][value="' + val + '"]').prop('checked', true);
            $("#userGroup-modal").modal('show');
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

function DeleteUserGroup(ID) {
    var dbModel = { 'ID': ID }
    Swal.fire({
        title: 'Are you sure?',
        text: "Note: All user under this group will be inActive!",
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
                url: "/UserGroup/DeleteUserGroup",
                data: JSON.stringify(dbModel),
                async: false,
                dataType: "json",
                success: function (results) {
                    LoadAllUserGroup();
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
function SelectUserGroup(isActive, ID, Title) {
    if (isActive) {
        $("#checkboxAll").prop("checked", false);
        $("#selectedGroup").text(Title);
        $("#selectedGroupID").val(ID);
        LoadAllMenus(ID);
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You cannot assign permission on an InActive Group! Make it Active first.'
        })
    }

}

function InsertUserGroup() {
    var ID = $("#ID").val();
    var Title = $("#title").val();
    var isActive = parseInt($("input[name='statusRadio']:checked").val());
    var dbModel = { 'ID': ID, 'Title': Title, 'isActive': isActive }

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserGroup/InsertUserGroup",
        data: JSON.stringify(dbModel),
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Saved!',
                'Group data has been saved',
                'success'
            );
            clearUserGroupForm();
            $("#userGroup-modal").modal('hide');
            LoadAllUserGroup();

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

function clearUserGroupForm() {
    $("#ID").val("");
    $("#title").val("");
    $('input[name="statusRadio"][value="1"]').prop('checked', true);
}



function LoadAllMenus(ID) {
    var dbModel = { 'ID': ID };
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/UserGroup/LoadAllMenus",
        data: JSON.stringify(dbModel),
        async: false,
        dataType: "json",
        success: function (results) {

            $("#userGroupPermission-modal").modal("show");
            var data = [];

            $.each(results.data, function (i, item) {

                var act = item.IsExist == true ? '<div class="checkbox checkbox-success mb-2"><input id="checkbox' + item.ID + '" type="checkbox" onClick="CheckSingleMenu(' + item.ID + ')" checked=""><label for="checkbox' + item.ID + '"></label></div>' : '<div class="checkbox checkbox-success mb-2"><input id="checkbox' + item.ID + '" type="checkbox" onClick="CheckSingleMenu(' + item.ID + ')"><label for="checkbox' + item.ID + '"></label></div>';
                var obj = {
                    'ID': '<span class="hidden">' + item.ID + '</span>',
                    'Title': item.MenuTitle,
                    'Group': item.ParentTitle,
                    'Actions': act,
                }

                data.push(obj);
            });


            setTimeout(function () {
                $('#menu-table').DataTable({
                    destroy: true,
                    sort: false,
                    data: data,
                    columns: [
                        { data: 'ID' },
                        { data: 'Title' },
                        { data: 'Group' },
                        { data: 'Actions' }
                    ],
                    "scrollY": "450px",
                    "paging": false,
                    order: [[2, 'asc']],

                    "drawCallback": function (settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;

                        api.column(2, { page: 'current' }).data().each(function (group, i) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="group"><td colspan="5">' + group + '</td></tr>'
                                );

                                last = group;
                            }
                        });
                    }
                });

            }, 300);


        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error('Something went wrong!', 'Error!');
        }
    });

}

function CheckAllMenu() {
    var menuIDs = [];
    if ($("#checkboxAll").prop("checked") == true) {
        $("#menu-table tr").each(function () {
            if (isNaN(parseInt($(this).find("td").eq(0).text())) == false) {
                menuIDs.push($(this).find("td").eq(0).text());
                var ChkBox = '#checkbox' + $(this).find("td").eq(0).text();
                $(ChkBox).prop("checked", true);
            }
        });
        InsertGroupPermission(menuIDs, 1);
    } else {
        $("#menu-table tr").each(function () {
            if (isNaN(parseInt($(this).find("td").eq(0).text())) == false) {
                menuIDs.push($(this).find("td").eq(0).text());
                var ChkBox = '#checkbox' + $(this).find("td").eq(0).text();
                $(ChkBox).prop("checked", false);
            }
        });
        InsertGroupPermission(menuIDs, 0);
    }
}

function CheckSingleMenu(ID) {
    var chk = "#checkbox" + ID;
    var menuIDs = [];

    if ($(chk).prop("checked") == true) {

        $(chk).prop("checked", true);

        $("#menu-table tr").each(function () {
            if (isNaN(parseInt($(this).find("td").eq(0).text())) == false) {
                var chk2 = "#checkbox" + $(this).find("td").eq(0).text();
                if ($(chk2).prop("checked") == true) {
                    menuIDs.push($(this).find("td").eq(0).text());
                }
            }
        });
        InsertGroupPermission(menuIDs, 1);
    } else {

        $(chk).prop("checked", false);

        $("#menu-table tr").each(function () {
            if (isNaN(parseInt($(this).find("td").eq(0).text())) == false) {
                var chk2 = "#checkbox" + $(this).find("td").eq(0).text();
                if ($(chk2).prop("checked") == true) {
                    menuIDs.push($(this).find("td").eq(0).text());
                }
            }
        });
        InsertGroupPermission(menuIDs, 3);
    }
}

function InsertGroupPermission(menuIDS, isChecked) {
    var ID = $("#selectedGroupID").val();
    var dbModel = { 'ID': ID, 'menuIDs': menuIDS.join(), 'isChecked': isChecked }

    if (ID > 0) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "/UserGroup/InsertGroupPermission",
            data: JSON.stringify(dbModel),
            async: true,
            dataType: "json",
            success: function (results) {
                if (isChecked == 1)
                    toastr.success('Permission added!', 'Success!');
                else if (isChecked == 0 || isChecked == 3)
                    toastr.success('Permission revoked!', 'Success!');
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
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a user group first.'
        })
    }


}


