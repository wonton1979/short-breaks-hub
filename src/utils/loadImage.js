

export function loadImages(name) {
    const images = import.meta.glob("../assets/*.jpg",{eager:true, import:"default"});
    const key = `../assets/${name.toLowerCase()}.jpg`;
    return images[key]
}

export function loadSubFolderImages(subFolderName,name) {
    const images = import.meta.glob(`../assets/**/*.jpg`,{eager:true, import:"default"});
    const key = `../assets/${subFolderName}/${name.toLowerCase()}.jpg`;
    return images[key]
}