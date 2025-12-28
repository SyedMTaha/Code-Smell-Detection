# Test file with various code smells for detection

# 1. LONG METHOD - Method with too many lines
def process_complex_calculation(data, options, settings):
    result = []
    for i in range(len(data)):
        # Line 1
        temp_value = data[i] * 2
        # Line 2
        temp_value += 5
        # Line 3
        if temp_value > 10:
            # Line 4
            temp_value = temp_value / 2
            # Line 5
            temp_value = temp_value ** 2
            # Line 6
            if temp_value > 20:
                # Line 7
                temp_value = temp_value - 10
                # Line 8
                temp_value = temp_value * 3
                # Line 9
                if temp_value < 50:
                    # Line 10
                    temp_value = temp_value + 15
                    # Line 11
                    temp_value = temp_value / 3
                    # Line 12
                    temp_value = temp_value ** 0.5
                    # Line 13
                    if temp_value > 15:
                        # Line 14
                        temp_value = temp_value * 2
                        # Line 15
                        temp_value = temp_value - 5
                        # Line 16
                        temp_value = temp_value ** 2
                        # Line 17
                        if temp_value < 100:
                            # Line 18
                            temp_value = temp_value + 25
                            # Line 19
                            temp_value = temp_value / 5
                            # Line 20
                            temp_value = temp_value ** 3
                            # Line 21
                            if temp_value > 50:
                                # Line 22
                                temp_value = temp_value - 20
                                # Line 23
                                temp_value = temp_value * 4
                                # Line 24
                                temp_value = temp_value ** 0.5
                                # Line 25
                                if temp_value < 30:
                                    # Line 26
                                    temp_value = temp_value + 10
                                    # Line 27
                                    temp_value = temp_value / 2
                                    # Line 28
                                    temp_value = temp_value ** 2
                                    # Line 29
                                    if temp_value > 25:
                                        # Line 30
                                        temp_value = temp_value - 15
                                        # Line 31
                                        temp_value = temp_value * 6
                                        # Line 32
                                        temp_value = temp_value ** 0.3
                                        # Line 33
                                        if temp_value < 40:
                                            # Line 34
                                            temp_value = temp_value + 20
                                            # Line 35
                                            temp_value = temp_value / 4
                                            # Line 36
                                            temp_value = temp_value ** 2.5
        result.append(temp_value)
    return result

# 2. LONG PARAMETER LIST - Function with too many parameters
def calculate_metrics(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10):
    return param1 + param2 + param3 + param4 + param5 + param6 + param7 + param8 + param9 + param10

# 3. DATA CLUMPS - Same group of variables passed together
def create_user_data(name, email, phone, address, city, state, zip_code):
    user = {
        'name': name,
        'email': email,
        'phone': phone,
        'address': address,
        'city': city,
        'state': state,
        'zip_code': zip_code
    }
    return user

def validate_user_data(name, email, phone, address, city, state, zip_code):
    # Validation logic
    return True

# 4. SWITCH STATEMENTS - Multiple switch/case statements
def process_user_action(action_type, user_data):
    if action_type == "create":
        return "Creating user"
    elif action_type == "update":
        return "Updating user"
    elif action_type == "delete":
        return "Deleting user"
    elif action_type == "suspend":
        return "Suspending user"
    elif action_type == "activate":
        return "Activating user"
    elif action_type == "deactivate":
        return "Deactivating user"
    elif action_type == "reset_password":
        return "Resetting password"
    elif action_type == "change_email":
        return "Changing email"
    elif action_type == "change_phone":
        return "Changing phone"
    else:
        return "Unknown action"

# 5. DUPLICATE CODE - Similar code blocks
def calculate_tax_amount(amount, tax_rate):
    if amount > 1000:
        discount = 0.1
    else:
        discount = 0.05
    
    discounted_amount = amount * (1 - discount)
    tax = discounted_amount * tax_rate
    total = discounted_amount + tax
    return total

