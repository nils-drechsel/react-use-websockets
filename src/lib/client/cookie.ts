export const setCookie = (name: string, value: string, domain: string, days?: number) => {
    let expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = ';expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + ';domain=' + domain + ';path=/';
};
export const getCookie = (name: string) => {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        if (!c) continue;
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
export const eraseCookie = (name: string) => {
    document.cookie = name + '=; Max-Age=-99999999;path=/';
};
