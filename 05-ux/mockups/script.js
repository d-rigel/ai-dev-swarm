/**
 * SRMS - School Result Management System
 * Interactive Mockup JavaScript
 * Vanilla JavaScript - No frameworks
 * Version: 1.0
 * Date: 2026-01-05
 */

// ===========================
// PAGE NAVIGATION
// ===========================

let currentPage = 'login';

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show requested page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
    
    // Update nav active state
    updateNavActive(pageId);
    
    // Special handling for grade entry page
    if (pageId === 'grade-entry') {
        populateGradeEntryTable();
    }
}

function updateNavActive(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageId) {
            link.classList.add('active');
        }
    });
}

// Handle nav link clicks
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            showPage(page);
        });
    });
});

// ===========================
// AUTHENTICATION
// ===========================

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
    }
    
    // Simulate login success
    showToast('Login successful! Welcome back.', 'success');
    
    // Show navigation
    document.getElementById('main-nav').style.display = 'flex';
    
    // Navigate to dashboard
    setTimeout(() => {
        showPage('dashboard');
    }, 500);
}

function quickLogin(role) {
    // Pre-fill form based on role
    const emailMap = {
        'teacher': 'teacher@school.com',
        'student': 'student@school.com',
        'admin': 'admin@school.com'
    };
    
    document.getElementById('email').value = emailMap[role];
    document.getElementById('password').value = 'password123';
    
    // Trigger login
    setTimeout(() => {
        document.getElementById('login-form').dispatchEvent(new Event('submit'));
    }, 300);
}

function logout() {
    // Hide navigation
    document.getElementById('main-nav').style.display = 'none';
    
    // Clear form
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    
    // Show toast
    showToast('Logged out successfully', 'info');
    
    // Go back to login
    showPage('login');
}

// ===========================
// TOAST NOTIFICATIONS
// ===========================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    const iconMap = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${iconMap[type]}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 5000);
}

// ===========================
// MODALS
// ===========================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Trap focus in modal
        trapFocus(modal);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
    
    // Focus first element
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

// ===========================
// GRADE ENTRY
// ===========================

const sampleStudents = [
    { id: 1, name: 'Adebayo, Chukwuemeka' },
    { id: 2, name: 'Okonkwo, Amara' },
    { id: 3, name: 'Mensah, Kwame' },
    { id: 4, name: 'Nkrumah, Ama' },
    { id: 5, name: 'Banda, Tendai' },
    { id: 6, name: 'Mwangi, Wanjiru' },
    { id: 7, name: 'Kamau, Njeri' },
    { id: 8, name: 'Otieno, Akinyi' },
    { id: 9, name: 'Okello, Akello' },
    { id: 10, name: 'Mutua, Mwende' },
];

