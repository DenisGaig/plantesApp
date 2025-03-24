// Service pour le stockage local
const storageService = {
  getStoredData: (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  storeData: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
};
export default storageService;

// Service pour le stockage de session
// const sessionStorageService = {
//   getItem: (key) => {
//     const item = sessionStorage.getItem(key);
//     return item ? JSON.parse(item) : null;
//   },
//   setItem: (key, value) => {
//     sessionStorage.setItem(key, JSON.stringify(value));
//   },
//   removeItem: (key) => {
//     sessionStorage.removeItem(key);
//   },
// };
// export default sessionStorageService;

// Service pour le stockage de cookies
// const cookieService = {
//   getItem: (key) => {
//     const cookies = document.cookie.split("; ");
//     for (const cookie of cookies) {
//       const [name, value] = cookie.split("=");
//       if (name === key) {
//         return JSON.parse(decodeURIComponent(value));
//       }
//     }
//     return null;
//   },
//   setItem: (key, value, days) => {
//     const date = new Date();
//     date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//     const expires = `expires=${date.toUTCString()}`;

//     document.cookie = `${key}=${JSON.stringify(value)};${expires};path=/`;

//   },
//   removeItem: (key) => {
//     document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
//   },
// };
// export default cookieService;
