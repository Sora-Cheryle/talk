var api = (function () {
    const BASE_URL = 'https://study.duyiedu.com';
    const TOKEN_KEY = 'token';

    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json',
        };
        const token = localStorage.getItem('token');
        if (token) {
            headers.authorization = 'Bearer ' + token;
        }
        return fetch(BASE_URL + path, {
            method: 'POST',
            body: JSON.stringify(bodyObj),
            headers
        })
    }

    function get(path) {
        const headers = {};
        const token = localStorage.getItem('token');
        if (token) {
            headers.authorization = 'Bearer ' + token;
        }
        return fetch(BASE_URL + path, { headers });
    }

    async function reg(userInfor) {
        const resp = await post('/api/user/reg', userInfor).then(r => r.json());
        return resp;
    }

    async function login(loginInfor) {
        const resp = await post('/api/user/login', loginInfor);
        const result = await resp.json();
        if (result.code === 0) {
            const token = resp.headers.get('authorization');
            localStorage.setItem(TOKEN_KEY, token);
        }
        return result;
    }

    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId);
        return await resp.json();
    }

    async function profile() {
        const resp = await get('/api/user/profile');
        return await resp.json();
    }

    async function sendChat(content) {
        const resp = await post('/api/chat', content);
        return await resp.json();
    }

    async function getHistory() {
        const resp = await get('/api/chat/history');
        return resp.json();
    }

    function loginOut() {
        localStorage.removeItem(TOKEN_KEY);
    }
    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut,
    };
}
)()
