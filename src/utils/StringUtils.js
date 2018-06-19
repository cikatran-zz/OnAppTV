export const timeFormatter = (time) => {
  let date = new Date(time)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  return ((hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes))
}

export const getGenresData = (data, numberOfItem) => {
    let genres = 'N/A';
    if (data.genres) 
        data.genres.map((genre, index) => {
            if (index < numberOfItem) {
                if (index !== 0) genres = genres + ", " + genre.name;
                else genres = genre.name
            }
        })
    return genres;
}