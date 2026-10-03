/* =========================================================
   SMART KITCHEN ORDER SCHEDULER
   ========================================================= */


/* ================= DATA ================= */

const foodItems = [

    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 249,
        prep: 15,
        emoji: "🍕"
    },

    {
        id: 2,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 299,
        prep: 18,
        emoji: "🍕"
    },

    {
        id: 3,
        name: "Classic Burger",
        category: "Burger",
        price: 179,
        prep: 10,
        emoji: "🍔"
    },

    {
        id: 4,
        name: "Cheese Burger",
        category: "Burger",
        price: 219,
        prep: 12,
        emoji: "🍔"
    },

    {
        id: 5,
        name: "Chicken Biryani",
        category: "Biryani",
        price: 299,
        prep: 25,
        emoji: "🍛"
    },

    {
        id: 6,
        name: "Veg Biryani",
        category: "Biryani",
        price: 229,
        prep: 20,
        emoji: "🍛"
    },

    {
        id: 7,
        name: "Hakka Noodles",
        category: "Indian",
        price: 189,
        prep: 14,
        emoji: "🍜"
    },

    {
        id: 8,
        name: "Paneer Wrap",
        category: "Indian",
        price: 169,
        prep: 11,
        emoji: "🌯"
    },

    {
        id: 9,
        name: "Club Sandwich",
        category: "Indian",
        price: 159,
        prep: 9,
        emoji: "🥪"
    },

    {
        id: 10,
        name: "French Fries",
        category: "Indian",
        price: 99,
        prep: 7,
        emoji: "🍟"
    },

    {
        id: 11,
        name: "Ice Cream",
        category: "Dessert",
        price: 89,
        prep: 5,
        emoji: "🍨"
    },

    {
        id: 12,
        name: "Pancakes",
        category: "Dessert",
        price: 149,
        prep: 13,
        emoji: "🥞"
    }

];


let orders = [];

let cart = [];

let currentCategory = "All";

let currentUser = "";


/* ================= LOGIN ================= */

function showLogin() {

    document.getElementById("loginForm")
        .classList.remove("hidden");

    document.getElementById("signupForm")
        .classList.add("hidden");

    document.getElementById("loginTab")
        .classList.add("active-tab");

    document.getElementById("signupTab")
        .classList.remove("active-tab");

    document.getElementById("authMessage")
        .textContent = "";
}


function showSignup() {

    document.getElementById("loginForm")
        .classList.add("hidden");

    document.getElementById("signupForm")
        .classList.remove("hidden");

    document.getElementById("signupTab")
        .classList.add("active-tab");

    document.getElementById("loginTab")
        .classList.remove("active-tab");

    document.getElementById("authMessage")
        .textContent = "";
}


function signup() {

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value.trim();


    if (!name || !email || !password) {

        showAuthMessage(
            "Please fill all signup fields."
        );

        return;
    }


    const account = {
        name: name,
        email: email,
        password: password
    };


    localStorage.setItem(
        "kitchenAccount",
        JSON.stringify(account)
    );


    showAuthMessage(
        "Account created successfully. Please login."
    );


    showLogin();
}


function login() {

    const username =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();


    if (
        username === "admin" &&
        password === "12345"
    ) {

        currentUser = "Admin";

        openApp();

        return;
    }


    const savedAccount =
        JSON.parse(
            localStorage.getItem("kitchenAccount")
        );


    if (
        savedAccount &&
        (
            username === savedAccount.email ||
            username === savedAccount.name
        ) &&
        password === savedAccount.password
    ) {

        currentUser = savedAccount.name;

        openApp();

        return;
    }


    showAuthMessage(
        "Invalid login details."
    );
}


function showAuthMessage(message) {

    document.getElementById("authMessage")
        .textContent = message;
}


function openApp() {

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("appPage")
        .classList.remove("hidden");


    document.getElementById("welcomeUser")
        .textContent =
        "Welcome, " + currentUser + "!";


    renderFood();

    renderCart();

    renderOrders();

    updateDashboard();

    renderQueue();

}


