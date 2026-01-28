# JavaScript Complete Roadmap & Practice Guide

A comprehensive guide to learning JavaScript from beginner to advanced, with 80+ practice problems and solutions.

---

## Table of Contents

- [Phase 1: Fundamentals](#phase-1-fundamentals)
- [Phase 2: Data Structures](#phase-2-data-structures)
- [Phase 3: Intermediate Concepts](#phase-3-intermediate-concepts)
- [Phase 4: Asynchronous JavaScript](#phase-4-asynchronous-javascript)
- [Phase 5: DOM Manipulation & Events](#phase-5-dom-manipulation--events)
- [Phase 6: Modern JavaScript (ES6+)](#phase-6-modern-javascript-es6)
- [Phase 7: Advanced Concepts](#phase-7-advanced-concepts)
- [Phase 8: Web APIs & Browser](#phase-8-web-apis--browser)
- [Phase 9: Testing](#phase-9-testing)
- [Phase 10: Real-World Projects](#phase-10-real-world-projects)
- [Coding Challenges](#coding-challenges)
- [Learning Resources](#learning-resources)
- [Tips for Success](#tips-for-success)

---

## Phase 1: Fundamentals

### 1.1 Variables & Data Types

**Concepts:**
- `var`, `let`, `const`
- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- Reference types: `object`, `array`, `function`

<details>
<summary><strong>Issue #1: Variable Declaration</strong></summary>

Create variables using let and const to store your name, age, and student status.

```javascript
const name = "John";
let age = 25;
const isStudent = true;
console.log(name, age, isStudent);
```
</details>

<details>
<summary><strong>Issue #2: Type Checking</strong></summary>

Write code that checks the type of different values using typeof.

```javascript
console.log(typeof "Hello");      // string
console.log(typeof 42);           // number
console.log(typeof true);         // boolean
console.log(typeof undefined);    // undefined
console.log(typeof null);         // object (JS quirk)
console.log(typeof {});           // object
console.log(typeof []);           // object
```
</details>

<details>
<summary><strong>Issue #3: Type Conversion</strong></summary>

Convert string "123" to number, number 456 to string.

```javascript
let str = "123";
let num = Number(str);        // or parseInt(str) or +str
console.log(num, typeof num); // 123 number

let num2 = 456;
let str2 = String(num2);      // or num2.toString() or num2 + ""
console.log(str2, typeof str2); // "456" string
```
</details>

---

### 1.2 Operators

**Concepts:**
- Arithmetic: `+`, `-`, `*`, `/`, `%`, `**`
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`
- Comparison: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- Logical: `&&`, `||`, `!`
- Ternary: `condition ? value1 : value2`

<details>
<summary><strong>Issue #4: Calculator Operations</strong></summary>

Create variables a=10, b=3. Calculate sum, difference, product, quotient, remainder, and power.

```javascript
let a = 10, b = 3;
console.log("Sum:", a + b);        // 13
console.log("Difference:", a - b); // 7
console.log("Product:", a * b);    // 30
console.log("Quotient:", a / b);   // 3.333...
console.log("Remainder:", a % b);  // 1
console.log("Power:", a ** b);     // 1000
```
</details>

<details>
<summary><strong>Issue #5: Comparison Practice</strong></summary>

Compare values and understand `==` vs `===`.

```javascript
console.log(5 == "5");   // true (loose equality)
console.log(5 === "5");  // false (strict equality)
console.log(null == undefined);  // true
console.log(null === undefined); // false
```
</details>

<details>
<summary><strong>Issue #6: Logical Operators</strong></summary>

Check if a number is between 1 and 100 (inclusive).

```javascript
let num = 50;
let isInRange = num >= 1 && num <= 100;
console.log(isInRange); // true
```
</details>

---

### 1.3 Control Flow

**Concepts:**
- `if`, `else if`, `else`
- `switch` statement
- `for`, `while`, `do...while` loops
- `break`, `continue`

<details>
<summary><strong>Issue #7: Grade Calculator</strong></summary>

Write a program that takes a score (0-100) and prints the grade.

```javascript
let score = 85;
let grade;

if (score >= 90) {
    grade = "A";
} else if (score >= 80) {
    grade = "B";
} else if (score >= 70) {
    grade = "C";
} else if (score >= 60) {
    grade = "D";
} else {
    grade = "F";
}
console.log("Grade:", grade);
```
</details>

<details>
<summary><strong>Issue #8: FizzBuzz</strong></summary>

Print numbers 1-100. For multiples of 3 print "Fizz", for 5 print "Buzz", for both print "FizzBuzz".

```javascript
for (let i = 1; i <= 100; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
        console.log("FizzBuzz");
    } else if (i % 3 === 0) {
        console.log("Fizz");
    } else if (i % 5 === 0) {
        console.log("Buzz");
    } else {
        console.log(i);
    }
}
```
</details>

<details>
<summary><strong>Issue #9: Sum of Numbers</strong></summary>

Calculate sum of all numbers from 1 to 100 using a while loop.

```javascript
let sum = 0;
let i = 1;
while (i <= 100) {
    sum += i;
    i++;
}
console.log("Sum:", sum); // 5050
```
</details>

<details>
<summary><strong>Issue #10: Day of Week (Switch)</strong></summary>

Use switch to print day name based on number (1=Monday, 7=Sunday).

```javascript
let dayNum = 3;
let dayName;

switch (dayNum) {
    case 1: dayName = "Monday"; break;
    case 2: dayName = "Tuesday"; break;
    case 3: dayName = "Wednesday"; break;
    case 4: dayName = "Thursday"; break;
    case 5: dayName = "Friday"; break;
    case 6: dayName = "Saturday"; break;
    case 7: dayName = "Sunday"; break;
    default: dayName = "Invalid day";
}
console.log(dayName);
```
</details>

---

### 1.4 Functions

**Concepts:**
- Function declaration
- Function expression
- Arrow functions
- Parameters & arguments
- Return values
- Default parameters
- Rest parameters

<details>
<summary><strong>Issue #11: Basic Function</strong></summary>

Create a function that takes two numbers and returns their sum.

```javascript
// Function declaration
function add(a, b) {
    return a + b;
}

// Function expression
const subtract = function(a, b) {
    return a - b;
};

// Arrow function
const multiply = (a, b) => a * b;

console.log(add(5, 3));      // 8
console.log(subtract(5, 3)); // 2
console.log(multiply(5, 3)); // 15
```
</details>

<details>
<summary><strong>Issue #12: Factorial Function</strong></summary>

Create a function to calculate factorial of a number.

```javascript
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```
</details>

<details>
<summary><strong>Issue #13: Default Parameters</strong></summary>

Create a greeting function with default name "Guest".

```javascript
function greet(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greet());        // Hello, Guest!
console.log(greet("Alice")); // Hello, Alice!
```
</details>

<details>
<summary><strong>Issue #14: Rest Parameters</strong></summary>

Create a function that sums any number of arguments.

```javascript
function sumAll(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAll(1, 2, 3));       // 6
console.log(sumAll(1, 2, 3, 4, 5)); // 15
```
</details>

---

## Phase 2: Data Structures

### 2.1 Arrays

**Concepts:**
- Creating arrays
- Accessing elements
- Array methods: `push`, `pop`, `shift`, `unshift`, `splice`
- Iteration: `forEach`, `map`, `filter`, `reduce`, `find`, `some`, `every`
- Spread operator

<details>
<summary><strong>Issue #15: Array Basics</strong></summary>

Create an array of 5 fruits, add one to the end, remove one from the beginning.

```javascript
let fruits = ["apple", "banana", "orange", "grape", "mango"];
fruits.push("kiwi");     // Add to end
fruits.shift();          // Remove from beginning
let index = fruits.indexOf("banana");
console.log(fruits);     // ["banana", "orange", "grape", "mango", "kiwi"]
console.log(index);      // 0
```
</details>

<details>
<summary><strong>Issue #16: Array Map</strong></summary>

Double all numbers in an array [1, 2, 3, 4, 5].

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```
</details>

<details>
<summary><strong>Issue #17: Array Filter</strong></summary>

Filter out all even numbers from [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const oddNumbers = numbers.filter(num => num % 2 !== 0);
console.log(oddNumbers); // [1, 3, 5, 7, 9]
```
</details>

<details>
<summary><strong>Issue #18: Array Reduce</strong></summary>

Calculate the sum of all numbers in array [10, 20, 30, 40, 50].

```javascript
const numbers = [10, 20, 30, 40, 50];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum); // 150
```
</details>

<details>
<summary><strong>Issue #19: Find and FindIndex</strong></summary>

Find the first number greater than 25 in [10, 20, 30, 40, 50].

```javascript
const numbers = [10, 20, 30, 40, 50];
const found = numbers.find(num => num > 25);
const foundIndex = numbers.findIndex(num => num > 25);
console.log(found);      // 30
console.log(foundIndex); // 2
```
</details>

<details>
<summary><strong>Issue #20: Chaining Array Methods</strong></summary>

From array of objects, get names of users older than 20, in uppercase.

```javascript
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 18 },
    { name: "Charlie", age: 30 },
    { name: "Diana", age: 16 }
];

const result = users
    .filter(user => user.age > 20)
    .map(user => user.name.toUpperCase());

console.log(result); // ["ALICE", "CHARLIE"]
```
</details>

---

### 2.2 Objects

**Concepts:**
- Object literals
- Accessing properties (dot notation, bracket notation)
- Object methods
- Object destructuring
- Spread operator with objects
- `Object.keys()`, `Object.values()`, `Object.entries()`

<details>
<summary><strong>Issue #21: Object Basics</strong></summary>

Create a person object with name, age, city. Add email, delete city, check if "age" exists.

```javascript
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

person.email = "john@example.com";  // Add property
delete person.city;                  // Delete property
console.log("age" in person);        // true
console.log(person.hasOwnProperty("city")); // false
console.log(person);
```
</details>

<details>
<summary><strong>Issue #22: Object Methods</strong></summary>

Create a calculator object with add, subtract, multiply methods.

```javascript
const calculator = {
    add(a, b) {
        return a + b;
    },
    subtract(a, b) {
        return a - b;
    },
    multiply(a, b) {
        return a * b;
    }
};

console.log(calculator.add(5, 3));      // 8
console.log(calculator.subtract(5, 3)); // 2
console.log(calculator.multiply(5, 3)); // 15
```
</details>

<details>
<summary><strong>Issue #23: Object Destructuring</strong></summary>

Extract name and age from person object using destructuring.

```javascript
const person = { name: "Alice", age: 25, city: "Boston" };
const { name, age, country = "USA" } = person;
console.log(name);    // Alice
console.log(age);     // 25
console.log(country); // USA (default value)
```
</details>

<details>
<summary><strong>Issue #24: Nested Object Destructuring</strong></summary>

Extract street from nested address object.

```javascript
const user = {
    name: "John",
    address: {
        street: "123 Main St",
        city: "New York",
        zip: "10001"
    }
};

const { address: { street, city } } = user;
console.log(street); // 123 Main St
console.log(city);   // New York
```
</details>

<details>
<summary><strong>Issue #25: Object.entries() Loop</strong></summary>

Iterate over object and print "key: value" for each property.

```javascript
const car = { brand: "Toyota", model: "Camry", year: 2022 };

for (const [key, value] of Object.entries(car)) {
    console.log(`${key}: ${value}`);
}
// brand: Toyota
// model: Camry
// year: 2022
```
</details>

---

### 2.3 Strings

**Concepts:**
- String methods: `length`, `toUpperCase`, `toLowerCase`, `trim`
- `substring`, `slice`, `split`, `join`
- `indexOf`, `includes`, `startsWith`, `endsWith`
- Template literals
- Regular expressions basics

<details>
<summary><strong>Issue #26: String Manipulation</strong></summary>

Given "  Hello World  ", trim it, convert to uppercase, get length.

```javascript
let str = "  Hello World  ";
str = str.trim();
console.log(str);            // "Hello World"
console.log(str.toUpperCase()); // "HELLO WORLD"
console.log(str.length);     // 11
```
</details>

<details>
<summary><strong>Issue #27: String Search</strong></summary>

Check if string "JavaScript is awesome" contains "awesome" and starts with "Java".

```javascript
const str = "JavaScript is awesome";
console.log(str.includes("awesome"));   // true
console.log(str.startsWith("Java"));    // true
console.log(str.endsWith("awesome"));   // true
console.log(str.indexOf("is"));         // 11
```
</details>

<details>
<summary><strong>Issue #28: Split and Join</strong></summary>

Convert "apple,banana,orange" to array, then back to string with " - ".

```javascript
const str = "apple,banana,orange";
const arr = str.split(",");
console.log(arr); // ["apple", "banana", "orange"]

const newStr = arr.join(" - ");
console.log(newStr); // "apple - banana - orange"
```
</details>

<details>
<summary><strong>Issue #29: Template Literals</strong></summary>

Create a formatted string using variables for name, age, and occupation.

```javascript
const name = "Alice";
const age = 28;
const occupation = "Developer";

const intro = `My name is ${name}.
I am ${age} years old and work as a ${occupation}.
In 5 years, I'll be ${age + 5}.`;

console.log(intro);
```
</details>

<details>
<summary><strong>Issue #30: Palindrome Checker</strong></summary>

Write a function to check if a string is a palindrome.

```javascript
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversed = cleaned.split("").reverse().join("");
    return cleaned === reversed;
}

console.log(isPalindrome("racecar"));     // true
console.log(isPalindrome("A man a plan a canal Panama")); // true
console.log(isPalindrome("hello"));       // false
```
</details>

---

## Phase 3: Intermediate Concepts

### 3.1 Scope & Closures

**Concepts:**
- Global scope
- Function scope
- Block scope
- Lexical scope
- Closures
- IIFE (Immediately Invoked Function Expression)

<details>
<summary><strong>Issue #31: Understanding Scope</strong></summary>

Predict the output of nested function scopes.

```javascript
let x = 10;

function outer() {
    let y = 20;

    function inner() {
        let z = 30;
        console.log(x + y + z); // 60
    }

    inner();
    // console.log(z); // Error: z is not defined
}

outer();
// console.log(y); // Error: y is not defined
```
</details>

<details>
<summary><strong>Issue #32: Basic Closure</strong></summary>

Create a counter using closure.

```javascript
function createCounter() {
    let count = 0;

    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getCount() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
```
</details>

<details>
<summary><strong>Issue #33: Closure in Loop (Classic Problem)</strong></summary>

Fix the setTimeout in loop problem.

```javascript
// Problem: All callbacks print 5
for (var i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 100);
}

// Solution 1: Use let (block scope)
for (let i = 0; i < 5; i++) {
    setTimeout(() => console.log(i), 100);
}

// Solution 2: Use IIFE
for (var i = 0; i < 5; i++) {
    (function(j) {
        setTimeout(() => console.log(j), 100);
    })(i);
}
```
</details>

<details>
<summary><strong>Issue #34: Private Variables with Closures</strong></summary>

Create a bank account with private balance.

```javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance;

    return {
        deposit(amount) {
            if (amount > 0) {
                balance += amount;
                return `Deposited $${amount}. New balance: $${balance}`;
            }
            return "Invalid amount";
        },
        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return `Withdrew $${amount}. New balance: $${balance}`;
            }
            return "Invalid amount or insufficient funds";
        },
        getBalance() {
            return `Current balance: $${balance}`;
        }
    };
}

const account = createBankAccount(100);
console.log(account.deposit(50));   // Deposited $50. New balance: $150
console.log(account.withdraw(30));  // Withdrew $30. New balance: $120
console.log(account.getBalance());  // Current balance: $120
// console.log(account.balance);    // undefined (private!)
```
</details>

---

### 3.2 This Keyword

**Concepts:**
- `this` in global context
- `this` in object methods
- `this` in functions
- `this` in arrow functions
- `call()`, `apply()`, `bind()`

<details>
<summary><strong>Issue #35: this in Object Methods</strong></summary>

Understand how this works in object methods.

```javascript
const person = {
    name: "Alice",
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    },
    greetArrow: () => {
        console.log(`Hello, I'm ${this.name}`); // this is NOT person
    }
};

person.greet();      // Hello, I'm Alice
person.greetArrow(); // Hello, I'm undefined (or global name)

const greetFunc = person.greet;
greetFunc(); // Hello, I'm undefined (this is lost)
```
</details>

<details>
<summary><strong>Issue #36: call, apply, bind</strong></summary>

Use call, apply, and bind to set this context.

```javascript
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

// call - arguments passed individually
introduce.call(person1, "Hello", "!");     // Hello, I'm Alice!
introduce.call(person2, "Hi", ".");        // Hi, I'm Bob.

// apply - arguments passed as array
introduce.apply(person1, ["Hey", "!!"]);   // Hey, I'm Alice!!

// bind - returns a new function with bound this
const introduceAlice = introduce.bind(person1);
introduceAlice("Greetings", "~");          // Greetings, I'm Alice~
```
</details>

<details>
<summary><strong>Issue #37: this in Event Handlers</strong></summary>

Fixing this in callback functions.

```javascript
const button = {
    text: "Click me",
    click() {
        console.log(`Button text: ${this.text}`);
    }
};

// Problem: this is lost in setTimeout
setTimeout(button.click, 100); // Button text: undefined

// Solution 1: bind
setTimeout(button.click.bind(button), 100);

// Solution 2: Arrow function wrapper
setTimeout(() => button.click(), 100);

// Solution 3: Use arrow function in object (careful!)
const button2 = {
    text: "Click me",
    click: function() {
        setTimeout(() => {
            console.log(`Button text: ${this.text}`); // this is button2
        }, 100);
    }
};
```
</details>

---

### 3.3 Classes & OOP

**Concepts:**
- Class declaration
- Constructor
- Methods
- Getters and setters
- Static methods
- Inheritance (`extends`)
- `super` keyword

<details>
<summary><strong>Issue #38: Basic Class</strong></summary>

Create a Rectangle class with width, height, area(), and perimeter().

```javascript
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }

    perimeter() {
        return 2 * (this.width + this.height);
    }
}

const rect = new Rectangle(5, 3);
console.log(rect.area());      // 15
console.log(rect.perimeter()); // 16
```
</details>

<details>
<summary><strong>Issue #39: Getters and Setters</strong></summary>

Create a Circle class with radius and calculated diameter, circumference.

```javascript
class Circle {
    constructor(radius) {
        this._radius = radius;
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        if (value > 0) {
            this._radius = value;
        } else {
            console.log("Radius must be positive");
        }
    }

    get diameter() {
        return this._radius * 2;
    }

    get circumference() {
        return 2 * Math.PI * this._radius;
    }

    get area() {
        return Math.PI * this._radius ** 2;
    }
}

const circle = new Circle(5);
console.log(circle.diameter);      // 10
console.log(circle.circumference); // 31.4159...
console.log(circle.area);          // 78.5398...
circle.radius = 10;
console.log(circle.diameter);      // 20
```
</details>

<details>
<summary><strong>Issue #40: Inheritance</strong></summary>

Create Animal base class and Dog, Cat subclasses.

```javascript
class Animal {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    speak() {
        console.log(`${this.name} makes a sound`);
    }

    info() {
        return `${this.name} is ${this.age} years old`;
    }
}

class Dog extends Animal {
    constructor(name, age, breed) {
        super(name, age);
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks: Woof!`);
    }

    fetch() {
        console.log(`${this.name} fetches the ball`);
    }
}

class Cat extends Animal {
    constructor(name, age, indoor) {
        super(name, age);
        this.indoor = indoor;
    }

    speak() {
        console.log(`${this.name} meows: Meow!`);
    }
}

const dog = new Dog("Buddy", 3, "Golden Retriever");
const cat = new Cat("Whiskers", 5, true);

dog.speak();     // Buddy barks: Woof!
cat.speak();     // Whiskers meows: Meow!
dog.fetch();     // Buddy fetches the ball
console.log(dog.info()); // Buddy is 3 years old
```
</details>

<details>
<summary><strong>Issue #41: Static Methods</strong></summary>

Create a utility class with static methods.

```javascript
class MathUtils {
    static PI = 3.14159;

    static add(a, b) {
        return a + b;
    }

    static multiply(a, b) {
        return a * b;
    }

    static circleArea(radius) {
        return MathUtils.PI * radius ** 2;
    }

    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

console.log(MathUtils.add(5, 3));        // 8
console.log(MathUtils.PI);               // 3.14159
console.log(MathUtils.circleArea(5));    // 78.539...
console.log(MathUtils.randomBetween(1, 10)); // Random 1-10
```
</details>

---

## Phase 4: Asynchronous JavaScript

### 4.1 Callbacks

**Concepts:**
- Synchronous vs asynchronous
- Callback functions
- Callback hell
- Error-first callbacks

<details>
<summary><strong>Issue #42: Basic Callback</strong></summary>

Create a function that accepts a callback.

```javascript
function fetchData(callback) {
    setTimeout(() => {
        const data = { id: 1, name: "Product" };
        callback(data);
    }, 1000);
}

fetchData((data) => {
    console.log("Received:", data);
});
console.log("Waiting for data...");
// Output:
// Waiting for data...
// Received: { id: 1, name: "Product" }
```
</details>

<details>
<summary><strong>Issue #43: Error-First Callback</strong></summary>

Implement error handling in callbacks.

```javascript
function divideAsync(a, b, callback) {
    setTimeout(() => {
        if (b === 0) {
            callback(new Error("Cannot divide by zero"), null);
        } else {
            callback(null, a / b);
        }
    }, 500);
}

divideAsync(10, 2, (error, result) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Result:", result);
    }
});

divideAsync(10, 0, (error, result) => {
    if (error) {
        console.log("Error:", error.message);
    } else {
        console.log("Result:", result);
    }
});
```
</details>

---

### 4.2 Promises

**Concepts:**
- Creating promises
- `then()`, `catch()`, `finally()`
- Promise chaining
- `Promise.all()`, `Promise.race()`, `Promise.allSettled()`

<details>
<summary><strong>Issue #44: Basic Promise</strong></summary>

Create a promise that resolves after 2 seconds.

```javascript
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Promise resolved!");
    }, 2000);
});

myPromise
    .then(result => console.log(result))
    .catch(error => console.log(error));
```
</details>

<details>
<summary><strong>Issue #45: Promise with Reject</strong></summary>

Create a promise that rejects based on condition.

```javascript
function checkAge(age) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (age >= 18) {
                resolve("Access granted");
            } else {
                reject(new Error("Must be 18 or older"));
            }
        }, 1000);
    });
}

checkAge(20)
    .then(msg => console.log(msg))
    .catch(err => console.log(err.message));

checkAge(15)
    .then(msg => console.log(msg))
    .catch(err => console.log(err.message));
```
</details>

<details>
<summary><strong>Issue #46: Promise Chaining</strong></summary>

Chain multiple promises together.

```javascript
function step1() {
    return new Promise(resolve => {
        setTimeout(() => resolve(1), 500);
    });
}

function step2(value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value + 1), 500);
    });
}

function step3(value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value * 2), 500);
    });
}

step1()
    .then(result => {
        console.log("Step 1:", result); // 1
        return step2(result);
    })
    .then(result => {
        console.log("Step 2:", result); // 2
        return step3(result);
    })
    .then(result => {
        console.log("Step 3:", result); // 4
    });
```
</details>

<details>
<summary><strong>Issue #47: Promise.all</strong></summary>

Fetch multiple resources in parallel.

```javascript
const promise1 = new Promise(resolve =>
    setTimeout(() => resolve("First"), 1000));
const promise2 = new Promise(resolve =>
    setTimeout(() => resolve("Second"), 500));
const promise3 = new Promise(resolve =>
    setTimeout(() => resolve("Third"), 1500));

Promise.all([promise1, promise2, promise3])
    .then(results => {
        console.log(results); // ["First", "Second", "Third"]
    })
    .catch(error => {
        console.log("One failed:", error);
    });
```
</details>

<details>
<summary><strong>Issue #48: Promise.race</strong></summary>

Get the fastest response.

```javascript
const fast = new Promise(resolve =>
    setTimeout(() => resolve("Fast server"), 500));
const slow = new Promise(resolve =>
    setTimeout(() => resolve("Slow server"), 2000));

Promise.race([fast, slow])
    .then(result => {
        console.log("Winner:", result); // Winner: Fast server
    });
```
</details>

---

### 4.3 Async/Await

**Concepts:**
- `async` functions
- `await` keyword
- Error handling with `try/catch`
- Parallel execution with async/await

<details>
<summary><strong>Issue #49: Basic Async/Await</strong></summary>

Convert promise chain to async/await.

```javascript
function fetchUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: `User ${id}` });
        }, 1000);
    });
}

// Using promises
fetchUser(1).then(user => console.log(user));

// Using async/await
async function getUser() {
    const user = await fetchUser(1);
    console.log(user);
}

getUser();
```
</details>

<details>
<summary><strong>Issue #50: Error Handling with Async/Await</strong></summary>

Handle errors in async functions.

```javascript
function fetchData(shouldFail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Failed to fetch"));
            } else {
                resolve({ data: "Success!" });
            }
        }, 1000);
    });
}

async function getData() {
    try {
        const result = await fetchData(false);
        console.log(result);

        const result2 = await fetchData(true);
        console.log(result2); // Won't reach here
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        console.log("Operation complete");
    }
}

getData();
```
</details>

<details>
<summary><strong>Issue #51: Sequential vs Parallel Async Operations</strong></summary>

Execute async operations in parallel.

```javascript
function delay(ms, value) {
    return new Promise(resolve =>
        setTimeout(() => resolve(value), ms));
}

// Sequential - takes ~3000ms
async function sequential() {
    console.time("Sequential");
    const a = await delay(1000, "A");
    const b = await delay(1000, "B");
    const c = await delay(1000, "C");
    console.log(a, b, c);
    console.timeEnd("Sequential");
}

// Parallel - takes ~1000ms
async function parallel() {
    console.time("Parallel");
    const [a, b, c] = await Promise.all([
        delay(1000, "A"),
        delay(1000, "B"),
        delay(1000, "C")
    ]);
    console.log(a, b, c);
    console.timeEnd("Parallel");
}

sequential();
parallel();
```
</details>

<details>
<summary><strong>Issue #52: Real-World Async Pattern</strong></summary>

Simulate fetching user and their posts.

```javascript
function fetchUser(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: userId, name: "John Doe" });
        }, 500);
    });
}

function fetchPosts(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "Post 1", userId },
                { id: 2, title: "Post 2", userId }
            ]);
        }, 500);
    });
}

async function getUserWithPosts(userId) {
    try {
        // Fetch in parallel since they're independent
        const [user, posts] = await Promise.all([
            fetchUser(userId),
            fetchPosts(userId)
        ]);

        return {
            ...user,
            posts
        };
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

getUserWithPosts(1).then(result => {
    console.log(JSON.stringify(result, null, 2));
});
```
</details>

---

## Phase 5: DOM Manipulation & Events

### 5.1 DOM Selection & Manipulation

**Concepts:**
- `querySelector`, `querySelectorAll`
- `getElementById`, `getElementsByClassName`
- Creating elements
- Modifying elements (`innerHTML`, `textContent`, attributes)
- Adding/removing elements

<details>
<summary><strong>Issue #53: Selecting Elements</strong></summary>

Select elements using various methods.

```javascript
// Single element selectors
const header = document.getElementById("header");
const firstButton = document.querySelector("button");
const mainContent = document.querySelector(".main-content");

// Multiple element selectors
const allButtons = document.querySelectorAll("button");
const allLinks = document.querySelectorAll("a");
const items = document.getElementsByClassName("item");

// Traversing
const parent = header.parentElement;
const children = header.children;
const nextSibling = header.nextElementSibling;
```
</details>

<details>
<summary><strong>Issue #54: Creating and Appending Elements</strong></summary>

Create a list dynamically.

```javascript
const fruits = ["Apple", "Banana", "Orange", "Grape"];

const ul = document.createElement("ul");
ul.id = "fruit-list";
ul.className = "list";

fruits.forEach(fruit => {
    const li = document.createElement("li");
    li.textContent = fruit;
    li.classList.add("list-item");
    ul.appendChild(li);
});

document.body.appendChild(ul);
```
</details>

<details>
<summary><strong>Issue #55: Modifying Elements</strong></summary>

Change styles, attributes, and content.

```javascript
const element = document.querySelector(".my-element");

// Modify content
element.textContent = "New text content";
element.innerHTML = "<strong>Bold text</strong>";

// Modify styles
element.style.color = "red";
element.style.backgroundColor = "#f0f0f0";
element.style.padding = "10px";

// Modify attributes
element.setAttribute("data-id", "123");
element.id = "new-id";

// Modify classes
element.classList.add("active");
element.classList.remove("inactive");
element.classList.toggle("visible");
element.classList.contains("active"); // true
```
</details>

<details>
<summary><strong>Issue #56: Removing Elements</strong></summary>

Remove elements from DOM.

```javascript
// Method 1: remove()
const element = document.querySelector(".to-remove");
element.remove();

// Method 2: removeChild()
const parent = document.querySelector(".parent");
const child = document.querySelector(".child");
parent.removeChild(child);

// Remove all children
const container = document.querySelector(".container");
while (container.firstChild) {
    container.removeChild(container.firstChild);
}
// Or simpler:
container.innerHTML = "";
```
</details>

---

### 5.2 Events

**Concepts:**
- Event listeners
- Event object
- Event propagation (bubbling, capturing)
- Event delegation
- Common events (click, submit, keydown, etc.)

<details>
<summary><strong>Issue #57: Basic Event Listeners</strong></summary>

Add click, hover, and keyboard events.

```javascript
const button = document.querySelector("#myButton");

// Click event
button.addEventListener("click", function(event) {
    console.log("Button clicked!");
    console.log("Event:", event);
    console.log("Target:", event.target);
});

// Mouse events
button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "blue";
});

button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "";
});

// Keyboard event
document.addEventListener("keydown", (event) => {
    console.log("Key pressed:", event.key);
    console.log("Key code:", event.code);

    if (event.key === "Escape") {
        console.log("Escape pressed!");
    }
});
```
</details>

<details>
<summary><strong>Issue #58: Form Events</strong></summary>

Handle form submission and input changes.

```javascript
const form = document.querySelector("#myForm");
const input = document.querySelector("#myInput");

// Prevent form submission and handle data
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log("Form data:", data);
});

// Input events
input.addEventListener("input", (event) => {
    console.log("Current value:", event.target.value);
});

input.addEventListener("focus", () => {
    input.style.borderColor = "blue";
});

input.addEventListener("blur", () => {
    input.style.borderColor = "";
});
```
</details>

<details>
<summary><strong>Issue #59: Event Delegation</strong></summary>

Handle events on dynamically created elements.

```javascript
// Instead of adding listeners to each button:
const container = document.querySelector("#button-container");

container.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
        const buttonId = event.target.dataset.id;
        console.log("Button clicked:", buttonId);
    }
});

// Now dynamically added buttons will work too
function addButton(id) {
    const button = document.createElement("button");
    button.textContent = `Button ${id}`;
    button.dataset.id = id;
    container.appendChild(button);
}

addButton(1);
addButton(2);
addButton(3);
```
</details>

<details>
<summary><strong>Issue #60: Event Propagation</strong></summary>

Understand bubbling and capturing.

```javascript
/*
<div id="outer">
    <div id="inner">
        <button id="button">Click</button>
    </div>
</div>
*/

const outer = document.querySelector("#outer");
const inner = document.querySelector("#inner");
const button = document.querySelector("#button");

// Bubbling (default) - inner to outer
outer.addEventListener("click", () => console.log("Outer clicked"));
inner.addEventListener("click", () => console.log("Inner clicked"));
button.addEventListener("click", () => console.log("Button clicked"));
// Click button: Button -> Inner -> Outer

// Capturing - outer to inner
outer.addEventListener("click", () => console.log("Outer (capture)"), true);
inner.addEventListener("click", () => console.log("Inner (capture)"), true);
// Click button: Outer (capture) -> Inner (capture) -> Button -> Inner -> Outer

// Stop propagation
button.addEventListener("click", (event) => {
    event.stopPropagation();
    console.log("Button clicked - propagation stopped");
});
```
</details>

---

## Phase 6: Modern JavaScript (ES6+)

### 6.1 ES6+ Features

**Concepts:**
- `let`, `const`
- Arrow functions
- Template literals
- Destructuring
- Spread/rest operators
- Default parameters
- Modules (`import`/`export`)
- `Map`, `Set`
- `Symbol`
- Optional chaining (`?.`)
- Nullish coalescing (`??`)

<details>
<summary><strong>Issue #61: Destructuring Advanced</strong></summary>

Use destructuring in function parameters.

```javascript
// Object destructuring in parameters
function printUser({ name, age, city = "Unknown" }) {
    console.log(`${name}, ${age}, ${city}`);
}

printUser({ name: "Alice", age: 25 }); // Alice, 25, Unknown

// Array destructuring
function getFirstAndRest([first, ...rest]) {
    return { first, rest };
}

console.log(getFirstAndRest([1, 2, 3, 4])); // { first: 1, rest: [2, 3, 4] }

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2, 1
```
</details>

<details>
<summary><strong>Issue #62: Spread Operator</strong></summary>

Use spread for arrays and objects.

```javascript
// Array spread
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

const arrCopy = [...arr1];
arrCopy.push(4);
console.log(arr1);    // [1, 2, 3] (unchanged)
console.log(arrCopy); // [1, 2, 3, 4]

// Object spread
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2, b: 10 }; // b is overwritten
console.log(merged); // { a: 1, b: 10, c: 3, d: 4 }

// Function arguments
const numbers = [1, 2, 3];
console.log(Math.max(...numbers)); // 3
```
</details>

<details>
<summary><strong>Issue #63: Map and Set</strong></summary>

Use Map and Set data structures.

```javascript
// Map - key-value pairs with any key type
const userMap = new Map();
userMap.set("id1", { name: "Alice", age: 25 });
userMap.set("id2", { name: "Bob", age: 30 });

console.log(userMap.get("id1"));    // { name: "Alice", age: 25 }
console.log(userMap.has("id1"));    // true
console.log(userMap.size);          // 2

userMap.forEach((value, key) => {
    console.log(`${key}: ${value.name}`);
});

// Set - unique values only
const numbers = new Set([1, 2, 2, 3, 3, 3]);
console.log(numbers); // Set { 1, 2, 3 }

numbers.add(4);
numbers.delete(1);
console.log(numbers.has(2)); // true

// Remove duplicates from array
const arr = [1, 1, 2, 2, 3, 3];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3]
```
</details>

<details>
<summary><strong>Issue #64: Optional Chaining and Nullish Coalescing</strong></summary>

Safely access nested properties.

```javascript
const user = {
    name: "Alice",
    address: {
        city: "New York"
    }
};

// Optional chaining
console.log(user?.address?.city);    // "New York"
console.log(user?.address?.street);  // undefined (no error)
console.log(user?.contact?.email);   // undefined (no error)

// With function calls
const obj = {
    greet() {
        return "Hello!";
    }
};
console.log(obj.greet?.());   // "Hello!"
console.log(obj.goodbye?.()); // undefined

// Nullish coalescing
const value1 = null ?? "default";     // "default"
const value2 = undefined ?? "default"; // "default"
const value3 = 0 ?? "default";         // 0 (0 is not null/undefined)
const value4 = "" ?? "default";        // "" (empty string is not null/undefined)

// Compare with ||
const value5 = 0 || "default";  // "default" (0 is falsy)
const value6 = "" || "default"; // "default" (empty string is falsy)

// Combining both
const user2 = {};
const city = user2?.address?.city ?? "Unknown City";
console.log(city); // "Unknown City"
```
</details>

<details>
<summary><strong>Issue #65: Modules</strong></summary>

Export and import modules.

```javascript
// math.js - Named exports
export const PI = 3.14159;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// user.js - Default export
export default class User {
    constructor(name) {
        this.name = name;
    }
}

// Also can have named exports alongside default
export const roles = ["admin", "user", "guest"];

// main.js - Imports
import User, { roles } from "./user.js";
import { add, multiply, PI } from "./math.js";
import * as MathUtils from "./math.js";

console.log(add(5, 3));           // 8
console.log(PI);                  // 3.14159
console.log(MathUtils.multiply(4, 2)); // 8

const user = new User("Alice");
console.log(user.name);           // Alice
console.log(roles);               // ["admin", "user", "guest"]
```
</details>

---

## Phase 7: Advanced Concepts

### 7.1 Prototypes & Inheritance

**Concepts:**
- Prototype chain
- `__proto__` vs `prototype`
- `Object.create()`
- Prototype methods
- Class vs prototype-based inheritance

<details>
<summary><strong>Issue #66: Understanding Prototypes</strong></summary>

Explore the prototype chain.

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, I'm ${this.name}`;
};

const john = new Person("John");

console.log(john.greet());                    // Hello, I'm John
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__);      // null

// Check prototype chain
console.log(john instanceof Person);  // true
console.log(john instanceof Object);  // true
```
</details>

<details>
<summary><strong>Issue #67: Object.create</strong></summary>

Create objects with specific prototypes.

```javascript
const animalPrototype = {
    speak() {
        console.log(`${this.name} makes a sound`);
    },
    eat() {
        console.log(`${this.name} is eating`);
    }
};

const dog = Object.create(animalPrototype);
dog.name = "Buddy";
dog.speak(); // Buddy makes a sound

// With property descriptors
const cat = Object.create(animalPrototype, {
    name: {
        value: "Whiskers",
        writable: true,
        enumerable: true,
        configurable: true
    },
    meow: {
        value: function() {
            console.log("Meow!");
        }
    }
});

cat.speak(); // Whiskers makes a sound
cat.meow();  // Meow!
```
</details>

---

### 7.2 Error Handling

**Concepts:**
- `try`, `catch`, `finally`
- `throw` statement
- Error types
- Custom errors
- Async error handling

<details>
<summary><strong>Issue #68: Basic Error Handling</strong></summary>

Handle different types of errors.

```javascript
function divide(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Arguments must be numbers");
    }
    if (b === 0) {
        throw new RangeError("Cannot divide by zero");
    }
    return a / b;
}

try {
    console.log(divide(10, 2));   // 5
    console.log(divide(10, 0));   // Error thrown
} catch (error) {
    if (error instanceof TypeError) {
        console.log("Type error:", error.message);
    } else if (error instanceof RangeError) {
        console.log("Range error:", error.message);
    } else {
        console.log("Unknown error:", error.message);
    }
} finally {
    console.log("Division operation complete");
}
```
</details>

<details>
<summary><strong>Issue #69: Custom Error Class</strong></summary>

Create and use custom error classes.

```javascript
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = "ValidationError";
        this.field = field;
    }
}

