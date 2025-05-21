class Profile:
    """Model representing a fictional user profile"""
    
    def __init__(self, first_name, last_name, birth_year, birth_month, birth_day,
                 pet_type, pet_name, favorite_food, hobby, house_number):
        self.first_name = first_name
        self.last_name = last_name
        self.birth_year = birth_year
        self.birth_month = birth_month
        self.birth_day = birth_day
        self.pet_type = pet_type
        self.pet_name = pet_name
        self.favorite_food = favorite_food
        self.hobby = hobby
        self.house_number = house_number
    
    def to_dict(self):
        """Convert profile to dictionary for JSON serialization"""
        return {
            "first_name": self.first_name,
            "last_name": self.last_name,
            "birth_year": self.birth_year,
            "birth_month": self.birth_month,
            "birth_day": self.birth_day,
            "pet_type": self.pet_type,
            "pet_name": self.pet_name,
            "favorite_food": self.favorite_food,
            "hobby": self.hobby,
            "house_number": self.house_number
        }
    
    @classmethod
    def generate_random(cls):
        """Generate a random profile"""
        import random
        
        first_names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Skyler", "Jamie", 
                       "Quinn", "Avery", "Parker", "Blake", "Reese", "Dakota", "Harper"]
        last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", 
                      "Garcia", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]
        pet_types = ["dog", "cat", "hamster", "fish", "bird", "rabbit", "turtle"]
        pet_names = ["Buddy", "Max", "Charlie", "Lucy", "Bailey", "Daisy", "Rocky", "Luna", 
                     "Bella", "Bear", "Coco", "Oscar", "Milo", "Ruby", "Shadow"]
        foods = ["pizza", "chocolate", "sushi", "pasta", "tacos", "ice cream", "cookies", 
                "burgers", "cake", "sandwiches", "fries", "apples", "steak", "chicken", "salad"]
        hobbies = ["soccer", "reading", "music", "gaming", "drawing", "dancing", "swimming", 
                   "cooking", "hiking", "basketball", "photography", "running", "painting", "writing", "yoga"]
        
        return cls(
            first_name=random.choice(first_names),
            last_name=random.choice(last_names),
            birth_year=random.randint(1970, 2010),
            birth_month=random.randint(1, 12),
            birth_day=random.randint(1, 28),
            pet_type=random.choice(pet_types),
            pet_name=random.choice(pet_names),
            favorite_food=random.choice(foods),
            hobby=random.choice(hobbies),
            house_number=random.randint(1, 999)
        )