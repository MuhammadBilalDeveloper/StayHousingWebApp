$(function () {
    $(document).delegate('#DatabaseBackupBTN', 'click', function (e) {
        e.preventDefault();
        InsertDBBackup();
    });
    $(document).delegate('#FileStorageBackupBTN', 'click', function (e) {
        e.preventDefault();
        InsertFileBackup();
    });
    LoadLatestBDBak();
    LoadFileBackUp();
})

function InsertDBBackup() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Dashboard/InsertDBBackup",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Done!',
                'Backup has been taken successfully.<br> Please download backup file and keep it safe.',
                'success'
            );         
            LoadLatestBDBak();
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

function LoadLatestBDBak() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Dashboard/LoadLatestBDBak",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {
            var htm = ""
            $.each(results.data, function (i, item) {
                htm += "<tr>" +
                    "<td>" + item.BackupDate + "</td>" +
                    "<td>" + item.BackupTakenBy + "</td>" +
                    "<td><a href='#' class='btn btn-sm btn-danger' onclick='DBBackupDownload(\""+item.FilePath+"\");'>Download <i class='mdi mdi-download mr-2 vertical-middle '></i></a></td>" +
                    "</tr>";
            });
            $("#dbBakTable tbody").html(htm);
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

function DBBackupDownload(filename) {
    window.open("/Dashboard/DBBackupDownload?filename=" + filename);
}

function InsertFileBackup() {
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "/Dashboard/InsertFileBackup",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {
            Swal.fire(
                'Done!',
                'Backup has been taken successfully.<br> Please download backup file and keep it safe.',
                'success'
            );
            LoadFileBackUp();
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

function LoadFileBackUp() {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "/Dashboard/LoadFileBackUp",
        data: {},
        async: true,
        dataType: "json",
        success: function (results) {
            var htm = ""
            $.each(results.data, function (i, item) {
                htm += "<tr>" +
                    "<td>" + item.BackupDate + "</td>" +
                    "<td>" + item.BackupTakenBy + "</td>" +
                    "<td><a href='#' class='btn btn-sm btn-danger' onclick='FileBackupDownload();'>Download <i class='mdi mdi-download mr-2 vertical-middle '></i></a></td>" +
                    "</tr>";
            });
            $("#fileBakTable tbody").html(htm);
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

function FileBackupDownload() {
    window.open("/Dashboard/FileStorageDownload");
}