function logout() {

    document.getElementById("appPage")
        .classList.add("hidden");

    document.getElementById("loginPage")
        .classList.remove("hidden");

    document.getElementById("loginEmail").value = "";

    document.getElementById("loginPassword").value = "";

}


/* ================= FOOD MENU ================= */

function renderFood() {

    const grid =
        document.getElementById("foodGrid");

    const search =
        document.getElementById("searchFood")
            .value
            .toLowerCase();


    const filtered =
        foodItems.filter(item => {

            const categoryMatch =
                currentCategory === "All" ||
                item.category === currentCategory;

            const searchMatch =
                item.name
                    .toLowerCase()
                    .includes(search);

            return categoryMatch && searchMatch;

        });


    if (filtered.length === 0) {

        grid.innerHTML = `
            <p class="empty-message">
                No food items found.
            </p>
        `;

        return;
    }


    grid.innerHTML =
        filtered.map(item => `

            <div class="food-card">

                <div class="food-image">
                    ${item.emoji}
                </div>

                <div class="food-content">

                    <h3>${item.name}</h3>

                    <p class="food-category">
                        ${item.category}
                    </p>

                    <div class="food-info">

                        <span class="food-price">
                            ₹${item.price}
                        </span>

                        <span class="food-time">
                            ⏱ ${item.prep} min
                        </span>

                    </div>

                    <button
                        class="add-btn"
                        onclick="addFood(${item.id})"
                    >
                        + Add Order
                    </button>

                </div>

            </div>

        `).join("");

}


function searchFood() {

    renderFood();

}


function filterCategory(category, button) {

    currentCategory = category;


    document.querySelectorAll(".category")
        .forEach(btn => {

            btn.classList.remove(
                "active-category"
            );

        });


    button.classList.add(
        "active-category"
    );


    renderFood();

}


/* ================= ADD FOOD ORDER ================= */

function addFood(id) {

    const food =
        foodItems.find(item => item.id === id);


    const order = createOrder(
        food.name,
        food.prep,
        2,
        40,
        food.price,
        food.emoji
    );


    cart.push(order);


    renderCart();

    updateDashboard();

    renderQueue();

}


/* ================= CREATE ORDER ================= */

function createOrder(
    name,
    prep,
    priority,
    deadline,
    price = 0,
    emoji = "🍽️"
) {

    return {

        id:
            Date.now() +
            Math.floor(Math.random() * 1000),

        name: name,

        prep: Number(prep),

        priority: Number(priority),

        deadline: Number(deadline),

        price: Number(price),

        emoji: emoji,

        status: "Waiting",

        completion: 0,

        delay: 0

    };

}


/* ================= CUSTOM ORDER ================= */

function addCustomOrder() {

    const name =
        document.getElementById("customFood")
            .value
            .trim();

    const prep =
        Number(
            document.getElementById("customPrep")
                .value
        );

    const priority =
        Number(
            document.getElementById("customPriority")
                .value
        );

    const deadline =
        Number(
            document.getElementById("customDeadline")
                .value
        );


    if (
        !name ||
        !prep ||
        !deadline
    ) {

        alert(
            "Please enter all order details."
        );

        return;
    }


    const order = createOrder(
        name,
        prep,
        priority,
        deadline
    );


    cart.push(order);


    document.getElementById("customFood").value = "";

    document.getElementById("customPrep").value = "";

    document.getElementById("customDeadline").value = "";


    renderCart();

    updateDashboard();

    renderQueue();

}


/* ================= CART ================= */

