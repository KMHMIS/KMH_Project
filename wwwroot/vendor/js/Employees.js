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
    getDesignation();
    getShift();
    getBloodGroup();
    getBank();
    getTableEmployee();
    $('#error_message').html('');


    var form = $('#wizard_with_validation').show();
    form.steps({
        headerTag: 'h3',
        bodyTag: 'fieldset',
        transitionEffect: 'slideLeft',
        onInit: function (event, currentIndex) {
            $.AdminBSB.input.activate();

            //Set tab width
            var $tab = $(event.currentTarget).find('ul[role="tablist"] li');
            var tabCount = $tab.length;
            $tab.css('width', (100 / tabCount) + '%');

            //set button waves effect
            setButtonWavesEffect(event);
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex > newIndex) { return true; }

            if (currentIndex < newIndex) {
                form.find('.body:eq(' + newIndex + ') label.error').remove();
                form.find('.body:eq(' + newIndex + ') .error').removeClass('error');
            }

            form.validate().settings.ignore = ':disabled,:hidden';
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            setButtonWavesEffect(event);
        },
        onFinishing: function (event, currentIndex) {
            form.validate().settings.ignore = ':disabled';
            return form.valid();
        },
        onFinished: function (event, currentIndex) {

            debugger;
            var EmployeeName = $('#employeeName').val();
            var CardNo = $('#cardNo').val();
            var Department = $('#Department').val();
            var Designation = $('#Designation').val();
            var Bank = $('#Bank').val();
            var BankAccount = $('#bankAccount').val();
            var Group = $('#BloodGroup').val();
            var Shift = $('#Shift').val();
            var RelationName = $('#relationName').val();
            var Relation = $('#relation').val();
            var Gender = $('#Gender').val();
            var MobileNo = $('#mobileNo').val();
            var TelNo = $('#telNo').val();
            var NIC = $('#cnic').val();
            var NICExpDate = $('#cnicExpDate').val();
            var Address = $('#presentAddtess').val();
            var DateofBirth = $('#dateofBirth').val();
            var Religion = $('#religion').val();
            var NTN = $('#ntn').val();
            var Salary = $('#salary').val();
            var DutyHours = $('#dutyHours').val();
            var ShortName = $('#shortName').val();
            var Add1 = $('#permanentAddress').val();
            var Qualification = $('#qualification').val();
            var Expericence = $('#experience').val();
            var Remarks = $('#remarks').val();
            var ProbationPeriod = $('#probationPeriod').val();
            var IdentMarks = $('#identMark').val();
            var DateofJoining = $('#dateofJoining').val();
            var DateofLeaving = $('#dateofLeaving').val();
            var DateofConfrim = $('#dateofConfirm').val();
            var LeftReason = $('#leftReason').val();
           // var DSalTran = $('#DSalTab').val();
           // var AppliedSassi = $('#AppliedSassi').val();
            var EOBINo = $('#eobiNo').val();
            var EmpEOBIContribute = $('#empEobiContribute').val();
            var HospitalEOBIContribute = $('#hosptialEobi').val();
            var KMHDiscount = $('#kmhDiscount').val();
            var EmpBarcodeId = $('#barCode').val();
            //var IsPermanent = $('#permanent').val();
            var IncomeTax = $('#incomeTax').val();
            var MartialStatus = $('#maritalStatus').val();
           // var Deactived = $('#deactived').val();
            var EmployeeId = employeeId;

            var obj = {
                action: 'insert',
                employeeName: EmployeeName,
                cardNo: CardNo,
                departmentID: Department,
                designationID: Designation,
                bankID: Bank,
                bankAccount: BankAccount,
                groupID: Group,
                shiftID: Shift,
                relationName: RelationName,
                relation: Relation,
                gender: Gender,
                mobileNo: MobileNo,
                telNo: TelNo,
                nic: NIC,
                nic_ExpDate: NICExpDate,
                address: Address,
                dateofBirth: DateofBirth,
                religion: Religion,
                ntn: NTN,
                salary: Salary,
                dutyHours: DutyHours,
                shortName: ShortName,
                add1: Add1,
                qualification: Qualification,
                expericence: Expericence,
                remarks: Remarks,
                probationPeriod: ProbationPeriod,
                identMarks: IdentMarks,
                dateofjoining: DateofJoining,
                dateofleaving: DateofLeaving,
                dateofconfrim: DateofConfrim,
                leftReason: LeftReason,
                dSalTran: '0',
                appliedSassi: '0',
                eobino: EOBINo,
                empEOBIContribute: EmpEOBIContribute,
                hospitalEOBIContribute: HospitalEOBIContribute,
                kmh_Discount: KMHDiscount,
                empBarcode_id: EmpBarcodeId,
                is_permanent: '0',
                incometax: IncomeTax,
                martialStatus: MartialStatus,
                deactived: '0',
                CreatedBy: EmployeeId
            };
            console.log(obj);
            $.ajax({
                type: "POST",
                url: apiUrl + 'Employees/InsertEmployees',
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
                            //clear();
                            //getTableEmployee();
                            //$("#divInput").hide();

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


            //swal("Good job!", "Submitted!", "success");
            //Swal.fire({
            //    confirmButtonText: "OK",
            //    type: 'success',
            //    icon: 'success',
            //    title: 'Record Saved',
            //    timer: 5000
            //});
        }
    });

});