function populateGradeEntryTable() {
    const tbody = document.getElementById('grade-entry-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sampleStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Simulate some students already have grades
        const hasGrades = index < 7; // First 7 students have grades
        const caScore = hasGrades ? Math.floor(Math.random() * 30) + 70 : '';
        const examScore = hasGrades ? Math.floor(Math.random() * 30) + 70 : '';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>
                <input 
                    type="number" 
                    class="form-input" 
                    style="width: 100%; padding: 8px; font-size: 14px;"
                    min="0" 
                    max="100" 
                    step="0.01"
                    value="${caScore}"
                    placeholder="0-100"
                    onchange="calculateFinalScore(this.parentElement.parentElement)"
                    aria-label="CA Score for ${student.name}"
                >
            </td>
            <td>
                <input 
                    type="number" 
                    class="form-input" 
                    style="width: 100%; padding: 8px; font-size: 14px;"
                    min="0" 
                    max="100" 
                    step="0.01"
                    value="${examScore}"
                    placeholder="0-100"
                    onchange="calculateFinalScore(this.parentElement.parentElement)"
                    aria-label="Exam Score for ${student.name}"
                >
            </td>
            <td class="final-score font-semibold">${hasGrades ? calculateScore(caScore, examScore) : '-'}</td>
            <td class="grade">${hasGrades ? getLetterGrade(calculateScore(caScore, examScore)) : '-'}</td>
            <td class="position text-gray-500">-</td>
        `;
        
        tbody.appendChild(row);
    });
}

function calculateScore(ca, exam) {
    if (!ca || !exam) return '-';
    
    const caNum = parseFloat(ca);
    const examNum = parseFloat(exam);
    
    if (isNaN(caNum) || isNaN(examNum)) return '-';
    if (caNum < 0 || caNum > 100 || examNum < 0 || examNum > 100) return '-';
    
    const finalScore = (caNum * 0.30) + (examNum * 0.70);
    return finalScore.toFixed(1);
}

function getLetterGrade(score) {
    if (score === '-') return '-';
    
    const numScore = parseFloat(score);
    
    if (numScore >= 75) return '<span class="badge badge-success">A</span>';
    if (numScore >= 70) return '<span class="badge badge-success">B</span>';
    if (numScore >= 65) return '<span class="badge badge-warning">C</span>';
    if (numScore >= 60) return '<span class="badge badge-warning">D</span>';
    return '<span class="badge badge-error">F</span>';
}

function calculateFinalScore(row) {
    const inputs = row.querySelectorAll('input[type="number"]');
    const caInput = inputs[0];
    const examInput = inputs[1];
    
    const ca = caInput.value;
    const exam = examInput.value;
    
    // Validate inputs
    if (ca && (parseFloat(ca) < 0 || parseFloat(ca) > 100)) {
        caInput.classList.add('error');
        showToast('CA score must be between 0 and 100', 'error');
        return;
    } else {
        caInput.classList.remove('error');
    }
    
    if (exam && (parseFloat(exam) < 0 || parseFloat(exam) > 100)) {
        examInput.classList.add('error');
        showToast('Exam score must be between 0 and 100', 'error');
        return;
    } else {
        examInput.classList.remove('error');
    }
    
    const finalScore = calculateScore(ca, exam);
    const grade = getLetterGrade(finalScore);
    
    // Update row
    row.querySelector('.final-score').textContent = finalScore;
    row.querySelector('.grade').innerHTML = grade;
    
    // Auto-save toast (optional)
    // showToast('Auto-saved', 'success');
}

function handleSubmit() {
    closeModal('submit-modal');
    showToast('Results submitted for approval!', 'success');
    
    setTimeout(() => {
        showPage('dashboard');
    }, 1500);
}

// ===========================
// SETTINGS - WEIGHTING
// ===========================

function updateWeighting() {
    const caWeight = document.getElementById('ca-weight').value;
    const examWeight = 100 - caWeight;
    
    document.getElementById('ca-percent').textContent = caWeight + '%';
    document.getElementById('exam-percent').textContent = examWeight + '%';
    document.getElementById('exam-weight').value = examWeight;
}

// ===========================
// ACCESSIBILITY - KEYBOARD SHORTCUTS
// ===========================

document.addEventListener('keydown', function(e) {
    // Alt + D = Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        showPage('dashboard');
    }
    
    // Alt + G = Grade Entry
    if (e.altKey && e.key === 'g') {
        e.preventDefault();
        showPage('grade-entry');
    }
    
    // Alt + R = Results
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        showPage('results');
    }
});

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Set initial page
    showPage('login');
    
    // Log welcome message
    console.log('%c SRMS - School Result Management System', 'color: #2563EB; font-size: 20px; font-weight: bold;');
    console.log('%c Interactive Mockup v1.0', 'color: #6B7280; font-size: 14px;');
    console.log('%c Keyboard Shortcuts:', 'color: #059669; font-weight: bold;');
    console.log('  Alt + D: Dashboard');
    console.log('  Alt + G: Grade Entry');
    console.log('  Alt + R: Results');
    console.log('  Escape: Close modal');
});

// ===========================
// RESPONSIVE HELPERS
// ===========================

// Check if mobile
function isMobile() {
    return window.innerWidth < 768;
}

// Update layout on resize
window.addEventListener('resize', function() {
    // Could add mobile-specific behavior here
});
