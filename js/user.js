// 封装通用的代码

class FiledValidator {
    constructor(txtId, validatorFunc) {
        this.validatorFunc = validatorFunc;
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.input.onblur = () => {
            this.validate();
        }
    }

    async validate() {
        this.err = await this.validatorFunc(this.input.value);
        if (this.err) {
            this.p.innerText = this.err;
            return false;
        }
        else {
            this.p.innerText = '';
            return true;
        }

    }

    static async validate(...validators) {
        const prom = validators.map(v => v.validate());
        const result = await Promise.all(prom);
        return result.every(r => r === true);
    }
}