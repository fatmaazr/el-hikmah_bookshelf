const SAVED_IMAGE = 'saved-image';
const IMAGE_KEY = 'profpic-bookshelf'

function changeImage(event) {
    const reader =  new FileReader();
    reader.onload = function() {
        const output = document.getElementById('output');
        output.src = reader.result;

        localStorage.setItem(IMAGE_KEY, reader.result);
        document.dispatchEvent(new Event(SAVED_IMAGE));
    }
    reader.readAsDataURL(event.target.files[0]);
}

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('fileInputButton');
    input.addEventListener('change', changeImage);

    const savedImage = localStorage.getItem(IMAGE_KEY);
    if (savedImage) {
        const output = document.getElementById('output');
        output.src = savedImage;
    }
});

document.addEventListener(SAVED_IMAGE, function () {
    console.log(localStorage.getItem(IMAGE_KEY));
});