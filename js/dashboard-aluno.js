// ============================================
// DASHBOARD DO ALUNO
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Verifica autenticação e permissão
    const hasAccess = await authService.checkPageAccess(['aluno']);
    
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
            userName.textContent = "Aluno";
        }
    }

    // ============================================
    // Carregar Estatísticas do Aluno
    // ============================================
    async function loadStatistics() {
        try {
            const user = authService.getCurrentUser();
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            // Buscar disciplinas da turma do aluno
            if (userData.class) {
                const disciplinasSnapshot = await db.collection('disciplinas')
                    .where('turma', '==', userData.class)
                    .get();
                document.getElementById('totalDisciplinas').textContent = disciplinasSnapshot.size;
            } else {
                document.getElementById('totalDisciplinas').textContent = '0';
            }

            // Buscar atividades pendentes
            const today = new Date();
            const pendentesSnapshot = await db.collection('submissions')
                .where('alunoId', '==', user.uid)
                .where('status', '==', 'pendente')
                .where('deadline', '>=', today)
                .get();
            document.getElementById('atividadesPendentes').textContent = pendentesSnapshot.size;

            // Buscar atividades concluídas
            const concluidasSnapshot = await db.collection('submissions')
                .where('alunoId', '==', user.uid)
                .where('status', '==', 'concluida')
                .get();
            document.getElementById('atividadesConcluidas').textContent = concluidasSnapshot.size;

            // Calcular média geral
            const notasSnapshot = await db.collection('grades')
                .where('alunoId', '==', user.uid)
                .get();

            if (!notasSnapshot.empty) {
                let soma = 0;
                let count = 0;
                notasSnapshot.forEach(doc => {
                    const nota = doc.data();
                    if (nota.value !== null && nota.value !== undefined) {
                        soma += nota.value;
                        count++;
                    }
                });
                
                const media = count > 0 ? (soma / count).toFixed(1) : '-';
                document.getElementById('mediaGeral').textContent = media;
            } else {
                document.getElementById('mediaGeral').textContent = '-';
            }

        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
            document.getElementById('totalDisciplinas').textContent = '0';
            document.getElementById('atividadesPendentes').textContent = '0';
            document.getElementById('atividadesConcluidas').textContent = '0';
            document.getElementById('mediaGeral').textContent = '-';
        }
    }

    // ============================================
    // Carregar Próximas Atividades
    // ============================================
    async function loadUpcomingActivities() {
        const activitiesContainer = document.getElementById('upcomingActivities');
        
        try {
            const user = authService.getCurrentUser();
            const today = new Date();

            const activitiesSnapshot = await db.collection('atividades')
                .where('turma', '==', (await db.collection('users').doc(user.uid).get()).data().class)
                .where('deadline', '>=', today)
                .orderBy('deadline')
                .limit(5)
                .get();

            if (activitiesSnapshot.empty) {
                activitiesContainer.innerHTML = '<p class="info-text">Nenhuma atividade pendente</p>';
                return;
            }

            let activitiesHTML = '';
            activitiesSnapshot.forEach(doc => {
                const atividade = doc.data();
                const deadline = atividade.deadline.toDate();
                const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
                
                let urgencyClass = '';
                let urgencyText = '';
                if (daysUntil <= 1) {
                    urgencyClass = 'urgent';
                    urgencyText = 'Urgente!';
                } else if (daysUntil <= 3) {
                    urgencyClass = 'warning';
                    urgencyText = 'Próximo';
                }

                activitiesHTML += `
                    <div class="activity-item ${urgencyClass}">
                        <div class="activity-header">
                            <strong>${atividade.title}</strong>
                            ${urgencyText ? `<span class="badge ${urgencyClass}">${urgencyText}</span>` : ''}
                        </div>
                        <div class="activity-info">
                            <span><i class="fas fa-book"></i> ${atividade.subject}</span>
                            <span><i class="fas fa-calendar"></i> ${deadline.toLocaleDateString('pt-BR')}</span>
                            <span><i class="fas fa-clock"></i> ${daysUntil} dia${daysUntil > 1 ? 's' : ''}</span>
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
    // Carregar Agenda da Semana
    // ============================================
    async function loadWeekSchedule() {
        const scheduleContainer = document.getElementById('weekSchedule');
        
        try {
            const user = authService.getCurrentUser();
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            if (!userData.class) {
                scheduleContainer.innerHTML = '<p class="info-text">Turma não definida</p>';
                return;
            }

            const today = new Date();
            const dayOfWeek = today.getDay();
            const monday = new Date(today);
            monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
            monday.setHours(0, 0, 0, 0);

            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 7);

            const scheduleSnapshot = await db.collection('schedule')
                .where('turma', '==', userData.class)
                .where('date', '>=', monday)
                .where('date', '<', sunday)
                .orderBy('date')
                .orderBy('startTime')
                .get();

            if (scheduleSnapshot.empty) {
                scheduleContainer.innerHTML = '<p class="info-text">Nenhuma aula agendada esta semana</p>';
                return;
            }

            let scheduleHTML = '';
            let currentDate = null;

            scheduleSnapshot.forEach(doc => {
                const schedule = doc.data();
                const scheduleDate = schedule.date.toDate();
                const dateStr = scheduleDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

                if (currentDate !== dateStr) {
                    if (currentDate !== null) {
                        scheduleHTML += '</div>';
                    }
                    scheduleHTML += `<div class="day-schedule"><h4>${dateStr}</h4>`;
                    currentDate = dateStr;
                }

                scheduleHTML += `
                    <div class="schedule-item">
                        <span class="time">${schedule.startTime} - ${schedule.endTime}</span>
                        <span class="subject">${schedule.subject}</span>
                        <span class="teacher">${schedule.professorName || 'Professor'}</span>
                    </div>
                `;
            });

            if (currentDate !== null) {
                scheduleHTML += '</div>';
            }

            scheduleContainer.innerHTML = scheduleHTML;

        } catch (error) {
            console.error("Erro ao carregar agenda:", error);
            scheduleContainer.innerHTML = '<p class="info-text">Erro ao carregar agenda</p>';
        }
    }

    // ============================================
    // Carregar Avisos
    // ============================================
    async function loadNotices() {
        const noticesContainer = document.getElementById('notices');
        
        try {
            const user = authService.getCurrentUser();
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.data();

            const noticesSnapshot = await db.collection('notices')
                .where('audience', 'in', ['all', 'alunos', userData.class])
                .orderBy('createdAt', 'desc')
                .limit(5)
                .get();

            if (noticesSnapshot.empty) {
                noticesContainer.innerHTML = '<p class="info-text">Nenhum aviso no momento</p>';
                return;
            }

            let noticesHTML = '';
            noticesSnapshot.forEach(doc => {
                const notice = doc.data();
                const date = notice.createdAt ? notice.createdAt.toDate() : new Date();
                
                noticesHTML += `
                    <div class="notice-item">
                        <div class="notice-header">
                            <i class="fas fa-bullhorn"></i>
                            <strong>${notice.title}</strong>
                            <span class="notice-date">${date.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p class="notice-content">${notice.content}</p>
                    </div>
                `;
            });

            noticesContainer.innerHTML = noticesHTML;

        } catch (error) {
            console.error("Erro ao carregar avisos:", error);
            noticesContainer.innerHTML = '<p class="info-text">Erro ao carregar avisos</p>';
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
    await loadUpcomingActivities();
    await loadWeekSchedule();
    await loadNotices();

    // Atualiza dados a cada 30 segundos
    setInterval(loadStatistics, 30000);
});
