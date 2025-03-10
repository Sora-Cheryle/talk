// 验证是否有登录，如果没有登录，跳转的登录页，如果有登录，获得登录的信息

(async function () {
    const isLogin = await api.profile();
    if (isLogin.code !== 0) {
        alert(isLogin.msg);
        location.href = './login.html';
    }
    const nickname = $('#nickname');
    const loginId = $('#loginId');
    const chatContainer = $('.chat-container');
    const sendContainer = $('.msg-container');
    const sendInput = $('#txtMsg');
    const sendButton = $('button');
    const closeButton = $('.close');
    async function init() {
        nickname.innerText = isLogin.data.nickname;
        loginId.innerText = isLogin.data.loginId;
        chatContainer.innerHTML = '';
        getChatHistory();
    }
    init();
    // 获取聊天记录
    async function getChatHistory() {
        const history = await api.getHistory();
        const data = history.data;
        for (const item of data) {
            if (item.from === isLogin.data.loginId) {
                sendTo(item.content, false, item.createdAt);
            }
            else {
                sendTo(item.content, true, item.createdAt);
            }
        }
        scrollBottom();
    }
    //发送消息
    function sendTo(message, isRobbit, time) {
        const div = $$$('div');
        const img = $$$('img');
        const content = $$$('div');
        const date = $$$('div');
        div.classList.add('chat-item');
        img.classList.add('chat-avatar');
        content.classList.add('chat-content');
        date.classList.add('chat-date');
        content.innerText = message;
        date.innerText = formData(time);
        //判断是否为机器人发送的消息
        if (isRobbit) {
            img.src = './asset/robot-avatar.jpg';
        }
        else {
            div.classList.add('me');
            img.src = './asset/avatar.png';
        }
        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);
        chatContainer.appendChild(div);
    }

    //让聊天框滚动到最后
    function scrollBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function formData(time) {
        const date = new Date(time);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDay().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
    async function bindEvent() {
        sendButton.onclick = async function (e) {
            e.preventDefault();
            //如果发送信息未空，则返回
            if (!sendInput.value) {
                return;
            }
            const value = sendInput.value;
            sendInput.value = '';
            sendTo(value, false, new Date());
            scrollBottom();
            const resp = await api.sendChat({ content: value });
            sendTo(resp.data.content, true, new Date());
            scrollBottom();
        }
        closeButton.onclick = loginOut;
    }
    bindEvent();
    function loginOut() {
        api.loginOut();
        alert('已退出登录');
        location.href = './login.html';
    }
})()