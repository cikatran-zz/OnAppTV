let monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export const timeFormatter = (time) => {
    let date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDate()
    let month = date.getMonth() + 1
    return (monthNames[month] + " " + (day < 10 ? '0' + day : day)) + " - " + ((hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes))
};

export const secondFormatter = (duration) => {
  let sec_num = parseInt(duration, 10); // don't forget the second param
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
};

