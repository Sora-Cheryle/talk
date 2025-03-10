
const loginValidator = new FiledValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }
    const name = await api.exists(val);
    if (name.data === true) {
        return '账号已存在';
    }
    return '';
})

const nicknameValidator = new FiledValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称';
    }
    return '';
})

const loginPwValidator = new FiledValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
    return '';
})

const loginPwConfirmValidator = new FiledValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请填写确认密码';
    }
    if (val !== loginPwValidator.input.value) {
        return '两次密码不一致';
    }
    return '';
})


async function allValidatorConfirm() {
    const result = await FiledValidator.validate(loginValidator, loginPwValidator, loginPwConfirmValidator, nicknameValidator);
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
    const resp = await api.reg(data);
    if (resp) {
        alert('注册成功');
        location.href = './login.html';
    }
}