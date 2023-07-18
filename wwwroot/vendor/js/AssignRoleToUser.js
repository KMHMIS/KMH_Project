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
    getRole();
    getUser();
    getTableRoleToUser();
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


    $('#RoleID').empty();
    $("#RoleID").append("<option value='" + 0 + "'>--Select Role--</option>").show();
    $.each(data.data, function (i, item) {
        $("#RoleID").append("<option value='" + item.RoleID + "'>" + item.RoleName + "</option>").show();
    });

}

//Fill DropDown User
function getUser() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'User/GetUserByActive?action=GetUserByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetUser,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetUser(data, status) {


    $('#UserID').empty();
    $("#UserID").append("<option value='" + 0 + "'>--Select User--</option>").show();

    $.each(data.data, function (i, item) {
        $("#UserID").append("<option value='" + item.UserID + "'>" + item.UserName + "</option>").show();
    });
   /* console.log(data);*/



}

//Get Table 
function getTableRoleToUser()
{
   
    $('#tblRoleToUser').DataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'AssignRoleToUser/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {

        },
        "columns": [
            { "data": "UserName", "autoWidth": true },
            { "data": "RoleName", "autoWidth": true },
            
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

    $('#UserID').val(col1);
    $('#RoleID').val(col2);
  
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
                url: apiUrl + 'AssignRoleToUser/DeleteAssignRoleToUser?action=delete&id=' + UpdateEmployeeID,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    const element = document.getElementById(UpdateEmployeeID);
                    element.remove();
                    getTableRoleToUser();
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
    
    getRole();
    getUser();
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
    var User = $('#UserID').val();
    var Role = $('#RoleID').val();
    var EmployeeId = employeeId;

    if (User == "") {
        $('#UserID').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#UserID').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'insert',
        RoleID: Role,
        UserID: User,
        CreatedBy: EmployeeId
    };

   // console.log(obj);
    $.ajax({
        type: "POST",
        url: apiUrl + 'AssignRoleToUser/InsertAssignRoleToUser',
        data: JSON.stringify(obj),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            //console.log(result);

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
                    getTableRoleToUser();
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
    var User = $('#UserID').val();
    var Role = $('#RoleID').val();
    var EmployeeId = employeeId;

    if (User == "") {
        $('#UserID').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#UserID').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'update',
        ID: UpdateEmployeeID,
        RoleID: Role,
        UserID: User,
        UpdatedBy: EmployeeId
    };

    // console.log(obj);
    $.ajax({
        type: "PUT",
        url: apiUrl + 'AssignRoleToUser/UpdateAssignRoleToUser',
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
                    getTableRoleToUser();
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