class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
    }
}

function validateUser(user) {
    if (!user.name) {
        throw new ValidationError("Name is required", "name");
    }
    if (!user.email) {
        throw new ValidationError("Email is required", "email");
    }
    if (!user.email.includes("@")) {
        throw new ValidationError("Invalid email format", "email");
    }
    return true;
}

try {
    validateUser({ name: "John" });
} catch (error) {
    if (error instanceof ValidationError) {
        console.log(`Validation error on ${error.field}: ${error.message}`);
    }
}
```
</details>

---

### 7.3 Design Patterns

**Concepts:**
- Singleton
- Factory
- Observer
- Module pattern
- Pub/Sub

<details>
<summary><strong>Issue #70: Singleton Pattern</strong></summary>

Implement a singleton database connection.

```javascript
class Database {
    static instance = null;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = "Connected";
        this.data = [];
        Database.instance = this;
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    query(sql) {
        console.log(`Executing: ${sql}`);
        return this.data;
    }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
const db3 = new Database();

console.log(db1 === db2); // true
console.log(db1 === db3); // true
```
</details>

<details>
<summary><strong>Issue #71: Factory Pattern</strong></summary>

Create objects without specifying exact class.

```javascript
class Car {
    constructor(model) {
        this.type = "Car";
        this.model = model;
        this.wheels = 4;
    }
}

class Motorcycle {
    constructor(model) {
        this.type = "Motorcycle";
        this.model = model;
        this.wheels = 2;
    }
}

class Truck {
    constructor(model) {
        this.type = "Truck";
        this.model = model;
        this.wheels = 6;
    }
}

class VehicleFactory {
    static createVehicle(type, model) {
        switch (type.toLowerCase()) {
            case "car":
                return new Car(model);
            case "motorcycle":
                return new Motorcycle(model);
            case "truck":
                return new Truck(model);
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

const car = VehicleFactory.createVehicle("car", "Toyota Camry");
const bike = VehicleFactory.createVehicle("motorcycle", "Harley Davidson");
const truck = VehicleFactory.createVehicle("truck", "Ford F-150");

console.log(car);   // Car { type: 'Car', model: 'Toyota Camry', wheels: 4 }
console.log(bike);  // Motorcycle { ... }
console.log(truck); // Truck { ... }
```
</details>

<details>
<summary><strong>Issue #72: Observer Pattern</strong></summary>

Implement a simple event system.

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return this;
    }

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event]
                .filter(cb => cb !== callback);
        }
        return this;
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback(...args);
            });
        }
        return this;
    }

    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
}

// Usage
const emitter = new EventEmitter();

emitter.on("message", (data) => {
    console.log("Received:", data);
});

emitter.on("message", (data) => {
    console.log("Also received:", data);
});

emitter.once("connect", () => {
    console.log("Connected! (only once)");
});

emitter.emit("message", "Hello World!");
emitter.emit("connect");
emitter.emit("connect"); // Won't fire (once)
```
</details>

---

## Phase 8: Web APIs & Browser

### 8.1 Fetch API

**Concepts:**
- `fetch()` basics
- Request/Response objects
- Headers
- GET, POST, PUT, DELETE requests
- Error handling

<details>
<summary><strong>Issue #73: Basic Fetch</strong></summary>

Make GET request and handle response.

```javascript
// Basic GET request
async function getUsers() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log(users);
        return users;
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

getUsers();
```
</details>

<details>
<summary><strong>Issue #74: POST Request</strong></summary>

Send data to server.

```javascript
async function createPost(postData) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Created:", result);
        return result;
    } catch (error) {
        console.error("Error:", error.message);
    }
}

createPost({
    title: "My Post",
    body: "This is the content",
    userId: 1
});
```
</details>

<details>
<summary><strong>Issue #75: Fetch with Timeout</strong></summary>

Implement request timeout.

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
            throw new Error("Request timed out");
        }
        throw error;
    }
}

// Usage
fetchWithTimeout("https://jsonplaceholder.typicode.com/posts", {}, 3000)
    .then(data => console.log(data))
    .catch(err => console.error(err.message));
```
</details>

---

### 8.2 Local Storage & Session Storage

**Concepts:**
- `localStorage`
- `sessionStorage`
- `setItem`, `getItem`, `removeItem`, `clear`
- Storing complex data (JSON)

<details>
<summary><strong>Issue #76: Local Storage CRUD</strong></summary>

Create, read, update, delete localStorage items.

```javascript
// Store simple value
localStorage.setItem("username", "john_doe");

// Get value
const username = localStorage.getItem("username");
console.log(username); // john_doe

// Store complex object
const user = {
    id: 1,
    name: "John",
    email: "john@example.com",
    preferences: {
        theme: "dark",
        language: "en"
    }
};

localStorage.setItem("user", JSON.stringify(user));

// Retrieve and parse
const storedUser = JSON.parse(localStorage.getItem("user"));
console.log(storedUser.preferences.theme); // dark

// Update
storedUser.preferences.theme = "light";
localStorage.setItem("user", JSON.stringify(storedUser));

// Remove single item
localStorage.removeItem("username");

// Clear all
// localStorage.clear();

// Check if item exists
if (localStorage.getItem("user")) {
    console.log("User exists in storage");
}
```
</details>

<details>
<summary><strong>Issue #77: Storage Wrapper Class</strong></summary>

Create a reusable storage utility.

```javascript
class StorageService {
    constructor(storageType = "local") {
        this.storage = storageType === "local"
            ? localStorage
            : sessionStorage;
    }

