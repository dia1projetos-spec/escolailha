/**
 * Login Page Controller
 * Colégio Ilha Brasil
 * Desenvolvido por: Henrique Siqueira
 */

class LoginController {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.googleLoginBtn = document.getElementById('googleLogin');
        this.alertBox = document.getElementById('alertBox');
        
        this.init();
    }

    init() {
        // Form submission
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));

        // Toggle password visibility
        this.togglePasswordBtn?.addEventListener('click', () => this.togglePassword());

        // Google login
        this.googleLoginBtn?.addEventListener('click', () => this.handleGoogleLogin());

        // Remember me - load saved email if exists
        this.loadSavedCredentials();

        // Real-time validation
        this.emailInput?.addEventListener('blur', () => this.validateEmail());
        this.passwordInput?.addEventListener('blur', () => this.validatePassword());
    }

    async handleLogin(e) {
        e.preventDefault();

        // Validate inputs
        if (!this.validateForm()) {
            return;
        }

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const rememberMe = this.rememberMeCheckbox.checked;

        // Show loading state
        this.setLoadingState(true);

        try {
            // TODO: Implement Firebase authentication
            // const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Simulate API call for now
            await this.simulateLogin(email, password);

            // Save email if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Show success message
            this.showAlert('Login realizado com sucesso!', 'success');

            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch (error) {
            this.setLoadingState(false);
            this.handleLoginError(error);
        }
    }

    async handleGoogleLogin() {
        this.setLoadingState(true, 'googleLogin');

        try {
            // TODO: Implement Firebase Google authentication
            // const provider = new GoogleAuthProvider();
            // const result = await signInWithPopup(auth, provider);
            
            // Simulate Google login
            await this.simulateGoogleLogin();

            this.showAlert('Login com Google realizado com sucesso!', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch (error) {
            this.setLoadingState(false, 'googleLogin');
            this.handleLoginError(error);
        }
    }

    validateForm() {
        let isValid = true;

        if (!this.validateEmail()) {
            isValid = false;
        }

        if (!this.validatePassword()) {
            isValid = false;
        }

        return isValid;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.setFieldError(this.emailInput, 'E-mail é obrigatório');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.setFieldError(this.emailInput, 'E-mail inválido');
            return false;
        }

        this.removeFieldError(this.emailInput);
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (!password) {
            this.setFieldError(this.passwordInput, 'Senha é obrigatória');
            return false;
        }

        if (password.length < 6) {
            this.setFieldError(this.passwordInput, 'Senha deve ter no mínimo 6 caracteres');
            return false;
        }

        this.removeFieldError(this.passwordInput);
        return true;
    }

    setFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.style.borderColor = '#e74c3c';

        let errorElement = formGroup.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '5px';
            errorElement.style.display = 'block';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    removeFieldError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.style.borderColor = '';
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;

        const icon = this.togglePasswordBtn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    setLoadingState(isLoading, buttonType = 'login') {
        if (buttonType === 'login') {
            const btnText = this.loginBtn.querySelector('.btn-text');
            const btnLoader = this.loginBtn.querySelector('.btn-loader');

            if (isLoading) {
                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-block';
                this.loginBtn.disabled = true;
            } else {
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                this.loginBtn.disabled = false;
            }
        } else if (buttonType === 'googleLogin') {
            if (isLoading) {
                this.googleLoginBtn.disabled = true;
                this.googleLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
            } else {
                this.googleLoginBtn.disabled = false;
                this.googleLoginBtn.innerHTML = '<i class="fab fa-google"></i> Entrar com Google';
            }
        }
    }

    showAlert(message, type = 'error') {
        this.alertBox.textContent = message;
        this.alertBox.className = `alert ${type}`;
        this.alertBox.style.display = 'block';

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideAlert();
        }, 5000);
    }

    hideAlert() {
        this.alertBox.style.display = 'none';
    }

    handleLoginError(error) {
        let errorMessage = 'Erro ao fazer login. Tente novamente.';

        // Firebase error codes (will be used when Firebase is implemented)
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuário não encontrado';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'E-mail inválido';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'Usuário desativado';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
        } else if (error.message) {
            errorMessage = error.message;
        }

        this.showAlert(errorMessage, 'error');
    }

    loadSavedCredentials() {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail && this.emailInput) {
            this.emailInput.value = savedEmail;
            this.rememberMeCheckbox.checked = true;
        }
    }

    // Simulate login for testing (remove when Firebase is implemented)
    simulateLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful login for demo purposes
                if (email && password.length >= 6) {
                    resolve({ user: { email } });
                } else {
                    reject({ message: 'Credenciais inválidas' });
                }
            }, 1500);
        });
    }

    // Simulate Google login for testing (remove when Firebase is implemented)
    simulateGoogleLogin() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ user: { email: 'usuario@gmail.com' } });
            }, 1500);
        });
    }
}

// ==========================================
// PASSWORD RESET FUNCTIONALITY
// ==========================================

class PasswordReset {
    constructor() {
        this.forgotPasswordLink = document.querySelector('.forgot-password');
        this.init();
    }

    init() {
        this.forgotPasswordLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showResetDialog();
        });
    }

    showResetDialog() {
        const email = prompt('Digite seu e-mail para recuperação de senha:');
        
        if (email) {
            if (this.isValidEmail(email)) {
                this.sendPasswordResetEmail(email);
            } else {
                alert('E-mail inválido. Por favor, digite um e-mail válido.');
            }
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async sendPasswordResetEmail(email) {
        try {
            // TODO: Implement Firebase password reset
            // await sendPasswordResetEmail(auth, email);
            
            // Simulate for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (error) {
            alert('Erro ao enviar e-mail de recuperação. Tente novamente.');
            console.error(error);
        }
    }
}

// ==========================================
// REGISTRATION LINK
// ==========================================

class Registration {
    constructor() {
        this.registerLink = document.getElementById('registerLink');
        this.init();
    }

    init() {
        this.registerLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegistrationInfo();
        });
    }

    showRegistrationInfo() {
        alert(
            'Para solicitar acesso ao Portal do Aluno, entre em contato com a secretaria:\n\n' +
            '📞 (11) 99999-9999\n' +
            '📧 contato@colegioilhabrasil.com.br\n\n' +
            'Horário de atendimento: Segunda a Sexta, 7h às 18h'
        );
    }
}

// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    new LoginController();
    new PasswordReset();
    new Registration();

    // Console message
    console.log('%c🔐 Sistema de Login - Colégio Ilha Brasil', 'font-size: 16px; color: #009739; font-weight: bold;');
    console.log('%cDesenvolvido por: Henrique Siqueira', 'font-size: 12px; color: #002776;');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoginController, PasswordReset, Registration };
}
