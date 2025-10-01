const images = import.meta.glob("../assets/*.jpg",{eager:true, import:"default"});

export function loadImages(name) {
    const key = `../assets/${name.toLowerCase()}.jpg`;
    return images[key]
}