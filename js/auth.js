// ============================================
// MÓDULO DE AUTENTICAÇÃO
// ============================================

class AuthService {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.initAuthStateListener();
    }

    // ============================================
    // Listener de Estado de Autenticação
    // ============================================
    initAuthStateListener() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserRole(user.uid);
                console.log("Usuário autenticado:", user.email);
            } else {
                this.currentUser = null;
                this.userRole = null;
                console.log("Nenhum usuário autenticado");
            }
        });
    }

    // ============================================
    // Carregar Role do Usuário
    // ============================================
    async loadUserRole(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                this.userRole = userData.role;
                
                // Atualiza último login
                await db.collection('users').doc(userId).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                return userData;
            } else {
                console.error("Documento do usuário não encontrado!");
                return null;
            }
        } catch (error) {
            console.error("Erro ao carregar role do usuário:", error);
            throw error;
        }
    }

    // ============================================
    // Login com Email e Senha
    // ============================================
    async login(email, password) {
        try {
            // Faz login no Firebase Authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Carrega dados do usuário do Firestore
            const userData = await this.loadUserRole(user.uid);
            
            if (!userData) {
                throw new Error("Dados do usuário não encontrados no sistema");
            }

            // Verifica se o usuário está ativo
            if (userData.active === false) {
                await this.logout();
                throw new Error("Sua conta está desativada. Entre em contato com a administração.");
            }
            
            return {
                success: true,
                user: user,
                userData: userData
            };
        } catch (error) {
            console.error("Erro no login:", error);
            
            // Traduz erros comuns do Firebase
            let errorMessage = this.getErrorMessage(error.code);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    // ============================================
    // Logout
    // ============================================
    async logout() {
        try {
            await auth.signOut();
            this.currentUser = null;
            this.userRole = null;
            return { success: true };
        } catch (error) {
            console.error("Erro no logout:", error);
            return {
                success: false,
                error: "Erro ao fazer logout. Tente novamente."
            };
        }
    }

    // ============================================
    // Verificar se Usuário Está Autenticado
    // ============================================
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // ============================================
    // Obter Usuário Atual
    // ============================================
    getCurrentUser() {
        return this.currentUser;
    }

    // ============================================
    // Obter Role do Usuário
    // ============================================
    getUserRole() {
        return this.userRole;
    }

    // ============================================
    // Resetar Senha
    // ============================================
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            return {
                success: true,
                message: "Email de recuperação enviado com sucesso!"
            };
        } catch (error) {
            console.error("Erro ao resetar senha:", error);
            
            let errorMessage = this.getErrorMessage(error.code);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    // ============================================
    // Tradução de Erros do Firebase
    // ============================================
    getErrorMessage(errorCode) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado. Verifique o e-mail digitado.',
            'auth/wrong-password': 'Senha incorreta. Tente novamente.',
            'auth/invalid-email': 'E-mail inválido. Verifique o formato do e-mail.',
            'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com a administração.',
            'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
            'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
            'auth/email-already-in-use': 'Este e-mail já está em uso.',
            'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
            'auth/invalid-credential': 'Credenciais inválidas. Verifique seu e-mail e senha.',
            'auth/invalid-login-credentials': 'E-mail ou senha incorretos. Tente novamente.'
        };

        return errorMessages[errorCode] || 'Erro ao fazer login. Tente novamente.';
    }

    // ============================================
    // Redirecionar Baseado no Role
    // ============================================
    redirectByRole() {
        const role = this.getUserRole();
        
        const redirectMap = {
            'admin': 'dashboard-admin.html',
            'professor': 'dashboard-professor.html',
            'aluno': 'dashboard-aluno.html'
        };

        const redirectUrl = redirectMap[role];
        
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            console.error("Role desconhecido:", role);
            this.logout();
            alert("Erro ao identificar tipo de usuário. Faça login novamente.");
        }
    }

    // ============================================
    // Verificar Acesso à Página
    // ============================================
    async checkPageAccess(requiredRoles = []) {
        return new Promise((resolve) => {
            // Aguarda o estado de autenticação ser carregado
            const unsubscribe = auth.onAuthStateChanged(async (user) => {
                unsubscribe();
                
                if (!user) {
                    // Não autenticado
                    window.location.href = 'index.html';
                    resolve(false);
                    return;
                }

                // Carrega dados do usuário se ainda não foram carregados
                if (!this.userRole) {
                    await this.loadUserRole(user.uid);
                }

                // Verifica se o role do usuário está na lista de roles permitidos
                if (requiredRoles.length > 0 && !requiredRoles.includes(this.userRole)) {
                    alert("Você não tem permissão para acessar esta página.");
                    this.redirectByRole();
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        });
    }
}

// Cria instância global do serviço de autenticação
const authService = new AuthService();