    set(key, value, expiryMinutes = null) {
        const item = {
            value,
            timestamp: Date.now(),
            expiry: expiryMinutes ? expiryMinutes * 60 * 1000 : null
        };
        this.storage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const itemStr = this.storage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);

        // Check expiry
        if (item.expiry && Date.now() - item.timestamp > item.expiry) {
            this.remove(key);
            return null;
        }

        return item.value;
    }

    remove(key) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }

    has(key) {
        return this.get(key) !== null;
    }
}

// Usage
const storage = new StorageService("local");
storage.set("token", "abc123", 60); // Expires in 60 minutes
storage.set("settings", { theme: "dark" });

console.log(storage.get("token"));    // abc123
console.log(storage.has("settings")); // true
```
</details>

---

## Phase 9: Testing

### 9.1 Unit Testing Basics

**Concepts:**
- Test structure (`describe`, `it`, `expect`)
- Assertions
- Mocking
- Test coverage

<details>
<summary><strong>Issue #78: Write Testable Code</strong></summary>

Create testable functions and their tests.

```javascript
// calculator.js
function add(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Arguments must be numbers");
    }
    return a + b;
}

function divide(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        throw new TypeError("Arguments must be numbers");
    }
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}

// calculator.test.js (Jest syntax)
describe("Calculator", () => {
    describe("add", () => {
        it("should add two positive numbers", () => {
            expect(add(2, 3)).toBe(5);
        });

        it("should add negative numbers", () => {
            expect(add(-2, -3)).toBe(-5);
        });

        it("should throw TypeError for non-numbers", () => {
            expect(() => add("2", 3)).toThrow(TypeError);
        });
    });

    describe("divide", () => {
        it("should divide two numbers", () => {
            expect(divide(10, 2)).toBe(5);
        });

        it("should throw error when dividing by zero", () => {
            expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
        });
    });
});
```
</details>

<details>
<summary><strong>Issue #79: Testing Async Code</strong></summary>

Test asynchronous functions.

```javascript
// userService.js
async function fetchUser(id) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
        throw new Error("User not found");
    }
    return response.json();
}

