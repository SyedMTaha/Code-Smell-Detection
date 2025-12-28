// Test file with various code smells for detection

// 1. LONG METHOD - Function with too many lines
function processComplexCalculation(data, options, settings) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        // Line 1
        let tempValue = data[i] * 2;
        // Line 2
        tempValue += 5;
        // Line 3
        if (tempValue > 10) {
            // Line 4
            tempValue = tempValue / 2;
            // Line 5
            tempValue = tempValue ** 2;
            // Line 6
            if (tempValue > 20) {
                // Line 7
                tempValue = tempValue - 10;
                // Line 8
                tempValue = tempValue * 3;
                // Line 9
                if (tempValue < 50) {
                    // Line 10
                    tempValue = tempValue + 15;
                    // Line 11
                    tempValue = tempValue / 3;
                    // Line 12
                    tempValue = tempValue ** 0.5;
                    // Line 13
                    if (tempValue > 15) {
                        // Line 14
                        tempValue = tempValue * 2;
                        // Line 15
                        tempValue = tempValue - 5;
                        // Line 16
                        tempValue = tempValue ** 2;
                        // Line 17
                        if (tempValue < 100) {
                            // Line 18
                            tempValue = tempValue + 25;
                            // Line 19
                            tempValue = tempValue / 5;
                            // Line 20
                            tempValue = tempValue ** 3;
                            // Line 21
                            if (tempValue > 50) {
                                // Line 22
                                tempValue = tempValue - 20;
                                // Line 23
                                tempValue = tempValue * 4;
                                // Line 24
                                tempValue = tempValue ** 0.5;
                                // Line 25
                                if (tempValue < 30) {
                                    // Line 26
                                    tempValue = tempValue + 10;
                                    // Line 27
                                    tempValue = tempValue / 2;
                                    // Line 28
                                    tempValue = tempValue ** 2;
                                    // Line 29
                                    if (tempValue > 25) {
                                        // Line 30
                                        tempValue = tempValue - 15;
                                        // Line 31
                                        tempValue = tempValue * 6;
                                        // Line 32
                                        tempValue = tempValue ** 0.3;
                                        // Line 33
                                        if (tempValue < 40) {
                                            // Line 34
                                            tempValue = tempValue + 20;
                                            // Line 35
                                            tempValue = tempValue / 4;
                                            // Line 36
                                            tempValue = tempValue ** 2.5;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        result.push(tempValue);
    }
    return result;
}

// 2. LONG PARAMETER LIST - Function with too many parameters
function calculateMetrics(param1, param2, param3, param4, param5, param6, param7, param8, param9, param10) {
    return param1 + param2 + param3 + param4 + param5 + param6 + param7 + param8 + param9 + param10;
}

// 3. DATA CLUMPS - Same group of variables passed together
function createUserObject(name, email, phone, address, city, state, zipCode) {
    return {
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        zipCode: zipCode
    };
}

function validateUserData(name, email, phone, address, city, state, zipCode) {
    // Validation logic
    return true;
}

// 4. SWITCH STATEMENTS - Multiple switch/case statements
function processUserAction(actionType, userData) {
    switch (actionType) {
        case "create":
            return "Creating user";
        case "update":
            return "Updating user";
        case "delete":
            return "Deleting user";
        case "suspend":
            return "Suspending user";
        case "activate":
            return "Activating user";
        case "deactivate":
            return "Deactivating user";
        case "reset_password":
            return "Resetting password";
        case "change_email":
            return "Changing email";
        case "change_phone":
            return "Changing phone";
        default:
            return "Unknown action";
    }
}

// 5. DUPLICATE CODE - Similar code blocks
function calculateTaxAmount(amount, taxRate) {
    let discount;
    if (amount > 1000) {
        discount = 0.1;
    } else {
        discount = 0.05;
    }
    
    const discountedAmount = amount * (1 - discount);
    const tax = discountedAmount * taxRate;
    const total = discountedAmount + tax;
    return total;
}

function calculateShippingCost(weight, distance) {
    let discount;
    if (weight > 10) {
        discount = 0.1;
    } else {
        discount = 0.05;
    }
    
    const discountedWeight = weight * (1 - discount);
    const shippingCost = discountedWeight * distance * 0.1;
    const total = discountedWeight + shippingCost;
    return total;
}

// 6. FEATURE ENVY - Method that's too interested in another object's data
class Order {
    constructor(customerData) {
        this.customerData = customerData;
        this.items = [];
    }
    
    getCustomerInfo() {
        // This method is more interested in customer data than order data
        return [this.customerData.name, this.customerData.email, this.customerData.address];
    }
}

// 7. MESSAGE CHAINS - Long method chains
function getUserLocation(user) {
    return user.getProfile().getAddress().getCity().getName();
}

// 8. LAZY CLASS - Class that doesn't do much
class SimpleContainer {
    constructor() {
        this.value = null;
    }
    
    setValue(value) {
        this.value = value;
    }
    
    getValue() {
        return this.value;
    }
}

// 9. DEAD CODE - Unused variable
function unusedVariableExample() {
    const importantData = "This is used";
    const unusedVar = "This is not used"; // Dead code: unused variable
    return importantData;
}

// 10. PRIMITIVE OBSESSION - Using primitives instead of objects
function createCoordinates() {
    // Using multiple primitive values instead of creating a Point object
    const xCoord = 10.5;
    const yCoord = 20.3;
    const zCoord = 5.7;
    return {x: xCoord, y: yCoord, z: zCoord};
}

// 11. DIVERGENT CHANGE - Class with multiple responsibilities
class DataProcessor {
    saveToDatabase(data) {
        // Database logic
    }
    
    calculateMetrics(data) {
        // Business logic
    }
    
    renderReport(data) {
        // UI logic
    }
}

// 12. SHOTGUN SURGERY - Multiple scattered checks for the same condition
function processStatus1(status) {
    if (status === "active") {
        return "Processing active";
    }
    return "Not active";
}

function processStatus2(status) {
    if (status === "active") {
        return "Handling active";
    }
    return "Not active";
}

function processStatus3(status) {
    if (status === "active") {
        return "Managing active";
    }
    return "Not active";
}

function processStatus4(status) {
    if (status === "active") {
        return "Controlling active";
    }
    return "Not active";
}

function processStatus5(status) {
    if (status === "active") {
        return "Monitoring active";
    }
    return "Not active";
}

// 13. COMMENTS - Excessive comments indicating unclear code
function complexFunction() {
    // This function does something
    // We need to do this first
    let value = 10; // Initialize value
    // Then we multiply by 2
    value = value * 2; // Multiply by 2
    // Add 5 to the result
    value = value + 5; // Add 5
    // Return the final value
    return value; // Return value
}

// 14. LARGE CLASS - Class with too many methods and properties
class LargeClass {
    constructor() {
        this.prop1 = "value1";
        this.prop2 = "value2";
        this.prop3 = "value3";
        this.prop4 = "value4";
        this.prop5 = "value5";
        this.prop6 = "value6";
        this.prop7 = "value7";
        this.prop8 = "value8";
        this.prop9 = "value9";
        this.prop10 = "value10";
        this.prop11 = "value11";
        this.prop12 = "value12";
        this.prop13 = "value13";
        this.prop14 = "value14";
        this.prop15 = "value15";
        this.prop16 = "value16";
        this.prop17 = "value17";
        this.prop18 = "value18";
        this.prop19 = "value19";
        this.prop20 = "value20";
        this.prop21 = "value21";
        this.prop22 = "value22";
        this.prop23 = "value23";
        this.prop24 = "value24";
        this.prop25 = "value25";
        this.prop26 = "value26";
        this.prop27 = "value27";
        this.prop28 = "value28";
        this.prop29 = "value29";
        this.prop30 = "value30";
    }
    
    method1() { return this.prop1; }
    method2() { return this.prop2; }
    method3() { return this.prop3; }
    method4() { return this.prop4; }
    method5() { return this.prop5; }
    method6() { return this.prop6; }
    method7() { return this.prop7; }
    method8() { return this.prop8; }
    method9() { return this.prop9; }
    method10() { return this.prop10; }
    method11() { return this.prop11; }
    method12() { return this.prop12; }
    method13() { return this.prop13; }
    method14() { return this.prop14; }
    method15() { return this.prop15; }
    method16() { return this.prop16; }
    method17() { return this.prop17; }
    method18() { return this.prop18; }
    method19() { return this.prop19; }
    method20() { return this.prop20; }
    method21() { return this.prop21; }
    method22() { return this.prop22; }
    method23() { return this.prop23; }
    method24() { return this.prop24; }
    method25() { return this.prop25; }
    method26() { return this.prop26; }
    method27() { return this.prop27; }
    method28() { return this.prop28; }
    method29() { return this.prop29; }
    method30() { return this.prop30; }
}

// 15. SPECULATIVE GENERITY - Unused parameters
function functionWithUnusedParam(param1, param2, unusedParam) {
    return param1 + param2; // unusedParam is never used
}

// 16. TEMPORARY FIELD - Field that's only used in certain conditions
class TemporaryFieldExample {
    constructor() {
        this.temporaryValue = null; // Only used in specific scenarios
    }
    
    processWithCondition(condition) {
        if (condition) {
            this.temporaryValue = "used here";
            return this.temporaryValue;
        }
        return "not using temporary field";
    }
}

// Code smells added to this JavaScript file:
// 1. Long Method: processComplexCalculation function with >30 lines
// 2. Long Parameter List: calculateMetrics function with 10 parameters
// 3. Data Clumps: createUserObject and validateUserData functions with same parameter groups
// 4. Switch Statements: processUserAction with multiple switch cases
// 5. Duplicate Code: calculateTaxAmount and calculateShippingCost have similar logic
// 6. Feature Envy: Order.getCustomerInfo is more interested in customer data
// 7. Message Chains: getUserLocation with long method chain
// 8. Lazy Class: SimpleContainer class with minimal functionality
// 9. Dead Code: unusedVar in unusedVariableExample function
// 10. Primitive Obsession: createCoordinates using multiple primitives instead of object
// 11. Divergent Change: DataProcessor with multiple responsibilities
// 12. Shotgun Surgery: Multiple functions with same status check pattern
// 13. Comments: Excessive comments in complexFunction
// 14. Large Class: LargeClass with many properties and methods (>200 lines when considering methods)
// 15. Speculative Generality: functionWithUnusedParam with unused parameter
// 16. Temporary Field: TemporaryFieldExample with field only used in specific conditions