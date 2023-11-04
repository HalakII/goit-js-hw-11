import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { ImagesPixabayApi } from './js/fetch';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
const newsImages = new ImagesPixabayApi();
// console.dir(newsImages);

const formQueryEl = document.querySelector('.search-form');
const loadBtnEl = document.querySelector('.load-more');
const divGallerylEl = document.querySelector('.gallery');

formQueryEl.addEventListener('submit', onQuerySelect);
loadBtnEl.addEventListener('click', onLoadMoreClick);

loadBtnEl.classList.add('hidden');

function onQuerySelect(event) {
  event.preventDefault();
  newsImages.q = event.target.elements.searchQuery.value;

  if (newsImages.q === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  updateBtnStatus();
  newsImages.page = 1;
  newsImages
    .getImages()
    .then(data => {
      if (data.hits.length === 0) {
        formQueryEl.reset();
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      divGallerylEl.innerHTML = '';
      const markup = imagesTemplate(data.hits);
      divGallerylEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      newsImages.totalPage = Math.ceil(data.totalHits / 40);
      loadBtnEl.classList.remove('hidden');
      formQueryEl.reset();
    })
    .catch(er => console.log(er));
}
function onLoadMoreClick() {
  newsImages.page += 1;
  updateBtnStatus();

  newsImages
    .getImages()
    .then(data => {
      const markup = imagesTemplate(data.hits);
      divGallerylEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    })
    .catch(er => console.log(er));
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
  return `<a class="gallery__link" href="${largeImageURL}"><div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" /><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p> </div></div></a>`;
}
function imagesTemplate(images) {
  const markup = images.map(imageTemplate).join('');
  return markup;
}
function updateBtnStatus() {
  if (newsImages.page >= newsImages.totalPage) {
    loadBtnEl.classList.add('hidden');
  }
}
