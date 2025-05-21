// static/js/game.js

document.addEventListener('DOMContentLoaded', function() {
    // Create floating bubbles
    function createBubbles() {
        const container = document.body;
        const colors = ['#ff9a9e', '#a1c4fd', '#96e6a1', '#fbc2eb', '#84fab0'];
        
        for (let i = 0; i < 15; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            
            // Random properties
            const size = Math.random() * 80 + 20; // 20-100px
            const left = Math.random() * 100; // 0-100%
            const duration = Math.random() * 20 + 10; // 10-30s
            const delay = Math.random() * 10; // 0-10s
            const colorIndex = Math.floor(Math.random() * colors.length);
            
            // Apply styles
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            bubble.style.left = `${left}%`;
            bubble.style.animationDuration = `${duration}s`;
            bubble.style.animationDelay = `${delay}s`;
            bubble.style.boxShadow = `0 0 10px ${colors[colorIndex]}`;
            
            container.appendChild(bubble);
        }
    }
    
    // Call the function to create bubbles
    createBubbles();

    // Function to create confetti effect on success
function createConfetti() {
    const container = document.body;
    const colors = ['#ff9a9e', '#a1c4fd', '#96e6a1', '#fbc2eb', '#84fab0'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '1000';
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.top = '-10px';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        confetti.style.pointerEvents = 'none';
        
        // Animation properties
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Add this CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes confettiFall {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    100% {
        transform: translateY(100vh) rotate(720deg);
    }
}`;
document.head.appendChild(styleSheet);

    // Game variables
    let attempts = 0;
    let score = 0;
    let currentPassword = "";
    
    // DOM elements
    const profileName = document.getElementById('profile-name');
    const profileBirthday = document.getElementById('profile-birthday');
    const profilePet = document.getElementById('profile-pet');
    const profileFood = document.getElementById('profile-food');
    const profileHobby = document.getElementById('profile-hobby');
    const profileHouse = document.getElementById('profile-house');
    const passwordInput = document.getElementById('password-input');
    const checkBtn = document.getElementById('check-btn');
    const feedbackDiv = document.getElementById('feedback');
    const newProfileBtn = document.getElementById('new-profile-btn');
    const attemptCount = document.getElementById('attempt-count');
    const scoreDisplay = document.getElementById('score');
    const strengthMeter = document.getElementById('strength-meter');
    const lessonText = document.getElementById('lesson-text');
    const teacherModeBtn = document.getElementById('teacher-mode-btn');
    const teacherInfo = document.getElementById('teacher-info');
    const currentPasswordDisplay = document.getElementById('current-password');
    
    // Array of educational messages about password security
    const passwordLessons = [
        "Never use your name in a password - it's one of the first things attackers try!",
        "Birthdays are easily found on social media - avoid using them in passwords.",
        "Pet names are commonly used in passwords but are easy to guess if you share pet photos online.",
        "House numbers might seem random, but they're visible to anyone who knows where you live.",
        "Adding numbers to the end of a word doesn't make a password secure.",
        "A strong password should be at least 12 characters long.",
        "Consider using a passphrase - a series of random words - instead of a single word password.",
        "The most secure passwords use a mix of uppercase, lowercase, numbers, and symbols.",
        "Using the same password on multiple sites is dangerous - if one site is breached, all your accounts are at risk.",
        "Password managers can generate and store strong, unique passwords for all your accounts."
    ];
    
    // Function to format the date
    function formatDate(month, day, year) {
        const months = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
        return `${months[month-1]} ${day}, ${year}`;
    }
    
    // Function to update the profile display
    function updateProfileDisplay(profile) {
        profileName.textContent = `${profile.first_name} ${profile.last_name}`;
        profileBirthday.textContent = formatDate(profile.birth_month, profile.birth_day, profile.birth_year);
        profilePet.textContent = `${profile.pet_type} named ${profile.pet_name}`;
        profileFood.textContent = profile.favorite_food;
        profileHobby.textContent = profile.hobby;
        profileHouse.textContent = profile.house_number;
        
        // Show a random educational message
        lessonText.textContent = passwordLessons[Math.floor(Math.random() * passwordLessons.length)];
    }
    
    // Function to load a new profile from the server
    function loadNewProfile() {
        fetch('/new_profile')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // For teacher/admin use
                    console.log("Password:", data.profile.real_password);
                    console.log("Current password: " + currentPassword);
                    currentPassword = data.real_password || "Unknown";

                    updateProfileDisplay(data.profile);
                    
                    // Reset game state
                    attempts = 0;
                    attemptCount.textContent = attempts;
                    passwordInput.value = "";
                    passwordInput.disabled = false;
                    checkBtn.disabled = false;
                    feedbackDiv.innerHTML = "";
                    
                    // Reset strength meter
                    strengthMeter.style.width = "0%";
                    strengthMeter.className = "strength-meter";

                    // Update the teacher mode display if it's visible
                if (teacherInfo && teacherInfo.style.display === 'block') {
                    currentPasswordDisplay.textContent = currentPassword;
                }
                }
            })
            .catch(error => console.error('Error loading profile:', error));
    }
    
    // Function to check password guess
function checkPassword() {
    const guess = passwordInput.value.trim();
    
    if (!guess) {
        feedbackDiv.innerHTML = '<span class="warning">Please enter a password guess</span>';
        return;
    }
    
    // Increment attempts
    attempts++;
    attemptCount.textContent = attempts;
    
    // Send the guess to the server for verification
    fetch('/check_guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: guess }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Correct guess
            feedbackDiv.innerHTML = `<span class="success">Correct! You cracked the password!</span>`;
            
            // Add celebration animation
            document.querySelectorAll('.game-container > div').forEach(div => {
                div.classList.add('celebrate');
                setTimeout(() => div.classList.remove('celebrate'), 500);
            });
            
            // Create confetti effect
            createConfetti();
            
            // Update score (more points for fewer attempts)
            const pointsEarned = Math.max(10 - attempts + 1, 1);
            score += pointsEarned;
            scoreDisplay.textContent = score;
            
            // Show educational feedback about why this password was weak
            feedbackDiv.innerHTML += `
                <div class="education-box">
                    <h3>Security Lesson:</h3>
                    <p>This password was easy to guess because it used personal information.</p>
                    <p>A stronger password would use random characters instead of personal details.</p>
                </div>
            `;
            
            // Disable input until new profile
            passwordInput.disabled = true;
            checkBtn.disabled = true;
        } else {
            // Incorrect guess
            let message = '<span class="failure">Incorrect password. Try again!</span>';
            
            // Add hint if available
            if (data.hint) {
                message += `<br><span class="hint">Hint: ${data.hint}</span>`;
            }
            
            feedbackDiv.innerHTML = message;
            
            // Update the strength meter based on attempts
            // This is just visual feedback - fewer attempts means the password is weaker
            const strengthPercentage = Math.min(attempts * 20, 100);
            strengthMeter.style.width = `${strengthPercentage}%`;
            
            if (strengthPercentage < 30) {
                strengthMeter.className = "strength-meter weak";
            } else if (strengthPercentage < 70) {
                strengthMeter.className = "strength-meter medium";
            } else {
                strengthMeter.className = "strength-meter strong";
            }
        }
    })
    .catch(error => console.error('Error checking password:', error));
}
    
    // Get password statistics for educational sidebar
    function loadPasswordStats() {
        fetch('/get_stats')
            .then(response => response.json())
            .then(data => {
                // Update common patterns list
                const patternsList = document.getElementById('common-patterns');
                patternsList.innerHTML = '';
                
                data.common_patterns.forEach(pattern => {
                    const li = document.createElement('li');
                    li.textContent = `${pattern.pattern} (${pattern.frequency})`;
                    patternsList.appendChild(li);
                });
                
                // Update password tips
                const tipsList = document.getElementById('password-tips');
                tipsList.innerHTML = '';
                
                data.password_strength_tips.forEach(tip => {
                    const li = document.createElement('li');
                    li.textContent = tip;
                    tipsList.appendChild(li);
                });
            })
            .catch(error => console.error('Error loading stats:', error));
    }
    
    // Event listeners
    checkBtn.addEventListener('click', checkPassword);
    newProfileBtn.addEventListener('click', loadNewProfile);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // Add teacher mode toggle functionality
if (teacherModeBtn) {
    teacherModeBtn.addEventListener('click', function() {
        // Simple toggle of teacher info display
        if (teacherInfo.style.display === 'none') {
            teacherInfo.style.display = 'block';
            currentPasswordDisplay.textContent = currentPassword;
        } else {
            teacherInfo.style.display = 'none';
        }
    });
}
    
    // Initialize the game
    loadNewProfile();
    loadPasswordStats();
});