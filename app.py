from flask import Flask, render_template, request, jsonify, session
from models import Profile
from password_generator import generate_password  # We'll override this function
import secrets
import random

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # For session management

# Define patterns for password generation
PASSWORD_PATTERNS = [
    "name_birth_year",     # Pattern 1: name + birth year
    "pet_birth_month",     # Pattern 2: pet name + birth month
    "hobby_123",           # Pattern 3: favorite hobby + 123
    "food_pet",            # Pattern 4: favorite food + pet name
    "house_lastname"       # Pattern 5: house number + last name
]

# Override the password generator to use our specific patterns
def create_password(profile):
    """Create a password based on one of the predefined patterns using profile data"""
    # Choose a random pattern
    pattern = random.choice(PASSWORD_PATTERNS)
    
    # Store which pattern was used in the session
    session['password_pattern'] = pattern
    
    # Generate password based on the chosen pattern
    if pattern == "name_birth_year":
        # Pattern 1: name + birth year
        return profile.first_name.lower() + str(profile.birth_year)
    
    elif pattern == "pet_birth_month":
        # Pattern 2: pet name + birth month
        # Use month number if pet name isn't available
        pet = profile.pet_name if hasattr(profile, 'pet_name') and profile.pet_name else "pet"
        birth_month_num = getattr(profile, 'birth_month_num', random.randint(1, 12))
        return pet.lower() + str(birth_month_num).zfill(2)  # Zero-pad to ensure 2 digits
    
    elif pattern == "hobby_123":
        # Pattern 3: favorite hobby + 123
        hobby = profile.hobby if hasattr(profile, 'hobby') and profile.hobby else "hobby"
        return hobby.lower() + "123"
    
    elif pattern == "food_pet":
        # Pattern 4: favorite food + pet name
        food = profile.favorite_food if hasattr(profile, 'favorite_food') and profile.favorite_food else "pizza"
        pet = profile.pet_name if hasattr(profile, 'pet_name') and profile.pet_name else "max"
        return food.lower() + pet.lower()
    
    else:  # pattern == "house_lastname"
        # Pattern 5: house number + last name
        house_num = getattr(profile, 'house_number', random.randint(1, 999))
        return str(house_num) + profile.last_name.lower()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/new_profile', methods=['GET'])
def new_profile():
    # Generate a new fictional profile
    profile = Profile.generate_random()
    
    # Generate a password based on the profile using our pattern-based approach
    password = create_password(profile)
    
    # Store both password and profile in session for verification
    session['current_password'] = password
    session['current_profile'] = profile.to_dict()
    
    return jsonify({
        "profile": profile.to_dict(),
        "real_password": password,  # Include for educational purposes
        "password_pattern": session['password_pattern'],  # For debugging
        "success": True
    })

@app.route('/check_guess', methods=['POST'])
def check_guess():
    data = request.get_json()
    guess = data.get('guess', '')
    
    # Get the current password, profile, and pattern from session
    real_password = session.get('current_password', '')
    profile = session.get('current_profile', {})
    pattern = session.get('password_pattern', '')
    
    # Compare the guess with the real password
    success = (guess.lower() == real_password.lower())  # Case-insensitive comparison
    
    # Provide pattern-specific hint based on what pattern was used
    hint = ""
    if not success:
        # Give hints based on the specific pattern used
        if pattern == "name_birth_year":
            hint = f"Many people use their first name followed by their birth year. This person's name is {profile.get('first_name')} and they were born in {profile.get('birth_year')}."
            
        elif pattern == "pet_birth_month":
            hint = f"This password uses a pet's name followed by a birth month number. This person has a pet named {profile.get('pet_name')} and was born in month {profile.get('birth_month_num')}."
            
        elif pattern == "hobby_123":
            hint = f"People often use their hobby followed by simple numbers like '123'. This person enjoys {profile.get('hobby')}."
            
        elif pattern == "food_pet":
            hint = f"This password combines a favorite food with a pet name. This person loves {profile.get('favorite_food')} and has a pet called {profile.get('pet_name')}."
            
        elif pattern == "house_lastname":
            hint = f"Some passwords use house numbers followed by last names. This person lives at number {profile.get('house_number')} and their last name is {profile.get('last_name')}."
        
        # If the guess is way off in length, give additional hint
        if len(guess) < len(real_password) - 3:
            hint += " Your guess is too short."
        elif len(guess) > len(real_password) + 3:
            hint += " Your guess is too long."
    
    return jsonify({
        "success": success,
        "hint": hint if hint else None
    })

@app.route('/get_stats', methods=['GET'])
def get_stats():
    """Return game statistics for educational purposes"""
    return jsonify({
        "common_patterns": [
            {"pattern": "name + birth year", "frequency": "35%", "example": "john1990"},
            {"pattern": "pet name + birth month", "frequency": "25%", "example": "fluffy06"},
            {"pattern": "favorite hobby + numbers", "frequency": "20%", "example": "soccer123"},
            {"pattern": "favorite food + pet name", "frequency": "15%", "example": "pizzafluffy"},
            {"pattern": "house number + last name", "frequency": "5%", "example": "42smith"}
        ],
        "password_strength_tips": [
            "Use a combination of letters, numbers, and symbols",
            "Make passwords at least 12 characters long",
            "Don't use personal information like names or dates",
            "Use different passwords for different accounts",
            "Consider using a password manager"
        ]
    })

if __name__ == '__main__':
    app.run(debug=True)