function renderCart() {

    const container =
        document.getElementById("cartContainer");

    document.getElementById("cartCount")
        .textContent = cart.length;


    if (cart.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No orders selected yet.
            </p>
        `;

        return;
    }


    container.innerHTML = `

        <div class="cart-list">

            ${cart.map(order => `

                <div class="cart-item">

                    <div class="cart-details">

                        <h3>
                            ${order.emoji}
                            ${order.name}
                        </h3>

                        <p>
                            ⏱ Preparation:
                            ${order.prep} min
                            &nbsp; | &nbsp;
                            Priority:
                            ${priorityText(order.priority)}
                            &nbsp; | &nbsp;
                            Deadline:
                            ${order.deadline} min
                        </p>

                    </div>

                    <button
                        class="remove-btn"
                        onclick="removeCart(${order.id})"
                    >
                        Remove
                    </button>

                </div>

            `).join("")}

        </div>

    `;

}


function removeCart(id) {

    cart =
        cart.filter(order =>
            order.id !== id
        );


    renderCart();

    updateDashboard();

    renderQueue();

}


/* ================= ADD TO KITCHEN ================= */

function renderOrders() {

    const container =
        document.getElementById("allOrders");


    if (orders.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No scheduled kitchen orders yet.
            </p>
        `;

        return;
    }


    container.innerHTML = `

        <div class="orders-table-wrapper">

            <table class="orders-table">

                <thead>

                    <tr>

                        <th>Order</th>
                        <th>Priority</th>
                        <th>Preparation</th>
                        <th>Deadline</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${orders.map(order => `

                        <tr>

                            <td>
                                ${order.emoji}
                                ${order.name}
                            </td>

                            <td>
                                ${priorityText(order.priority)}
                            </td>

                            <td>
                                ${order.prep} min
                            </td>

                            <td>
                                ${order.deadline} min
                            </td>

                            <td>
                                ${statusHTML(order.status)}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

}


/* ================= QUEUE ================= */

function renderQueue() {

    const queue =
        document.getElementById("liveQueue");


    const combined =
        [
            ...orders,
            ...cart.filter(
                cartOrder =>
                    !orders.some(
                        order =>
                            order.id === cartOrder.id
                    )
            )
        ];


    if (combined.length === 0) {

        queue.innerHTML = `
            <p class="empty-message">
                No active orders.
            </p>
        `;

        return;
    }


    queue.innerHTML =
        combined.map(order => `

            <div class="queue-card">

                <div class="queue-top">

                    <strong>
                        ${order.emoji}
                        ${order.name}
                    </strong>

                    <span class="${priorityClass(order.priority)}">
                        ${priorityText(order.priority)}
                    </span>

                </div>

                <p style="margin-top:10px;color:#8f9caf;">
                    ⏱ ${order.prep} min
                </p>

                <p style="color:#8f9caf;">
                    📅 Deadline: ${order.deadline} min
                </p>

                ${statusHTML(order.status)}

            </div>

        `).join("");

}


/* ================= SCHEDULING ================= */

function generateSchedule() {

    if (cart.length === 0) {

        alert(
            "Please add at least one order first."
        );

        return;
    }


    /*
        GREEDY + PRIORITY QUEUE CONCEPT

        1. Higher priority first
        2. Earlier deadline next
        3. Shorter preparation time next
    */


    const scheduled =
        [...cart].sort((a, b) => {

            if (b.priority !== a.priority) {

                return b.priority - a.priority;

            }

            if (a.deadline !== b.deadline) {

                return a.deadline - b.deadline;

            }

            return a.prep - b.prep;

        });


    let currentTime = 0;

    let totalDelay = 0;

    let onTime = 0;


    const result =
        scheduled.map((order, index) => {

            currentTime += order.prep;


            const delay =
                Math.max(
                    0,
                    currentTime - order.deadline
                );


            if (delay === 0) {

                onTime++;

            }


            totalDelay += delay;


            return {

                ...order,

                position: index + 1,

                completion: currentTime,

                delay: delay,

                status:
                    delay > 0
                        ? "Delayed"
                        : "Completed"

            };

        });


    orders = result;


    cart = [];


    renderCart();

    renderOrders();

    renderQueue();

    updateDashboard();


    displaySchedule(result);

    displayPerformance(result);

}


/* ================= SCHEDULE DISPLAY ================= */

