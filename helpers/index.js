import cookie from 'cookie';

//helper to parse cookies
export function parseCookies(req) {
    return cookie.parse(req ? req.headers.cookie || '' : '');
}