def calculate_shipping_cost(weight, distance):
    if weight > 10:
        discount = 0.1
    else:
        discount = 0.05
    
    discounted_weight = weight * (1 - discount)
    shipping_cost = discounted_weight * distance * 0.1
    total = discounted_weight + shipping_cost
    return total

# 6. FEATURE ENVY - Method that's too interested in another object's data
class Order:
    def __init__(self, customer_data):
        self.customer_data = customer_data
        self.items = []
    
    def get_customer_info(self):
        # This method is more interested in customer data than order data
        return self.customer_data['name'], self.customer_data['email'], self.customer_data['address']

# 7. MESSAGE CHAINS - Long method chains
def get_user_location(user):
    return user.get_profile().get_address().get_city().get_name()

# 8. LAZY CLASS - Class that doesn't do much
class SimpleContainer:
    def __init__(self):
        self.value = None
    
    def set_value(self, value):
        self.value = value
    
    def get_value(self):
        return self.value

# 9. DEAD CODE - Unused variable
def unused_variable_example():
    important_data = "This is used"
    unused_var = "This is not used"  # Dead code: unused variable
    return important_data

# 10. PRIMITIVE OBSESSION - Using primitives instead of objects
def create_coordinates():
    # Using multiple primitive values instead of creating a Point object
    x_coord = 10.5
    y_coord = 20.3
    z_coord = 5.7
    return x_coord, y_coord, z_coord

# 11. DIVERGENT CHANGE - Class with multiple responsibilities
class DataProcessor:
    def save_to_database(self, data):
        # Database logic
        pass
    
    def calculate_metrics(self, data):
        # Business logic
        pass
    
    def render_report(self, data):
        # UI logic
        pass

# 12. SHOTGUN SURGERY - Multiple scattered checks for the same condition
def process_status_1(status):
    if status == "active":
        return "Processing active"
    return "Not active"

def process_status_2(status):
    if status == "active":
        return "Handling active"
    return "Not active"

def process_status_3(status):
    if status == "active":
        return "Managing active"
    return "Not active"

def process_status_4(status):
    if status == "active":
        return "Controlling active"
    return "Not active"

def process_status_5(status):
    if status == "active":
        return "Monitoring active"
    return "Not active"

# 13. COMMENTS - Excessive comments indicating unclear code
def complex_function():
    # This function does something
    # We need to do this first
    value = 10  # Initialize value
    # Then we multiply by 2
    value = value * 2  # Multiply by 2
    # Add 5 to the result
    value = value + 5  # Add 5
    # Return the final value
    return value  # Return value

# 14. INAPPROPRIATE INTIMACY - Classes accessing each other's private members
class ParentClass:
    def __init__(self):
        self._private_data = "private"
        self.__internal_value = 42

class ChildClass:
    def access_parent_private(self, parent):
        # Accessing private member of another class
        return parent._private_data

# Code smells added to this Python file:
# 1. Long Method: process_complex_calculation function with >30 lines
# 2. Long Parameter List: calculate_metrics function with 10 parameters
# 3. Data Clumps: create_user_data and validate_user_data functions with same parameter groups
# 4. Switch Statements: process_user_action with multiple if-elif conditions
# 5. Duplicate Code: calculate_tax_amount and calculate_shipping_cost have similar logic
# 6. Feature Envy: Order.get_customer_info is more interested in customer data
# 7. Message Chains: get_user_location with long method chain
# 8. Lazy Class: SimpleContainer class with minimal functionality
# 9. Dead Code: unused_var in unused_variable_example function
# 10. Primitive Obsession: create_coordinates using multiple primitives instead of object
# 11. Divergent Change: DataProcessor with multiple responsibilities
# 12. Shotgun Surgery: Multiple functions with same status check pattern
# 13. Comments: Excessive comments in complex_function
# 14. Inappropriate Intimacy: ChildClass accessing ParentClass private members