const reviewTitle = document.createElement('h3');
reviewTitle.classList.add('review-title');
reviewTitle.innerText = "Review Buku";

const closeButton = document.createElement('button');
closeButton.classList.add('close-button');

const reviewHeader = document.createElement('div')
reviewHeader.classList.add('review-header');
reviewHeader.append(reviewTitle, closeButton);

const textReview = document.createElement('textarea');
textReview.classList.add('text-review');
textReview.setAttribute('placeholder', 'Ketikkan review di sini...')

const reviewContainer = document.createElement('div');
reviewContainer.classList.add('review-container');
reviewContainer.append(textReview);

export const dialogReview = document.createElement('dialog');
dialogReview.classList.add('dialog-review');
dialogReview.append(reviewHeader, reviewContainer);
document.body.appendChild(dialogReview);

closeButton.addEventListener('click', function () {
    dialogReview.close();
});