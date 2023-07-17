var apiUrl = document.getElementById("apiurl").value;
var webUrl = document.getElementById("webUrl").value;

//Session variable
var username;
var rolename; 
var employeeId;
var email;
var token;

//Udpated ID
var UpdateEmployeeID;

//Page Load Event
$(document).ready(function () {
    GetSession();
    $('#LoginUser').html(username);
    $('#email').html(email);
    getForm();
    getRole();
    getAction();
    getTable();
    $('#error_message').html('');

});

//Get Session
function GetSession() {
    $.ajax({
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        url: webUrl +'Accounts/Session',
        success: function (result) {
            username = result.userName;
            rolename = result.roleName;
            employeeId = result.employeeId;
            email = result.email;
            token = result.token;
          },
        error: function (error) {
            console.log(error);
        },
        cache: false,
        async: false,
    });
}

//Fill DropDown Form
function getForm() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Form/GetFormByActive?action=GetFormByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        success: onSuccessGetForm,
        error: function (error) {
            console.log(error.responseText);

        },
        
    });
  
}
function onSuccessGetForm(data, status) {

    $('#form').empty();
    $("#form").append("<option value='" + 0 + "'>--Select Form--</option>").show();
    $.each(data.data, function (i, item) {
        $("#form").append("<option value='" + item.FormID + "'>" + item.FormName + "</option>").show();
    });
}

//Fill DropDown Role
function getRole() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Roles/GetTableData?action=gettabledata',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetRole,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetRole(data, status) {


    $('#role').empty();
    $("#role").append("<option value='" + 0 + "'>--Select Role--</option>").show();
    $.each(data.data, function (i, item) {
        $("#role").append("<option value='" + item.RoleID + "'>" + item.RoleName + "</option>").show();
    });
   /* console.log(data);*/



}

//Fill DropDown Action
function getAction() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Action/GetActionByActive?action=GetActionByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetAction,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetAction(data, status) {


    $('#action').empty();
    $.each(data.data, function (i, item) {
        $("#action").append("<option value='" + item.ActionID + "'>" + item.ActionName + "</option>").show();
    });
    /* console.log(data);*/



}

//Get Table 
function getTable()
{
    $('#tblFormToRole').DataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'AssignFormToRole/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {

        },
        "columns": [
            { "data": "RoleName", "autoWidth": true },
            { "data": "FormName", "autoWidth": true },
            { "data": "ActionName", "autoWidth": true },
           
            
            {
                "data": 'ID', "weight": "50px" , "render": function (data) {
                    return '<button type="button" id="' + data + '" class="btn btn-primary btnEdit"><i class="material-icons">edit</i></button> <button type="button" id="' + data + '" class="btn btn-danger btnDelete"><i class="material-icons">delete</i></button>'
                    
                }
                
            }

        ]
    });
}

//OnClick Edit Button
$(document).on("click", ".btnEdit", function () {
    $("#btnSave").hide();
    $("#btnUpdate").show();
    $("#divInput").show();

    UpdateEmployeeID = $(this).attr("id");
 
    var currentRow = $(this).closest("tr");
    var col1 = currentRow.find("td:eq(0)").text();
    var col2 = currentRow.find("td:eq(1)").text();
    var col3 = currentRow.find("td:eq(2)").text();

    $('#form').val(col1);
    $('#role').val(col2);
    $('#action').val(col3);

});

//OnClick Delete Button
$(document).on("click", ".btnDelete", function () {
    /*alert("Are You Sure Deleted");*/
    UpdateEmployeeID = $(this).attr("id");
    Swal.fire({
        title: 'Are you sure?',
        text: "Filter will be deleted permanently!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: "#61affe",
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#dc3545',
        reverseButtons: true
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                type: "DELETE",
                url: apiUrl + 'AssignFormToRole/DeleteAssignFormToRole?action=delete&id=' + UpdateEmployeeID,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    const element = document.getElementById(UpdateEmployeeID);
                    element.remove();
                    getTableEmployee();
                },
                error: function (error) {
                    console.log(error);

                },
                cache: false,
            });
        }
    })

});

//All Input Clear
function clear() {

    getForm();
    getRole();
    getAction();
    $("#btnSave").show();
    $("#btnUpdate").hide();
}

//Click Clear Button
$('#btnClear').on('click', function () {
    clear();

});

//Click Insert Button
$('#btnSave').on('click', function () {

    debugger;
    var FormName = $('#form').val();
    var RoleName = $('#role').val();
    var Action = $('#action').val();
    var EmployeeId = employeeId;

    if (FormName == "") {
        $('#form').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#form').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action:'insert',
        formID: FormName,
        roleID: RoleName,
        actionID: Action,
        CreatedBy: EmployeeId
    };

    $.ajax({
        type: "POST",
        url: apiUrl + 'AssignFormToRole/InsertAssignFormToRole',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.status == true) {
                let timerInterval
                Swal.fire({
                    icon: 'success',
                    type: 'success',
                    title: 'Record Saved',
                    timer: 5000,
                    confirmButtonColor: "#61affe",
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    clear();
                    getTableEmployee();
                    $("#divInput").hide();

                })
             
            }
            else {
                alert(result.message);
            }

        },
        error: function (error) {
            console.log(error.response);


        }
    });

});

//Click Update Button
$('#btnUpdate').on('click', function () {

    debugger;
    var FormName = $('#form').val();
    var RoleName = $('#role').val();
    var Action = $('#action').val();
    var EmployeeId = employeeId;

    if (FormName == "") {
        $('#form').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#form').removeClass('error');
        $('#error_name').html('');
    }


    var obj = {
        action: 'update',
        formID: FormName,
        roleID: RoleName,
        actionID: Action,
        UpdatedBy: EmployeeId
    };

    $.ajax({
        type: "PUT",
        url: apiUrl + 'AssignFormToRole/UpdateAssignFormToRole',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            if (result.status == true) {
                let timerInterval
                Swal.fire({
                    icon: 'success',
                    type: 'success',
                    title: 'Record Udpated',
                    timer: 5000,
                    confirmButtonColor: "#61affe",
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    clear();
                    getTableEmployee();
                    $("#divInput").hide();
                    
                })

            }
            else {
                alert(result.message);
            }

        },
        error: function (error) {
            console.log(error.response);


        }
    });

});

//Click Add Button
$('#btnAdd').on('click', function () {
   
    $("#divInput").show();
    clear();
});

//Click Close Button
$('#btnClose').on('click', function () {

    $("#divInput").hide();
    clear(); 
});


// Logout
$(document).on("click", ".btnLogout", function () {
    $.ajax({
        type: 'POST',
        url: webUrl+ 'Accounts/Logout',
        dataType: "json",
        success: function () {
            window.location.href = "/Accounts/Index";
        },
        error: function () {
            alert('error');
        }
    });
});