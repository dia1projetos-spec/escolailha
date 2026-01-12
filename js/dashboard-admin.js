// ============================================
// DASHBOARD ADMINISTRATIVO
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Verifica autenticação e permissão
    const hasAccess = await authService.checkPageAccess(['admin']);
    
    if (!hasAccess) {
        return;
    }

    // Elementos do DOM
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const btnLogout = document.getElementById('btnLogout');
    const userName = document.getElementById('userName');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // ============================================
    // Carregar Dados do Usuário
    // ============================================
    async function loadUserData() {
        try {
            const user = authService.getCurrentUser();
            
            if (user) {
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    userName.textContent = userData.name || user.email;
                }
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            userName.textContent = "Administrador";
        }
    }

    // ============================================
    // Carregar Estatísticas
    // ============================================
    async function loadStatistics() {
        try {
            // Buscar total de usuários
            const usersSnapshot = await db.collection('users').get();
            document.getElementById('totalUsers').textContent = usersSnapshot.size;

            // Buscar professores
            const professoresSnapshot = await db.collection('users')
                .where('role', '==', 'professor')
                .get();
            document.getElementById('totalProfessores').textContent = professoresSnapshot.size;

            // Buscar alunos
            const alunosSnapshot = await db.collection('users')
                .where('role', '==', 'aluno')
                .get();
            document.getElementById('totalAlunos').textContent = alunosSnapshot.size;

            // Buscar turmas (assumindo que você terá uma collection de turmas)
            const turmasSnapshot = await db.collection('turmas').get();
            document.getElementById('totalTurmas').textContent = turmasSnapshot.size;

        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
            // Mostra 0 em caso de erro
            document.getElementById('totalUsers').textContent = '0';
            document.getElementById('totalProfessores').textContent = '0';
            document.getElementById('totalAlunos').textContent = '0';
            document.getElementById('totalTurmas').textContent = '0';
        }
    }

    // ============================================
    // Carregar Atividades Recentes
    // ============================================
    async function loadRecentActivities() {
        const activitiesContainer = document.getElementById('recentActivities');
        
        try {
            const activitiesSnapshot = await db.collection('activities')
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();

            if (activitiesSnapshot.empty) {
                activitiesContainer.innerHTML = '<p class="info-text">Nenhuma atividade recente</p>';
                return;
            }

            let activitiesHTML = '';
            activitiesSnapshot.forEach(doc => {
                const activity = doc.data();
                const date = activity.timestamp ? activity.timestamp.toDate() : new Date();
                const formattedDate = formatDate(date);
                
                activitiesHTML += `
                    <div class="activity-item">
                        <div class="activity-icon">
                            <i class="fas ${getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-details">
                            <p class="activity-text">${activity.description}</p>
                            <span class="activity-time">${formattedDate}</span>
                        </div>
                    </div>
                `;
            });

            activitiesContainer.innerHTML = activitiesHTML;

        } catch (error) {
            console.error("Erro ao carregar atividades:", error);
            activitiesContainer.innerHTML = '<p class="info-text">Erro ao carregar atividades</p>';
        }
    }

    // ============================================
    // Carregar Notificações
    // ============================================
    async function loadNotifications() {
        const notificationsContainer = document.getElementById('notifications');
        
        try {
            const notificationsSnapshot = await db.collection('notifications')
                .where('role', 'in', ['admin', 'all'])
                .orderBy('timestamp', 'desc')
                .limit(5)
                .get();

            if (notificationsSnapshot.empty) {
                notificationsContainer.innerHTML = '<p class="info-text">Nenhuma notificação</p>';
                return;
            }

            let notificationsHTML = '';
            notificationsSnapshot.forEach(doc => {
                const notification = doc.data();
                const date = notification.timestamp ? notification.timestamp.toDate() : new Date();
                const formattedDate = formatDate(date);
                
                notificationsHTML += `
                    <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                        <div class="notification-icon">
                            <i class="fas ${getNotificationIcon(notification.type)}"></i>
                        </div>
                        <div class="notification-details">
                            <p class="notification-text">${notification.message}</p>
                            <span class="notification-time">${formattedDate}</span>
                        </div>
                    </div>
                `;
            });

            notificationsContainer.innerHTML = notificationsHTML;

        } catch (error) {
            console.error("Erro ao carregar notificações:", error);
            notificationsContainer.innerHTML = '<p class="info-text">Erro ao carregar notificações</p>';
        }
    }

    // ============================================
    // Navegação entre Seções
    // ============================================
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active de todos os itens e seções
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Adiciona active no item clicado
            this.classList.add('active');
            
            // Mostra a seção correspondente
            const sectionToShow = document.getElementById(`${targetSection}-section`);
            if (sectionToShow) {
                sectionToShow.classList.add('active');
            }
            
            // Fecha sidebar no mobile
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
            }
        });
    });

    // ============================================
    // Toggle Sidebar (Desktop)
    // ============================================
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }

    // ============================================
    // Toggle Sidebar (Mobile)
    // ============================================
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // ============================================
    // Logout
    // ============================================
    btnLogout.addEventListener('click', async function() {
        const confirmLogout = confirm('Deseja realmente sair do sistema?');
        
        if (confirmLogout) {
            const result = await authService.logout();
            
            if (result.success) {
                window.location.href = 'index.html';
            } else {
                alert('Erro ao fazer logout. Tente novamente.');
            }
        }
    });

    // ============================================
    // Funções Auxiliares
    // ============================================
    function formatDate(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'Agora mesmo';
        if (minutes < 60) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
        if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
        if (days < 7) return `${days} dia${days > 1 ? 's' : ''} atrás`;
        
        return date.toLocaleDateString('pt-BR');
    }

    function getActivityIcon(type) {
        const icons = {
            'user_created': 'fa-user-plus',
            'user_updated': 'fa-user-edit',
            'user_deleted': 'fa-user-times',
            'login': 'fa-sign-in-alt',
            'logout': 'fa-sign-out-alt',
            'turma_created': 'fa-door-open',
            'default': 'fa-circle'
        };
        
        return icons[type] || icons.default;
    }

    function getNotificationIcon(type) {
        const icons = {
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'success': 'fa-check-circle',
            'error': 'fa-times-circle',
            'default': 'fa-bell'
        };
        
        return icons[type] || icons.default;
    }

    // ============================================
    // Inicialização
    // ============================================
    await loadUserData();
    await loadStatistics();
    await loadRecentActivities();
    await loadNotifications();

    // Atualiza estatísticas a cada 30 segundos
    setInterval(loadStatistics, 30000);
});
