export default function getTime () {
    const timeStamp = new Date().getTime();
    const date = new Date(timeStamp);
    
    const hour = date.getHours();
    const minute = date.getMinutes();

    return hour+":"+minute;
}   