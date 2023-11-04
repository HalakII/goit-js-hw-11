import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { ImagesPixabayApi } from './js/fetch';

const newsImages = new ImagesPixabayApi();
// console.dir(newsImages);

const formQueryEl = document.querySelector('.search-form');
const loadBtnEl = document.querySelector('.load-more');
const divGallerylEl = document.querySelector('.gallery');

formQueryEl.addEventListener('submit', onQuerySelect);
loadBtnEl.addEventListener('click', onLoadMoreClick);
function onQuerySelect(event) {
  event.preventDefault();
  newsImages.q = event.target.elements.searchQuery.value;
  newsImages.getImages().then(data => {
    divGallerylEl.innerHTML = '';
    const markup = imagesTemplate(data.hits);
    divGallerylEl.insertAdjacentHTML('beforeend', markup);
    loadBtnEl.disabled = false;
  });
}
function onLoadMoreClick() {
  newsImages.page += 1;
  newsImages.getImages().then(data => {
    const markup = imagesTemplate(data.hits);
    divGallerylEl.insertAdjacentHTML('beforeend', markup);
    loadBtnEl.disabled = false;
  });
}
function imageTemplate({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card"><a class="gallery__link" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /><a></a><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p> </div></div>`;
}
function imagesTemplate(images) {
  const markup = images.map(imageTemplate).join('');
  return markup;
}

// function createInfoMarkup(breed) {
//   console.log(breed[0].breeds[0]);
//   const markup = `<div class="photo-card"><img src="" alt="" loading="lazy" /><div class="info"><p class="info-item"><b>Likes</b></p><p class="info-item"><b>Views</b></p><p class="info-item"><b>Comments</b></p><p class="info-item"><b>Downloads</b></p></div></div>`;
//   divCatIfoEl.insertAdjacentHTML('beforeend', markup);
// }

// loaderEl.classList.remove('hidden');
// fetchBreeds()
//   .then(data => createBreedsMarkup(data))
//   .catch(error => {
//     console.log(error);
//     Notiflix.Notify.failure(
//       'Oops! Something went wrong! Try reloading the page!'
//     );
//   })
//   .finally(() => {
//     loaderEl.classList.add('hidden');
//     breedSelect.classList.remove('hidden');
//   });

// function createBreedsMarkup(data) {
//   const markup = data
//     .map(({ name, id }) => {
//       return `<option value=${id}>${name}</option>`;
//     })
//     .join('');
//   breedSelect.insertAdjacentHTML(
//     'beforeend',
//     `<option data-placeholder="true"></option>${markup}`
//   );

//   new SlimSelect({
//     select: '#selectElement',
//     settings: {
//       searchPlaceholder: 'Search',
//       placeholderText: 'Choose the cat breed',
//     },
//   });
// }
