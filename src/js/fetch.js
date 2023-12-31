import axios from 'axios';

export class ImagesPixabayApi {
  static API_KEY = '40453479-a11ad8876b027e59d8fa15ee5';
  static PAGE_LIMIT = 40;
  static BASE_URL = 'https://pixabay.com/api/?';

  constructor() {
    this.q = '';
    this.page = 1;
    this.totalPage = 1;
  }

  async getImages() {
    const PARAMS = new URLSearchParams({
      q: this.q,
      page: this.page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: ImagesPixabayApi.PAGE_LIMIT,
      key: ImagesPixabayApi.API_KEY,
    });

    const url = ImagesPixabayApi.BASE_URL + PARAMS;

    try {
      const response = await axios.get(url);
      const images = response.data;
      return images;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }
}

// ============================================
// export function fetchImages() {
//   const BASE_URL = 'https://pixabay.com/api/?';
//   const API_KEY = '40453479-a11ad8876b027e59d8fa15ee5';

//   const PARAMS = new URLSearchParams({
//     q: '',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: 1,
//     per_page: 40,
//   });

//   const url = `${BASE_URL}key=${API_KEY}&q=""&${PARAMS}`;
//   console.log(url);
//   return fetch(url).then(response => {
//     console.log(response);
//     if (!response.ok) {
//       throw new Error(response.status);
//     }
//     return response.json();
//   });
// }
