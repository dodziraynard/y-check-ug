export let BASE_API_URI = 'http://127.0.0.1:8000/api';


const base_api = localStorage.getItem("base_api");
if (base_api?.includes("http") == true) {
    BASE_API_URI = base_api
} else if (process.env.NODE_ENV === 'production') {
    BASE_API_URI = 'http://167.71.140.136:8000/api'
}
