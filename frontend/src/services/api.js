import axios from 'axios';

// The Vite proxy configuration correctly forwards /api requests to localhost:8000
const api = axios.create({
    baseURL: import.meta.env.PROD ? 'https://lsb-ninja.onrender.com/api/v1' : '/api/v1',
});

export const encodeMedia = async (mode, fileOrText, secret, password) => {
    if (mode === 'text') {
        const res = await api.post('/text/encode', {
            cover_text: fileOrText,
            secret_text: secret,
            password: password
        });
        return res.data;
    } else {
        const formData = new FormData();
        formData.append('file', fileOrText);
        formData.append('secret_text', secret);
        formData.append('password', password);

        const res = await api.post(`/${mode}/encode`, formData, {
            responseType: 'blob'
        });
        return res.data;
    }
};

export const decodeMedia = async (mode, fileOrText, password) => {
    if (mode === 'text') {
        const res = await api.post('/text/decode', {
            stego_text: fileOrText,
            password: password
        });
        return res.data;
    } else {
        const formData = new FormData();
        formData.append('file', fileOrText);
        formData.append('password', password);

        const res = await api.post(`/${mode}/decode`, formData);
        return res.data;
    }
};