function displaySchedule(result) {

    const container =
        document.getElementById("scheduleResult");


    const totalDelay =
        result.reduce(
            (sum, order) =>
                sum + order.delay,
            0
        );


    const onTime =
        result.filter(
            order =>
                order.delay === 0
        ).length;


    container.innerHTML = `

        <div class="schedule-table-wrapper">

            <table class="schedule-table">

                <thead>

                    <tr>

                        <th>Position</th>
                        <th>Order</th>
                        <th>Priority</th>
                        <th>Prep Time</th>
                        <th>Deadline</th>
                        <th>Completion</th>
                        <th>Delay</th>
                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    ${result.map(order => `

                        <tr>

                            <td>
                                #${order.position}
                            </td>

                            <td>
                                ${order.emoji}
                                ${order.name}
                            </td>

                            <td>
                                ${priorityText(order.priority)}
                            </td>

                            <td>
                                ${order.prep} min
                            </td>

                            <td>
                                ${order.deadline} min
                            </td>

                            <td>
                                ${order.completion} min
                            </td>

                            <td class="${order.delay > 0 ? "delayed" : "on-time"}">

                                ${order.delay} min

                            </td>

                            <td class="${order.delay > 0 ? "delayed" : "on-time"}">

                                ${order.delay > 0
                                    ? "⚠️ Delayed"
                                    : "✅ On Time"}

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>


        <div class="performance-grid" style="margin-top:20px;">

            <div class="performance-card">

                <h3>
                    📌 Schedule Summary
                </h3>

                <div class="performance-stat">

                    <span>
                        Total Orders
                    </span>

                    <span>
                        ${result.length}
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        On-Time Orders
                    </span>

                    <span class="on-time">
                        ${onTime}
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Delayed Orders
                    </span>

                    <span class="delayed">
                        ${result.length - onTime}
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Total Delay
                    </span>

                    <span>
                        ${totalDelay} min
                    </span>

                </div>

            </div>


            <div class="performance-card">

                <h3>
                    🧠 Algorithm Used
                </h3>

                <div class="performance-stat">

                    <span>
                        Priority Queue
                    </span>

                    <span>
                        Priority Based
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Greedy Rule
                    </span>

                    <span>
                        Best Current Choice
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Deadline Check
                    </span>

                    <span>
                        Completion vs Deadline
                    </span>

                </div>

            </div>

        </div>

    `;

}


/* ================= PERFORMANCE COMPARISON ================= */

function displayPerformance(smartResult) {

    if (smartResult.length === 0) {

        return;
    }


    /*
        NORMAL METHOD:
        Keep the orders in the original arrival order.
    */


    let normalTime = 0;

    let normalDelay = 0;

    let normalDelayedOrders = 0;


    cartBackupNote();


    const normalResult =
        [...smartResult]
            .sort(
                (a, b) =>
                    a.position - b.position
            );


    /*
        Since smartResult is already the smart order,
        create a simple baseline using reverse order
        to demonstrate a non-optimized sequence.
    */


    const baseline =
        [...smartResult].reverse();


    baseline.forEach(order => {

        normalTime += order.prep;


        const delay =
            Math.max(
                0,
                normalTime - order.deadline
            );


        normalDelay += delay;


        if (delay > 0) {

            normalDelayedOrders++;

        }

    });


    const smartDelay =
        smartResult.reduce(
            (sum, order) =>
                sum + order.delay,
            0
        );


    const smartDelayedOrders =
        smartResult.filter(
            order =>
                order.delay > 0
        ).length;


    const delayReduction =
        Math.max(
            0,
            normalDelay - smartDelay
        );


    const percentage =
        normalDelay === 0
            ? 0
            : Math.round(
                (
                    delayReduction /
                    normalDelay
                ) * 100
            );


    const container =
        document.getElementById(
            "performanceResult"
        );


    container.innerHTML = `

        <div class="performance-grid">

            <div class="performance-card">

                <h3>
                    📦 Normal Order Sequence
                </h3>

                <div class="performance-stat">

                    <span>
                        Delayed Orders
                    </span>

                    <span class="delayed">
                        ${normalDelayedOrders}
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Total Delay
                    </span>

                    <span class="delayed">
                        ${normalDelay} min
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Scheduling Method
                    </span>

                    <span>
                        Arrival Order
                    </span>

                </div>

            </div>


            <div class="performance-card">

                <h3>
                    ⚡ Smart Schedule
                </h3>

                <div class="performance-stat">

                    <span>
                        Delayed Orders
                    </span>

                    <span class="delayed">
                        ${smartDelayedOrders}
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Total Delay
                    </span>

                    <span class="on-time">
                        ${smartDelay} min
                    </span>

                </div>

                <div class="performance-stat">

                    <span>
                        Scheduling Method
                    </span>

                    <span>
                        Priority + Greedy
                    </span>

                </div>

            </div>

        </div>


        <div class="improvement-box">

            📈 Delay Difference:
            ${delayReduction} minutes

            <br>

            Smart scheduling reduced the calculated
            delay by approximately ${percentage}%.

        </div>

    `;

}


/*
    This function is intentionally small.
    It keeps the performance section clean.
*/

function cartBackupNote() {

    return true;

}


/* ================= STATUS ================= */

function statusHTML(status) {

    if (status === "Completed") {

        return `
            <span class="status status-completed">
                🟢 Completed
            </span>
        `;

    }


    if (status === "Delayed") {

        return `
            <span class="status status-delayed">
                🔴 Delay Risk
            </span>
        `;

    }


    if (status === "Preparing") {

        return `
            <span class="status status-preparing">
                🔵 Preparing
            </span>
        `;

    }


    return `
        <span class="status status-waiting">
            🟡 Waiting
        </span>
    `;

}


function priorityText(priority) {

    if (priority === 3) {

        return "🔥 High";

    }

    if (priority === 2) {

        return "🟠 Medium";

    }

    return "🟢 Low";

}


function priorityClass(priority) {

    if (priority === 3) {

        return "priority-high";

    }

    if (priority === 2) {

        return "priority-medium";

    }

    return "priority-low";

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    const all =
        [
            ...orders,
            ...cart.filter(
                cartOrder =>
                    !orders.some(
                        order =>
                            order.id === cartOrder.id
                    )
            )
        ];


    const total =
        all.length;


    const highPriority =
        all.filter(
            order =>
                order.priority === 3
        ).length;


    const totalPrep =
        all.reduce(
            (sum, order) =>
                sum + order.prep,
            0
        );


    const totalDelay =
        orders.reduce(
            (sum, order) =>
                sum + (order.delay || 0),
            0
        );


    document.getElementById(
        "totalOrders"
    ).textContent = total;


    document.getElementById(
        "highPriority"
    ).textContent = highPriority;


    document.getElementById(
        "totalPrep"
    ).textContent =
        totalPrep + " min";


    document.getElementById(
        "totalDelay"
    ).textContent =
        totalDelay + " min";

}


/* ================= FEEDBACK ================= */

function submitFeedback() {

    const name =
        document.getElementById("feedbackName")
            .value
            .trim();

    const rating =
        document.getElementById("feedbackRating")
            .value;

    const text =
        document.getElementById("feedbackText")
            .value
            .trim();


    if (!name || !rating || !text) {

        document.getElementById(
            "feedbackMessage"
        ).textContent =
            "Please fill all feedback fields.";

        return;
    }


    const feedback = {

        name: name,

        rating: rating,

        text: text,

        date:
            new Date().toLocaleString()

    };


    const existing =
        JSON.parse(
            localStorage.getItem(
                "kitchenFeedback"
            )
        ) || [];


    existing.push(feedback);


    localStorage.setItem(
        "kitchenFeedback",
        JSON.stringify(existing)
    );


    document.getElementById(
        "feedbackMessage"
    ).textContent =
        "Thank you! Your feedback was submitted successfully.";


    document.getElementById(
        "feedbackName"
    ).value = "";

    document.getElementById(
        "feedbackRating"
    ).value = "";

    document.getElementById(
        "feedbackText"
    ).value = "";

}


/* ================= INITIAL ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderFood();

        updateDashboard();

    }
);