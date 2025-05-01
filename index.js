
function resetErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
}


document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorElement = this.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.style.display = 'none';
        }
    });
});
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function redirectIfNotLoggedIn() {
    if (!getCurrentUser() && !window.location.pathname.includes('form.html') && !window.location.pathname.includes('form1.html')) {
        window.location.href = 'form.html';
    }
}


function setupRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
              
                document.getElementById('confirmPassword').style.border = '1px solid red';
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('iflixUsers')) || [];
            
            if (users.some(user => user.email === email)) {
               
                document.getElementById('email').style.border = '1px solid red';
                return;
            }
            
            users.push({
                username,
                email,
                password
            });
            
            localStorage.setItem('iflixUsers', JSON.stringify(users));
           
            window.location.href = 'form.html';
            if (password !== confirmPassword) {
                document.getElementById('confirmPassword').classList.add('error');
                document.getElementById('confirmPasswordError').style.display = 'block';
                return;
            }
        });
    }
}




function setupLoginPage() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const users = JSON.parse(localStorage.getItem('iflixUsers')) || [];
            const user = users.find(user => 
                (user.email === email || user.phone === email) && 
                user.password === password
            );
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
             
                window.location.href = 'home.html';
            } else {
             
                document.getElementById('email').style.border = '1px solid red';
                document.getElementById('password').style.border = '1px solid red';
            }
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'home.html';
            } else {
                document.getElementById('email').classList.add('error');
                document.getElementById('password').classList.add('error');
                document.getElementById('loginError').style.display = 'block';
            }
        });
    }
}




function setupHomePage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'form.html';
        return;
    }
    
    const usernameDisplay = document.getElementById('usernameDisplay');
    const profilePic = document.getElementById('profilePic');
    
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }
    
    if (profilePic) {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF5'];
        const initial = currentUser.username.charAt(0).toUpperCase();
        const color = colors[currentUser.username.length % colors.length];
        
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initial, 16, 16);
        
        profilePic.src = canvas.toDataURL();
    }
    
  
    const logoutBtn = document.querySelector('button[onclick="logout()"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'form.html';
        });
    }
}


window.logout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'form.html';
};


document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('form1.html')) {
        setupRegisterPage();
    } else if (window.location.pathname.includes('form.html')) {
        setupLoginPage();
    } else if (window.location.pathname.includes('home.html')) {
        setupHomePage();
    }
    
 
    redirectIfNotLoggedIn();
});