// Function Button Waves Effect
function setButtonWavesEffect(event) {
    $(event.currentTarget).find('[role="menu"] li a').removeClass('waves-effect');
    $(event.currentTarget).find('[role="menu"] li:not(.disabled) a').addClass('waves-effect');
}
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


    $('#Department').empty();
    $("#Department").append("<option value='" + 0 + "'>--Select Department--</option>").show();
    $.each(data.data, function (i, item) {
        $("#Department").append("<option value='" + item.DeparmentID + "'>" + item.DeparmentName + "</option>").show();
    });
   /* console.log(data);*/



}

//Fill DropDown Designation
function getDesignation() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Designation/GetDesignationByActive?action=GetDesignationByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetDesignation,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetDesignation(data, status) {


    $('#Designation').empty();
    $("#Designation").append("<option value='" + 0 + "'>--Select Designation--</option>").show();

    $.each(data.data, function (i, item) {
        $("#Designation").append("<option value='" + item.DesignationID + "'>" + item.DesignationName + "</option>").show();
    });
}

//Fill DropDown Shift
function getShift() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Shift/GetShiftByActive?action=GetShiftByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetShift,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetShift(data, status) {


    $('#Shift').empty();
    $("#Shift").append("<option value='" + 0 + "'>--Select Shift--</option>").show();

    $.each(data.data, function (i, item) {
        $("#Shift").append("<option value='" + item.ShiftID + "'>" + item.ShiftName + "</option>").show();
    });
}

//Fill DropDown BloodGroup
function getBloodGroup() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'BloodGroup/GetBloodGroupByActive?action=GetGroupByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetBloodGroup,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetBloodGroup(data, status) {


    $('#BloodGroup').empty();
    $("#BloodGroup").append("<option value='" + 0 + "'>--Select BloodGroup--</option>").show();

    $.each(data.data, function (i, item) {
        $("#BloodGroup").append("<option value='" + item.GroupID + "'>" + item.GroupName + "</option>").show();
    });
}
//Fill DropDown Bank
function getBank() {

    $.ajax({
        type: "GET",
        url: apiUrl + 'Bank/GetBankByActive?action=GetBankByActive',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(),
        dataType: "json",
        /*async: false,*/
        success: onSuccessGetBank,
        error: function (error) {
            console.log(error.responseText);

        },

    });

}
function onSuccessGetBank(data, status) {


    $('#Bank').empty();
    $("#Bank").append("<option value='" + 0 + "'>--Select Bank--</option>").show();

    $.each(data.data, function (i, item) {
        $("#Bank").append("<option value='" + item.BankID + "'>" + item.BankName + "</option>").show();
    });
}

