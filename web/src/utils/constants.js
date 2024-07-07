export let BASE_API_URI = 'http://127.0.0.1:8000/api';
BASE_API_URI = 'http://192.168.1.102:8000/api';


// const base_api = localStorage.getItem("base_api");
// if (base_api?.includes("http") == true) {
//     BASE_API_URI = base_api
// } else if (process.env.NODE_ENV === 'production') {
//     const url = window.location.href;

//     if (url.search("://test.") >= 0) {
//         BASE_API_URI = 'https://test-api.ycheckgh.com/api'
//     } else if (url.search("://localhost") >= 0) {
//         BASE_API_URI = 'http://localhost:8000/api'
//     }
//     // Localhost server
//     else if (url.search("192.168.0.10") >= 0) {
//         BASE_API_URI = 'http://192.168.0.10:8000/api'
//     }
//     else {
//         BASE_API_URI = 'https://api.ycheckgh.com/api'
//     }
// }

export const FLAG_GREY = "#808080"
export const FLAG_RED = "#ff0000"
export const FLAG_ORANGE = "#ffa500"
export const FLAG_DARK_BLUE = "#3c4e77"
export const FLAG_GREEN = "#00ff00"