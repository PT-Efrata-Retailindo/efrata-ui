import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";
import '../styles/signin.css';
import JSEncrypt from 'jsencrypt';
import { PasswordValidator } from './utils/password-validator';

@inject(AuthService)
export class Login {
    username = "";
    password = "";

    usernameError = "";
    passwordError = "";
    generalError = "";

    error = false;
    disabledButton = false;

    constructor(authService) {
        this.authService = authService;
    }

    login() {
        this.error = false;
        this.usernameError = "";
        this.passwordError = "";
        this.generalError = "";

        if (!this.username) {
            this.usernameError = "Username wajib diisi";
        }

        if (!this.password) {
            this.passwordError = "Password wajib diisi";
        }

        if (this.usernameError || this.passwordError) {
            return;
        }

        this.disabledButton = true;
        const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----MIIBCgKCAQEAs0BWxmbSYwoX5O6hGvBtTSYefO3mL6jtuY9cKGTNo+8FZ4VMWIipmf4RkF+1bVsE3XCRhptEM8XnqO8n4mR7QVOuxHQ3AUj0hVAQEAg6h4J1ywIRfukks7R3lY7AkZBYm9hb3k6189jKtx4eD/VKAbD7KMTl3uhCasLyApgCMvoZmx/ybWnXWNa1hmZyn3mk2tNZT6Q9OsKbsvLv2iUmSOrBj0flfQyNBaTknmcQkIYmaoZRClwAQltNa6jQrcoPVe9d3VTv4nJz9roaWjFt1fR81aKiCVGvVxSpwN0kHxTlu6k3J8ckVCjWtJEu4BnGyT455GatnKKQMrbJQJrvQQIDAQAB-----END PUBLIC KEY-----`;

        const credentials = {
            username: this.username,
            password: this.password,
            nonce: crypto.randomUUID(),
            timestamp: new Date().toISOString()
        };

        const encryptor = new JSEncrypt.JSEncrypt();
        encryptor.setPublicKey(PUBLIC_KEY);
        const authEncrypted = encryptor.encrypt(JSON.stringify(credentials));

        return this.authService.login({ authEncrypted })
            .then(response => {
                console.log("success logged " + response);

                this.statusMessage = PasswordValidator.validate(this.password);

                if (this.statusMessage) {
                    alert(this.statusMessage);
                    this.disabledButton = false;
                    window.location.href = `#/changepass?Username=${this.username}`;
                }
            })
            .catch(err => {
                this.error = true;
                this.disabledButton = false;

                const defaultMsg = "Username atau password salah";

                if (err && typeof err.json === 'function') {
                    return err.json()
                        .then(d => {
                            let msg = defaultMsg;
                            try {
                                if (d) msg = d.message || d.Message || d.error || JSON.stringify(d) || msg;
                            } catch (e) {
                            }
                            this.generalError = msg;
                        })
                        .catch(() => {
                            this.generalError = err.statusText || defaultMsg;
                        });
                }

                let msg = defaultMsg;
                try {
                    if (err) {
                        if (err.response && err.response.data) {
                            const d = err.response.data;
                            msg = d.message || d.Message || d.error || JSON.stringify(d) || msg;
                        } else if (err.data) {
                            const d = err.data;
                            msg = d.message || d.Message || d.error || JSON.stringify(d) || msg;
                        } else if (err.message) {
                            msg = err.message;
                        } else if (typeof err === 'string') {
                            msg = err;
                        } else if (err.statusText) {
                            msg = err.statusText;
                        }
                    }
                } catch (e) { }

                this.generalError = msg;
            });
    }
} 