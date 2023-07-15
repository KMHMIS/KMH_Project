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
    getEmployee();
    clear();
    getTableUser();
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

//Fill DropDown Employee
function getEmployee() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Employee/GetEmployeeByActive?action=GetEmployeeByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetEmployee,
        error: function (error) {
            console.log(error.responseText);

        },
        
    });
  
}
function onSuccessGetEmployee(data, status) {


    $('#Employee').empty();
    $.each(data.data, function (i, item) {
        $("#Employee").append("<option value='" + item.EmployeeID + "'>" + item.EmployeeName + "</option>").show();
    });
   /* console.log(data);*/



}

//Get User Table 
function getTableUser()
{
    $('#tblUser').DataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'User/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {

        },
        "columns": [
            { "data": "FirstName", "autoWidth": true },
            { "data": "LastName", "autoWidth": true },
            { "data": "UserName", "autoWidth": true },
            
            {
                "data": 'UserID', "weight": "50px", "render": function (data) {
                    return '<button type="button" id="' + data + '" class="btn btn-primary btnEdit"><i class="material-icons">edit</i></button> <button type="button" id="' + data + '" class="btn btn-danger btnDelete"><i class="material-icons">delete</i></button>'

                }

            }
        ]
    })
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
  

    $('#firstName').val(col1);
    $('#lastName').val(col2);
    $('#userName').val(col3);
 
    //alert(col1 + "\n" + col2 + "\n" + col3 + col4 + "\n" + col5 + "\n" + col6 + "\n" + col7 + "\n" + col8 + "\n" + col9 + "\n" + col10 );
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
                url: apiUrl + 'User/DeleteUser?action=delete&id=' + UpdateEmployeeID,
                contentType: "application/json; charset=utf-8",
                success: function (result) {
                    const element = document.getElementById(UpdateEmployeeID);
                    element.remove();
                    // $('#btnDynamicFilters' + id).remove();
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
 // Handle the click event for the "Edit" button
//$('#tblEmployee tbody').on('click', '.editButton', function () {
//    debugger;
//    var id = $(this).data('EmployeeId');

//    // Make an AJAX request to get the data for the selected ID
//    $.ajax({
//        url: apiUrl + 'Employee/GetEmployeeData?id=' + id + '&action=GetEmployeeData', // Replace with your API endpoint
//        method: 'GET',
//        success: function (response) {
//            console.log(response);
//            // Populate the form fields with the data from the API response
//            $('#firstName').val(response.name);
//            $('#lastName').val(response.email);

//            // Perform any other necessary actions for editing the data
//            // ...

//            // Example: Saving the row ID
//            var rowId = response.EmployeeId;
//        }
//    });
//});



//All Input Clear
function clear() {
    $("#firstName").val("");
    $("#lastName").val("");

    $("#userName").val("");
    $("#password").val("");
    $("#reason").val("");
    
    $('#error_message').html('');
    getEmployee();
    
}

//Click Clear Button
$('#btnClear').on('click', function () {
    clear();

});

//Click Insert Button
$('#btnSave').on('click', function () {

    debugger;
    var Employee = $('#Employee').val();
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var UserName = $('#userName').val();
    var Password = $('#password').val();
    var Reason = $('#reason').val();
    var EmployeeId = employeeId;
    
    if (FirstName == "") {
        $('#firstName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#firstName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'insert',
        EmployeeID: Employee,
        firstName: FirstName,
        lastName: LastName,
        userName: UserName,
        password: Password,
        reason: Reason,
        CreatedBy: EmployeeId
    };

   // console.log(obj);
    $.ajax({
        type: "POST",
        url: apiUrl + 'User/InsertUser',
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
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var UserName = $('#userName').val();
    var EmployeeId = employeeId;

    if (FirstName == "") {
        $('#firstName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#firstName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'update',
        userID: UpdateEmployeeID,
        firstName: FirstName,
        lastName: LastName,
        userName: UserName,
        UpdatedBy: EmployeeId
    };

    // console.log(obj);
    $.ajax({
        type: "PUT",
        url: apiUrl + 'User/UpdateUser',
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
                    title: 'Record Udpated',
                    timer: 5000,
                    confirmButtonColor: "#61affe",
                    timerProgressBar: true,
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    clear();
                    getTableUser();
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
$('.btnLogout').on('click', function () {
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