// userService.test.js
describe("fetchUser", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should fetch user successfully", async () => {
        const mockUser = { id: 1, name: "John" };

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser
        });

        const user = await fetchUser(1);

        expect(fetch).toHaveBeenCalledWith("/api/users/1");
        expect(user).toEqual(mockUser);
    });

    it("should throw error for non-existent user", async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false
        });

        await expect(fetchUser(999)).rejects.toThrow("User not found");
    });
});
```
</details>

---

## Phase 10: Real-World Projects

### Beginner Projects

1. **Todo List App**
   - Add, edit, delete todos
   - Mark as complete
   - Filter (all, active, completed)
   - Local storage persistence

2. **Calculator**
   - Basic operations
   - Clear and delete
   - Decimal support
   - Keyboard support

3. **Weather App**
   - Fetch weather data from API
   - Display current weather
   - Search by city
   - Show forecast

### Intermediate Projects

1. **Quiz Application**
   - Multiple choice questions
   - Timer
   - Score tracking
   - Results summary

2. **Expense Tracker**
   - Add income/expenses
   - Categories
   - Monthly summary
   - Charts/graphs

3. **Recipe Finder**
   - Search recipes by ingredients
   - Save favorites
   - Detailed view
   - Filter by cuisine

### Advanced Projects

1. **Chat Application**
   - Real-time messaging
   - User authentication
   - Message history
   - Typing indicators

2. **E-commerce Cart**
   - Product listing
   - Add/remove from cart
   - Quantity management
   - Checkout process

3. **Kanban Board**
   - Drag and drop cards
   - Multiple columns
   - Card creation/editing
   - Persistence

---

## Coding Challenges

<details>
<summary><strong>Challenge #1: Array Rotation</strong></summary>

Rotate an array to the right by k steps.

```javascript
function rotateArray(arr, k) {
    k = k % arr.length;
    return [...arr.slice(-k), ...arr.slice(0, -k)];
}

