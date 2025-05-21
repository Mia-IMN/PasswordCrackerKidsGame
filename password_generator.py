import random

def generate_password(profile):
    """Generate very simple passwords that are easy for children to guess"""
    
    # Simple patterns for kid-friendly passwords
    patterns = [
        # Just the first name (e.g., "Alex")
        lambda p: p.first_name,
        
        # Just the pet name (e.g., "Max")
        lambda p: p.pet_name,
        
        # Favorite food (e.g., "Pizza")
        lambda p: p.favorite_food,
        
        # Hobby (e.g., "Soccer")
        lambda p: p.hobby,
        
        # First name + pet name initial (e.g., "AlexM")
        lambda p: p.first_name + p.pet_name[0],
        
        # First name + birth year last two digits (e.g., "Alex95")
        lambda p: p.first_name + str(p.birth_year)[-2:],
        
        # Pet name + 123 (e.g., "Max123")
        lambda p: p.pet_name + "123",
    ]
    
    # Choose a random pattern
    chosen_pattern = random.choice(patterns)
    
    # Generate the password using the chosen pattern
    return chosen_pattern(profile)