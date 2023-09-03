// export const  BASE_URL = 'http://127.0.0.1:8000'

export let BASE_URL = 'http://127.0.0.1:8000/api';
if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'http://208.64.33.75:8000'
}
