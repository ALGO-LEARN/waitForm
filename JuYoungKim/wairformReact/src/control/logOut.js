export default function logOut(){
    localStorage.removeItem("accessToken","");
    localStorage.removeItem("refreshToken","");
    window.location.reload();
}