const loginValidator = new FiledValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
    return '';
})

const loginPwValidator = new FiledValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
    return '';
})


async function allValidatorConfirm() {
    const result = await FiledValidator.validate(loginValidator, loginPwValidator);
    return result;
}

const form = $('.user-form');
form.onsubmit = async function (e) {
    e.preventDefault();
    const result = await allValidatorConfirm();
    if (!result) {
        // 验证未通过
        return;
    }
    const formDatas = new FormData(form);
    const data = Object.fromEntries(formDatas);
    const resp = await api.login(data);
    console.log(resp.code);
    if (resp.code === 0) {
        alert('登录成功');
        location.href = './index.html';
    }
    else {
        alert('登录失败，请检查账号密码是否正确');
        loginPwValidator.input.value = '';
    }
}