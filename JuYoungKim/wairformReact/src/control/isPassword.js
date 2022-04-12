export default function isPassword(password){
    var passwordRegex = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;

    return passwordRegex.test(password)
}