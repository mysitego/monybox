// Store user data in localStorage
const userStore = {
    setUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    },
    getUser() {
        return JSON.parse(localStorage.getItem('user')) || null;
    },
    setGoal(amount) {
        localStorage.setItem('goalAmount', amount);
    },
    getGoal() {
        return parseFloat(localStorage.getItem('goalAmount')) || 0;
    },
    setCurrentAmount(amount) {
        localStorage.setItem('currentAmount', amount);
    },
    getCurrentAmount() {
        return parseFloat(localStorage.getItem('currentAmount')) || 0;
    },
    addAmount(amount) {
        const current = this.getCurrentAmount();
        this.setCurrentAmount(current + amount);
        return this.getCurrentAmount();
    }
};

// Splash Screen Logic
if (document.querySelector('#splashScreen')) {
    // Check if splash screen was shown before
    const splashShown = localStorage.getItem('splashShown');
    
    if (!splashShown) {
        // First time visit
        localStorage.setItem('splashShown', 'true');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    } else {
        // Not first time, redirect immediately
        window.location.href = 'login.html';
    }
}

// Handle login form
if (document.querySelector('#loginForm')) {
    const form = document.querySelector('#loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        button.textContent = 'جاري تسجيل الدخول...';
        
        setTimeout(() => {
            const email = form.querySelector('input[type="email"]').value;
            const remember = form.querySelector('input[type="checkbox"]').checked;
            
            if (remember) {
                localStorage.setItem('rememberMe', email);
            }
            
            const userData = {
                email: email,
                createdAt: new Date().toISOString()
            };
            
            userStore.setUser(userData);
            
            button.textContent = 'تم تسجيل الدخول بنجاح!';
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                window.location.href = 'goal-type.html';
            }, 1000);
        }, 1500);
    });
}

// Handle social account selection
function handleSocialAccountSelection(accountClass, provider) {
    document.querySelectorAll(`.${accountClass}`).forEach(account => {
        account.addEventListener('click', (e) => {
            const email = account.getAttribute('data-email');
            const name = account.querySelector('.font-bold').textContent;
            
            // Show loading state
            const container = account.closest('.border');
            container.style.backgroundColor = '#f3f4f6';
            
            setTimeout(() => {
                const userData = {
                    name: name,
                    email: email,
                    provider: provider,
                    createdAt: new Date().toISOString()
                };
                
                userStore.setUser(userData);
                window.location.href = 'goal-type.html';
            }, 1500);
        });
    });
}

// Initialize social login pages
if (document.querySelector('.google-account')) {
    handleSocialAccountSelection('google-account', 'google');
}

if (document.querySelector('.facebook-account')) {
    handleSocialAccountSelection('facebook-account', 'facebook');
}

if (document.querySelector('.apple-account')) {
    handleSocialAccountSelection('apple-account', 'apple');
}

// Goal Type Page Functionality
if (document.getElementById('goalTypePage')) {
    const setGoalTypeForm = document.getElementById('setGoalTypeForm');
    const addGoalTypeForm = document.getElementById('addGoalTypeForm');

    setGoalTypeForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const goalType = document.getElementById('goalTypeInput').value;
        
        // Save goal type to localStorage
        localStorage.setItem('goalType', goalType);
        
        // Redirect to goal page
        window.location.href = 'goal.html';
    });

    addGoalTypeForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Future functionality for multiple goals
        alert('تم حفظ الهدف الإضافي');
    });
}

// Handle goal page
if (document.querySelector('#goalPage')) {
    const goalForm = document.querySelector('#setGoalForm');
    const addAmountForm = document.querySelector('#addAmountForm');
    const currentAmountEl = document.querySelector('#currentAmount');
    const remainingAmountEl = document.querySelector('#remainingAmount');
    const progressBar = document.querySelector('#progressBar');
    
    // Initialize values
    function updateDisplay() {
        const currentAmount = userStore.getCurrentAmount();
        const goalAmount = userStore.getGoal();
        const remainingAmount = Math.max(0, goalAmount - currentAmount);
        const progress = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
        
        currentAmountEl.textContent = currentAmount.toFixed(2) + ' ريال';
        remainingAmountEl.textContent = remainingAmount.toFixed(2) + ' ريال';
        progressBar.style.setProperty('--progress', `${progress}%`);
    }
    
    // Set goal amount
    if (goalForm) {
        goalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(goalForm.querySelector('input[type="number"]').value);
            
            const button = goalForm.querySelector('button');
            button.textContent = 'جاري التحديد...';
            
            setTimeout(() => {
                userStore.setGoal(amount);
                button.textContent = 'تم التحديد';
                button.classList.add('bg-green-600');
                
                setTimeout(() => {
                    button.textContent = 'تحديد';
                    button.classList.remove('bg-green-600');
                    updateDisplay();
                }, 1000);
            }, 800);
        });
    }
    
    // Add amount
    if (addAmountForm) {
        addAmountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(addAmountForm.querySelector('input[type="number"]').value);
            
            const button = addAmountForm.querySelector('button');
            button.textContent = 'جاري الإضافة...';
            
            setTimeout(() => {
                userStore.addAmount(amount);
                button.textContent = 'تمت الإضافة';
                button.classList.add('bg-green-600');
                
                // Show success animation
                const successAnimation = document.createElement('div');
                successAnimation.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg';
                successAnimation.textContent = 'تمت إضافة المبلغ بنجاح!';
                document.body.appendChild(successAnimation);
                
                setTimeout(() => {
                    button.textContent = 'إضافة';
                    button.classList.remove('bg-green-600');
                    successAnimation.remove();
                    updateDisplay();
                    addAmountForm.reset();
                }, 1000);
            }, 800);
        });
    }
    
    // Initial display update
    updateDisplay();
}

// Add CSS for progress bar
const style = document.createElement('style');
style.textContent = `
    .progress-bar {
        background: #D3EDC5;
        position: relative;
    }
    .progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: var(--progress, 0%);
        background: #2C8C00;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);
