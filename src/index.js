import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { ImagesPixabayApi } from './js/fetch';

// ---------------------------------------------------------------
//infitity-scroll
// ---------------------------------------------------------------

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
const newsImages = new ImagesPixabayApi();
// console.dir(newsImages);

const formQueryEl = document.querySelector('.search-form');
const loadBtnEl = document.querySelector('.load-more');
const divGallerylEl = document.querySelector('.gallery');
const infinitiDivEl = document.querySelector('.infitity-scroll');

formQueryEl.addEventListener('submit', onQuerySelect);
var options = {
  rootMargin: '500px',
  threshold: 0,
};
const callback = async function (entries, observer) {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) return;
    try {
      newsImages.page += 1;
      updateStatusObserver();
      const data = await newsImages.getImages();

      const markup = imagesTemplate(data.hits);
      divGallerylEl.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
      smoothScroll();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  });
};
const observer = new IntersectionObserver(callback, options);

loadBtnEl.classList.add('hidden');

async function onQuerySelect(event) {
  event.preventDefault();
  newsImages.q = event.target.elements.searchQuery.value;

  if (newsImages.q === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  try {
    newsImages.page = 1;
    const data = await newsImages.getImages();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      return '';
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    divGallerylEl.innerHTML = '';
    const markup = imagesTemplate(data.hits);
    divGallerylEl.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    newsImages.totalPage = Math.ceil(data.totalHits / 40);
    observer.observe(infinitiDivEl);
    updateStatusObserver();
    formQueryEl.reset();
  } catch (error) {
    console.error('An error occurred:', error);
  }
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
function updateStatusObserver() {
  if (newsImages.page >= newsImages.totalPage) {
    observer.unobserve.infinitiDivEl;
  }
}
function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
// ---------------------------------------------------------------
// with load-more button
// ---------------------------------------------------------------
// function scrollPage() {
//   const { height: cardHeight } = document
//     .querySelector('.photo-gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// const lightbox = new SimpleLightbox('.gallery a', {
//   captionDelay: 250,
// });
// const newsImages = new ImagesPixabayApi();
// // console.dir(newsImages);

// const formQueryEl = document.querySelector('.search-form');
// const loadBtnEl = document.querySelector('.load-more');
// const divGallerylEl = document.querySelector('.gallery');

// formQueryEl.addEventListener('submit', onQuerySelect);
// loadBtnEl.addEventListener('click', onLoadMoreClick);

// loadBtnEl.classList.add('hidden');

// function onQuerySelect(event) {
//   event.preventDefault();
//   newsImages.q = event.target.elements.searchQuery.value;

//   if (newsImages.q === '') {
//     return Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.'
//     );
//   }
//   updateBtnStatus();
//   newsImages.page = 1;
//   newsImages
//     .getImages()
//     .then(data => {
//       if (data.hits.length === 0) {
//         formQueryEl.reset();
//         return Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//       Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
//       divGallerylEl.innerHTML = '';
//       const markup = imagesTemplate(data.hits);
//       divGallerylEl.insertAdjacentHTML('beforeend', markup);
//       lightbox.refresh();
//       newsImages.totalPage = Math.ceil(data.totalHits / 40);
//       loadBtnEl.classList.remove('hidden');
//       formQueryEl.reset();
//     })
//     .catch(er => console.log(er));
// }
// function onLoadMoreClick() {
//   newsImages.page += 1;
//   updateBtnStatus();

//   newsImages
//     .getImages()
//     .then(data => {
//       const markup = imagesTemplate(data.hits);
//       divGallerylEl.insertAdjacentHTML('beforeend', markup);
//       lightbox.refresh();
//     })
//     .catch(er => console.log(er));
// }
// function imageTemplate({
//   webformatURL,
//   largeImageURL,
//   tags,
//   likes,
//   views,
//   comments,
//   downloads,
// }) {
//   return `<a class="gallery__link" href="${largeImageURL}"><div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" /><div class="info"><p class="info-item"><b>Likes: ${likes}</b></p><p class="info-item"><b>Views: ${views}</b></p><p class="info-item"><b>Comments: ${comments}</b></p><p class="info-item"><b>Downloads: ${downloads}</b></p> </div></div></a>`;
// }
// function imagesTemplate(images) {
//   const markup = images.map(imageTemplate).join('');
//   return markup;
// }
// function updateBtnStatus() {
//   if (newsImages.page >= newsImages.totalPage) {
//     loadBtnEl.classList.add('hidden');
//   }
// }
