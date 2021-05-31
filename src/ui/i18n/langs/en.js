import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
    ...enLocale,
    message: {
        "sysName":"Production Monitoring System",


        "submit":"Submit",
        "cancel":"Cancel",
        "prompt":"Prompt",
        "error":"Error",
        "ok":"OK",
        //Login
        'login': 'Login',
        "inputUsername":"username",
        "inputPassword":"password",
        'changePassword':"Change Password",
        "newPassword":"New Password",
        "oldPassword":"Old Password",
        "nowPassword":"Now Password",
        "changeNewPassword":"Enter the new password",
        "confirmNewPassword":"Confirm Password",
        "validateUsername":"Please enter the correct user name",
        "validatePassword":"The password cannot be less than 4 digits",
        "validateNull":"The value cannot be empty",
        "validatePassword1":"Please enter an 8-16 digit password, including at least upper and lower case letters and numbers, and special characters can be included. For example: Aabc1234",
        "validatePassword2":"Your New and Verified passwords do not match, try again",
        "checkNamePassword":"Please check if the user name and password are filled in as required",
        "valueNot":"The modified data does not meet the requirements",
        "oldPasswordNotNull":"Old password cannot be empty",
        "newPasswordNotNull":"New password cannot be empty",
        //glob-head
        "resetSeat":"Reset Seat",
        "handoverSeat":"handover Seat",
        "recallSeat":"recall Seat",
        "allFlights":"All Flights",
        'logout': 'Logout',
        "sureLogout":"Are you sure want to exit the system?",
        "sureResetSeat":"Are you sure to reset seat?",
        "resetNotSelf":"Can't hand over the task to oneself!",
        "successfulHandover":"Successful Handover!",
        "successcancellHandover":"Handover cancelled successfully",
    }
}
 
export default en