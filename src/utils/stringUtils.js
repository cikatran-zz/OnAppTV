export const timeFormatter = (time) => {
    let date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return ((hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes))
};

export const secondFormatter = (seconds) => {
    let minutes = Math.floor(seconds/ 60);
    let hours = Math.floor(seconds/ 3600);
    if (hours == 0) {
        return (minutes < 10 ? '0' + minutes : minutes) + 'min';
    } else {
        return ((hours < 10 ? '0' + hours : hours) + "h" + (minutes < 10 ? '0' + minutes : minutes)) + 'min';
    }
};

