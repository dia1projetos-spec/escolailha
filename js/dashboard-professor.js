// ============================================
// DASHBOARD DO PROFESSOR
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Verifica autenticação e permissão
    const hasAccess = await authService.checkPageAccess(['professor']);
    
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
            userName.textContent = "Professor";
        }
    }

    // ============================================
    // Carregar Estatísticas do Professor
    // ============================================
    async function loadStatistics() {
        try {
            const user = authService.getCurrentUser();
            
            // Buscar turmas do professor
            const turmasSnapshot = await db.collection('turmas')
                .where('professorId', '==', user.uid)
                .get();
            document.getElementById('totalTurmas').textContent = turmasSnapshot.size;

            // Contar total de alunos nas turmas
            let totalAlunos = 0;
            turmasSnapshot.forEach(doc => {
                const turma = doc.data();
                if (turma.alunos) {
                    totalAlunos += turma.alunos.length;
                }
            });
            document.getElementById('totalAlunos').textContent = totalAlunos;

            // Buscar atividades ativas
            const atividadesSnapshot = await db.collection('atividades')
                .where('professorId', '==', user.uid)
                .where('status', '==', 'ativa')
                .get();
            document.getElementById('totalAtividades').textContent = atividadesSnapshot.size;

            // Buscar atividades pendentes de correção
            const pendentesSnapshot = await db.collection('atividades')
                .where('professorId', '==', user.uid)
                .where('pendingGrades', '>', 0)
                .get();
            document.getElementById('atividadesPendentes').textContent = pendentesSnapshot.size;

        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
            document.getElementById('totalTurmas').textContent = '0';
            document.getElementById('totalAlunos').textContent = '0';
            document.getElementById('totalAtividades').textContent = '0';
            document.getElementById('atividadesPendentes').textContent = '0';
        }
    }

    // ============================================
    // Carregar Agenda do Dia
    // ============================================
    async function loadTodaySchedule() {
        const scheduleContainer = document.getElementById('todaySchedule');
        
        try {
            const user = authService.getCurrentUser();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const scheduleSnapshot = await db.collection('schedule')
                .where('professorId', '==', user.uid)
                .where('date', '>=', today)
                .where('date', '<', tomorrow)
                .orderBy('date')
                .orderBy('startTime')
                .get();

            if (scheduleSnapshot.empty) {
                scheduleContainer.innerHTML = '<p class="info-text">Nenhuma aula agendada para hoje</p>';
                return;
            }

            let scheduleHTML = '';
            scheduleSnapshot.forEach(doc => {
                const schedule = doc.data();
                
                scheduleHTML += `
                    <div class="schedule-item">
                        <div class="schedule-time">
                            <i class="fas fa-clock"></i>
                            ${schedule.startTime} - ${schedule.endTime}
                        </div>
                        <div class="schedule-details">
                            <strong>${schedule.subject}</strong> - ${schedule.turma}
                            <br>
                            <small>${schedule.room || 'Sala a definir'}</small>
                        </div>
                    </div>
                `;
            });

            scheduleContainer.innerHTML = scheduleHTML;

        } catch (error) {
            console.error("Erro ao carregar agenda:", error);
            scheduleContainer.innerHTML = '<p class="info-text">Erro ao carregar agenda</p>';
        }
    }

    // ============================================
    // Carregar Próximos Prazos
    // ============================================
    async function loadUpcomingDeadlines() {
        const deadlinesContainer = document.getElementById('upcomingDeadlines');
        
        try {
            const user = authService.getCurrentUser();
            const today = new Date();

            const deadlinesSnapshot = await db.collection('atividades')
                .where('professorId', '==', user.uid)
                .where('deadline', '>=', today)
                .orderBy('deadline')
                .limit(5)
                .get();

            if (deadlinesSnapshot.empty) {
                deadlinesContainer.innerHTML = '<p class="info-text">Nenhum prazo próximo</p>';
                return;
            }

            let deadlinesHTML = '';
            deadlinesSnapshot.forEach(doc => {
                const atividade = doc.data();
                const deadline = atividade.deadline.toDate();
                const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                
                let urgencyClass = '';
                if (daysUntil <= 2) urgencyClass = 'urgent';
                else if (daysUntil <= 7) urgencyClass = 'warning';

                deadlinesHTML += `
                    <div class="deadline-item ${urgencyClass}">
                        <div class="deadline-info">
                            <strong>${atividade.title}</strong>
                            <br>
                            <small>${atividade.turma}</small>
                        </div>
                        <div class="deadline-date">
                            <i class="fas fa-calendar"></i>
                            ${deadline.toLocaleDateString('pt-BR')}
                            <br>
                            <small>${daysUntil} dia${daysUntil > 1 ? 's' : ''}</small>
                        </div>
                    </div>
                `;
            });

            deadlinesContainer.innerHTML = deadlinesHTML;

        } catch (error) {
            console.error("Erro ao carregar prazos:", error);
            deadlinesContainer.innerHTML = '<p class="info-text">Erro ao carregar prazos</p>';
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
    // Inicialização
    // ============================================
    await loadUserData();
    await loadStatistics();
    await loadTodaySchedule();
    await loadUpcomingDeadlines();

    // Atualiza dados a cada 30 segundos
    setInterval(loadStatistics, 30000);
});
