export function getImageFromArray(images, firstImageName, secondImageName) {
    if (images == null || images.length == 0) {
        return 'https://i.imgur.com/7eKo6Q7.png'
    }
    let image = null;
    images.forEach((item)=> {
        if (item.name === firstImageName) {
            let scaledImages = item.scaledImage
            if (scaledImages != null) {
                image = scaledImages[scaledImages.length - 1].url;
            }
        }
        if (image == null && item.name === secondImageName) {
            let scaledImages = item.scaledImage
            if (scaledImages != null) {
                image = scaledImages[scaledImages.length - 1].url;
            }
        }
    });
    image = (image == null) ? images[0].url : image;
    return image;
}