console.log(rotateArray([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]
```
</details>

<details>
<summary><strong>Challenge #2: Two Sum</strong></summary>

Find two numbers that add up to target.

```javascript
function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }

    return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```
</details>

<details>
<summary><strong>Challenge #3: Valid Parentheses</strong></summary>

Check if string has valid bracket pairs.

```javascript
function isValidParentheses(s) {
    const stack = [];
    const pairs = { "(": ")", "{": "}", "[": "]" };

    for (const char of s) {
        if (pairs[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (pairs[last] !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

console.log(isValidParentheses("(){}[]"));   // true
console.log(isValidParentheses("([)]"));     // false
console.log(isValidParentheses("{[]}"));     // true
```
</details>

<details>
<summary><strong>Challenge #4: Flatten Nested Array</strong></summary>

Flatten array to specified depth.

```javascript
function flattenArray(arr, depth = 1) {
    if (depth === 0) return arr.slice();

    return arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            acc.push(...flattenArray(val, depth - 1));
        } else {
            acc.push(val);
        }
        return acc;
    }, []);
}

const nested = [1, [2, [3, [4]]]];
console.log(flattenArray(nested, 1)); // [1, 2, [3, [4]]]
console.log(flattenArray(nested, 2)); // [1, 2, 3, [4]]
console.log(flattenArray(nested, Infinity)); // [1, 2, 3, 4]
```
</details>

<details>
<summary><strong>Challenge #5: Debounce Function</strong></summary>

Implement debounce utility.

```javascript
function debounce(func, delay) {
    let timeoutId;

    return function(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage
const search = debounce((query) => {
    console.log("Searching for:", query);
}, 300);

search("h");
search("he");
search("hel");
search("hell");
search("hello"); // Only this will execute after 300ms
```
</details>

<details>
<summary><strong>Challenge #6: Deep Clone</strong></summary>

Create a deep copy of an object.

```javascript
function deepClone(obj, seen = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // Handle circular references
    if (seen.has(obj)) {
        return seen.get(obj);
    }

    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // Handle Array
    if (Array.isArray(obj)) {
        const clone = [];
        seen.set(obj, clone);
        obj.forEach((item, index) => {
            clone[index] = deepClone(item, seen);
        });
        return clone;
    }

    // Handle Object
    const clone = {};
    seen.set(obj, clone);
    Object.keys(obj).forEach(key => {
        clone[key] = deepClone(obj[key], seen);
    });

    return clone;
}

const original = {
    a: 1,
    b: { c: 2, d: [3, 4] },
    e: new Date()
};
const cloned = deepClone(original);
cloned.b.c = 100;
console.log(original.b.c); // 2 (unchanged)
```
</details>

<details>
<summary><strong>Challenge #7: Throttle Function</strong></summary>

Implement throttle utility.

```javascript
function throttle(func, limit) {
    let inThrottle = false;

    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;

            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Usage
const handleScroll = throttle(() => {
    console.log("Scroll event handled");
}, 1000);

window.addEventListener("scroll", handleScroll);
```
</details>

<details>
<summary><strong>Challenge #8: Promise.all Implementation</strong></summary>

Implement Promise.all from scratch.

```javascript
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }

        if (promises.length === 0) {
            return resolve([]);
        }

        const results = [];
        let completed = 0;

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;

                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}

// Test
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = new Promise(resolve => setTimeout(() => resolve(3), 100));

promiseAll([p1, p2, p3]).then(console.log); // [1, 2, 3]
```
</details>

---

## Learning Resources

### Books
- "Eloquent JavaScript" by Marijn Haverbeke (Free online)
- "You Don't Know JS" series by Kyle Simpson (Free on GitHub)
- "JavaScript: The Good Parts" by Douglas Crockford
- "JavaScript Patterns" by Stoyan Stefanov

### Websites
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)
- [freeCodeCamp](https://freecodecamp.org)
- [Codecademy](https://codecademy.com)

### Practice Platforms
- [LeetCode](https://leetcode.com)
- [HackerRank](https://hackerrank.com)
- [Codewars](https://codewars.com)
- [Exercism](https://exercism.org)

### YouTube Channels
- Traversy Media
- The Net Ninja
- Fireship
- Web Dev Simplified

---

## Tips for Success

1. **Code every day** - consistency is key
2. **Build projects** - apply what you learn
3. **Read other people's code** - learn different approaches
4. **Debug actively** - use console.log and browser devtools
5. **Understand, don't memorize** - focus on concepts
6. **Ask questions** - join communities (Discord, Reddit, Stack Overflow)
7. **Teach others** - explaining reinforces learning
8. **Don't skip fundamentals** - they're crucial for advanced topics
9. **Take breaks** - rest helps consolidation
10. **Stay curious** - technology evolves constantly

---

## License

This roadmap is free to use for learning purposes.

---

**Happy Coding! 🚀**
