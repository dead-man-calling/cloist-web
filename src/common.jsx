import { load } from 'recaptcha-v3';
import jwt_decode from 'jwt-decode';
import { apiServerUrl, recaptchaSiteKey } from "./constant";

export const setCookie = (name, value) => {
    document.cookie = name + '=' + value;
};

export const getCookie = (name) => {
    const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value ? value[2] === '' ? null : value[2] : null;
};

export const deleteCookie = (name) => {
    document.cookie = name + '=';
};

export const verifyRecaptcha = async (action) => {
    const recaptcha = await load(recaptchaSiteKey, { autoHideBadge: true });

    const token = await recaptcha.execute(action);

    const response = await verifyRecaptchaCall(token);

    if (response && response.success && response.data)
        return true;

    return false;
}

const verifyRecaptchaCall = async (token) => {
    try {
        const response = await fetch(
            `${apiServerUrl}/recaptcha/verify/${token}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        const { success, code, message, data } = await response.json();

        return { success: success, code: code, message: message, data: data };
    }
    catch (e) {
        return null;
    }
}

export const apiCall = async (method, path, body, push) => {
    try {
        const token = getCookie('MONASTERYTOKEN');

        if (token && isExpired(token)) {
            deleteCookie('MONASTERYTOKEN');
            push('/exception');
            return null;
        }

        const response = await fetch(
            `${apiServerUrl}${path}`,
            {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: body ? JSON.stringify(body) : null
            });

        const { success, code, message, data } = await response.json();

        if (code === -1000) {
            deleteCookie('MONASTERYTOKEN');
            push('/exception');
            return null;
        }

        return { success: success, code: code, message: message, data: data };
    }
    catch (e) {
        return null;
    }
};


const getDate = () => new Date((Date.now() + new Date().getTimezoneOffset() * 60 * 1000) + (540 * 60 * 1000));

export const isExpired = (token) => {
    try {
        const decode = jwt_decode(token);

        const currentDate = getDate();
        const expirationDate = new Date(decode.exp * 1000);

        if (currentDate >= expirationDate)
            return true;

        return false;
    } catch (e) {
        return false;
    }
}