//Get Employee Table 
function getTableEmployee()
{
   
    $('#tblEmployee').dataTable({

        "info": true,
        "processing": true,
        "order": [[1, "desc"]],
        "bDestroy": true,
        "ajax": {
            "url": apiUrl + 'Employee/GetTableData?action=GetTableData',
            "type": "GET",
            "datatype": "json",
        },
        "rowCallback": function (row, data, index) {
            $(row).attr('data-employeeid', data.EmployeeID);
        },
        "columns": [
            { "data": "FirstName", "autoWidth": true },
            { "data": "LastName", "autoWidth": true },
            { "data": "DeparmentName", "autoWidth": true },
            { "data": "DesignationName", "autoWidth": true },
            { "data": "JoiningDate", "autoWidth": true },
            { "data": "DateOfBirth", "autoWidth": true },
            { "data": "Salary", "autoWidth": true },
            { "data": "Email", "autoWidth": true },
            { "data": "PhoneNo1", "autoWidth": true },
            { "data": "Address", "autoWidth": true },
            
            {
                "data": 'EmployeeID', "weight": "50px" , "render": function (data) {
                    return '<div id="' + data + '" class=" btnEdit"></div> <div id="' + data + '" class=" btnDelete"></div>'
                    //return '<button type="button" id="' + data + '" class="btn btn-primary btnEdit"><i class="material-icons">edit</i></button> <button type="button" id="' + data + '" class="btn btn-danger btnDelete"><i class="material-icons">delete</i></button>'
                    
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
    var col4 = currentRow.find("td:eq(3)").text();
    var col5 = currentRow.find("td:eq(4)").text();
    var col6 = currentRow.find("td:eq(5)").text();
    var col7 = currentRow.find("td:eq(6)").text();
    var col8 = currentRow.find("td:eq(7)").text();
    var col9 = currentRow.find("td:eq(8)").text();
    var col10 = currentRow.find("td:eq(9)").text();

    $('#firstName').val(col1);
    $('#lastName').val(col2);
    $('#Deparment').val(col3);
    $('#Designation').val(col4);
    $('#joiningDate').val(col5);
    $('#dateOfBirth').val(col6);
    $('#salary').val(col7);
    $('#emailAddress').val(col8);
    $('#phoneNo1').val(col9);
    $('#address').val(col10);
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
                url: apiUrl + 'Employee/DeleteEmployee?action=delete&id=' + UpdateEmployeeID,
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
    $("#firstName").val("");
    $("#lastName").val("");
    $("#joiningDate").val("");
    $("#relievingDate").val("");
    $("#dateOfBirth").val("");
    $("#salary").val("");
    $("#emailAddress").val("");
    $("#phoneNo1").val("");
    $("#phoneNo2").val("");
    $("#lastCompanyName").val("");
    $("#address").val("");
    $('#error_message').html('');
    getDeparment();
    getDesignation();
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
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var Deparment = $('#Deparment').val();
    var Designation = $('#Designation').val();
    var JoiningDate = $('#joiningDate').val();
    var RelievingDate = $('#relievingDate').val();
    var DateOfBirth = $('#dateOfBirth').val();
    var Salary = $('#salary').val();
    var Email = $('#emailAddress').val();
    var PhoneNo1 = $('#phoneNo1').val();
    var PhoneNo2 = $('#phoneNo2').val();
    var LastCompanyName = $('#lastCompanyName').val();
    var Address = $('#address').val();
    var EmployeeId = employeeId;
    
    if (FirstName == "") {
        
        $('#firstName').addClass('error');
        $('#error_name').html('Please Fill Textbox');
        $('#firstName').focus();
        return false;
    } else {
        $('#firstName').removeClass('error');
        $('#error_name').html('');
    }

    var obj = {
        action:'insert',
        firstName: FirstName,
        lastName: LastName,
        deparmentID: Deparment,
        designationID: Designation,
        joiningDate: JoiningDate,
        relievingDate: RelievingDate,
        dateOfBirth: DateOfBirth,
        salary: Salary,
        email: Email,
        phoneNo1: PhoneNo1,
        phoneNo2: PhoneNo2,
        lastCompanyName: LastCompanyName,
        address: Address,
        CreatedBy: EmployeeId
    };

   // console.log(obj);
    $.ajax({
        type: "POST",
        url: apiUrl + 'Employee/InsertEmployee',
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
    var FirstName = $('#firstName').val();
    var LastName = $('#lastName').val();
    var Deparment = $('#Deparment').val();
    var Designation = $('#Designation').val();
    var JoiningDate = $('#joiningDate').val();
    var RelievingDate = $('#relievingDate').val();
    var DateOfBirth = $('#dateOfBirth').val();
    var Salary = $('#salary').val();
    var Email = $('#emailAddress').val();
    var PhoneNo1 = $('#phoneNo1').val();
    var PhoneNo2 = $('#phoneNo2').val();
    var LastCompanyName = $('#lastCompanyName').val();
    var Address = $('#address').val();
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
        employeeID: UpdateEmployeeID,
        firstName: FirstName,
        lastName: LastName,
        deparmentID: Deparment,
        designationID: Designation,
        joiningDate: JoiningDate,
        relievingDate: RelievingDate,
        dateOfBirth: DateOfBirth,
        salary: Salary,
        email: Email,
        phoneNo1: PhoneNo1,
        phoneNo2: PhoneNo2,
        lastCompanyName: LastCompanyName,
        address: Address,
        UpdatedBy: EmployeeId
    };

    // console.log(obj);
    $.ajax({
        type: "PUT",
        url: apiUrl + 'Employee/UpdateEmployee',
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