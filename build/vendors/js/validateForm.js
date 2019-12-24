function formValidate(options) {
    let vf = new validateForm(options)
}

class validateForm {
    constructor(options) {
        this.form = options.form;
        this.length = options.form.children.length;
        this.errors = [];
        this.emailRegExp = options.emailRegExp || /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$/;
        this.phoneRegExp = options.phoneRegExp || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        this.url = options.url;
        this.data = {};
        this.onLoadStart = options.onLoadStart;
        this.onSuccess = options.onSuccess;
        this.onError = options.onError;

        this.validation();
    }

    validation() {
        this.errors = [];

        let inputs = [];
        for (let i = 0; i < this.length; i++) {
            if (form.children[i].type && form.children[i].type !== 'button' && form.children[i].type !== 'submit') {
                inputs.push(form.children[i]);
            }
        }

        for (let i = 0; i < inputs.length; i++) {
            let required = inputs[i].getAttribute('data-role').includes('required');

            if ((required && inputs[i].value === '') ||
                (required && inputs[i].getAttribute('data-role').includes('checkbox') && !inputs[i].checked)) {
                this.errors.push(inputs[i]);
            } else if (inputs[i].getAttribute('data-role').includes('phone')) {
                this.phoneValidation(inputs[i])
            } else if (inputs[i].getAttribute('data-role').includes('email')) {
                this.emailValidation(inputs[i])
            } else {
                let key = inputs[i].getAttribute('name');
                this.data[key] = inputs[i].value;
                inputs[i].classList.remove('error');
            }
        }

        if (this.errors.length) {
            this.errors.forEach(item => {
                item.classList.add('error');
                return false;
            });
        } else {
            this.sendInfo(this.data, this.url);
        }
    }

    phoneValidation = input => {
        if (input.value.match(this.phoneRegExp)) {
            this.errors.pop(input);
            input.classList.remove('error');
            let key = input.getAttribute('name');
            this.data[key] = input.value;
            return true;
        }

        this.errors.push(input);
        return false;
    }

    emailValidation = input => {
        if (input.value.match(this.emailRegExp)) {
            this.errors.pop(input);
            input.classList.remove('error');
            let key = input.getAttribute('name');
            this.data[key] = input.value;
            return true;
        }

        this.errors.push(input);
        return false;
    }

    sendInfo = (data, url) => {
        let request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onloadstart = () => {
            this.onLoadStart();
        }

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                this.onSuccess();
            } else {
                this.onError();
            }
        };

        request.onerror = () => {
            this.onError();
        };

        request.send(JSON.stringify(data));
    }
}