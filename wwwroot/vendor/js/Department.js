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
    getDeparment();

    getTableEmployee();
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

//Fill DropDown Deparment
function getDeparment() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Deparment/GetDeparmentByActive?action=GetDeparmentByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetDeparment,
        error: function (error) {
            console.log(error.responseText);

        },
        
    });
  
}
function onSuccessGetDeparment(data, status) {


    $('#department').empty();
    $.each(data.data, function (i, item) {
        $("#department").append("<option value='" + item.DeparmentID + "'>" + item.DeparmentName + "</option>").show();
    });
   /* console.log(data);*/



}



//Get Employee Table 
function getTableEmployee()
{
    $('#tblDepartment').DataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'Deparment/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {

        },
        "columns": [
            { "data": "DeparmentName", "autoWidth": true },
            { "data": "Remarks", "autoWidth": true },
            { "data": "ParentID", "autoWidth": true },
         
            
            {
                "data": 'DeparmentID', "weight": "50px" , "render": function (data) {
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


    $('#departmentName').val(col1);
    $('#remarks').val(col2);
    $('#department').val(col3);
 
    
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
                url: apiUrl + 'Deparment/DeleteDeparment?action=delete&id=' + UpdateEmployeeID,
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
 
//All Input Clear
function clear() {
    $("#departmentName").val("");
    $("#remarks").val("");
  
    getDeparment();
   
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
    var DepartmentName = $('#departmentName').val();
    var Remarks = $('#remarks').val();
    var Deparment = $('#department').val();
    var EmployeeId = employeeId;

    if (DepartmentName == "") {
        $('#departmentName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#departmentName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action: 'insert',
        deparmentName: DepartmentName,
        remarks: Remarks,
        parentID: Deparment,
        CreatedBy: EmployeeId
    };

   // console.log(obj);
    $.ajax({
        type: "POST",
        url: apiUrl + 'Deparment/InsertDeparment',
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
    var DepartmentName = $('#departmentName').val();
    var Remarks = $('#remarks').val();
    var Deparment = $('#department').val();
    var EmployeeId = employeeId;

    if (DepartmentName == "") {
        $('#departmentName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        return false;
    } else {
        $('#departmentName').removeClass('error');
        $('#error_name').html('');
    }


    var obj = {
        action: 'update',
        deparmentID: UpdateEmployeeID,
        deparmentName: DepartmentName,
        remarks: Remarks,
        parentID: Deparment,
        UpdatedBy: EmployeeId
    };

    // console.log(obj);
    $.ajax({
        type: "PUT",
        url: apiUrl + 'Deparment/UpdateDeparment',
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