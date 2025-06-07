// script.js for Belgium Travel Assistant

const itineraryData = [
    { date: "2025-08-04", city: "Brussels", description: "Arrive in Brussels, check into hotel. Explore the Grand-Place and Manneken Pis." },
    { date: "2025-08-05", city: "Brussels", description: "Visit the Atomium and Mini-Europe. Enjoy some Belgian waffles." },
    { date: "2025-08-06", city: "Brussels", description: "Day trip to Bruges. Canal tour and Markt square visit." },
    { date: "2025-08-07", city: "Brussels", description: "Explore the Royal Palace and Parc de Bruxelles. Museum visit in the afternoon." },
    { date: "2025-08-08", city: "Brussels", description: "Day trip to Ghent. Visit Gravensteen castle and St. Bavo's Cathedral." },
    { date: "2025-08-09", city: "Brussels", description: "Visit the comic strip museum. Enjoy a chocolate tasting tour." },
    { date: "2025-08-10", city: "Brussels", description: "Last minute souvenir shopping. Depart from Brussels." }
];

function displayItinerary() {
    const itineraryContainer = document.getElementById('itinerary-content');
    if (!itineraryContainer) {
        console.error("Itinerary container not found!");
        return;
    }

    itineraryContainer.innerHTML = ''; // Clear existing content

    itineraryData.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('itinerary-day');

        const dateH3 = document.createElement('h3');
        dateH3.textContent = `Date: ${day.date}`;
        dayDiv.appendChild(dateH3);

        const cityP = document.createElement('p');
        cityP.textContent = `City: ${day.city}`;
        dayDiv.appendChild(cityP);

        const descriptionP = document.createElement('p');
        descriptionP.textContent = `Plan: ${day.description}`;
        dayDiv.appendChild(descriptionP);

        itineraryContainer.appendChild(dayDiv);
    });
}

// Call displayItinerary when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    displayItinerary();
    // Expense Tracker Initial Setup
    renderExpenses();
    renderSummary();
});

// ===== EXPENSE TRACKER =====
let expenses = []; // Array to store expense objects

// DOM element selections
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list'); // The div where expenses are listed
const expenseSummary = document.getElementById('expense-summary'); // The div for the summary

// Ensure DOM elements exist before adding event listeners or calling functions
if (expenseForm) {
    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent page reload

        // Get values from form fields
        const descriptionInput = document.getElementById('expense-description');
        const amountInput = document.getElementById('expense-amount');
        const categoryInput = document.getElementById('expense-category');
        const paidByInput = document.getElementById('expense-paid-by');

        const description = descriptionInput.value.trim();
        const amountString = amountInput.value;
        const category = categoryInput.value;
        const paidBy = paidByInput.value.trim();

        let amount = parseFloat(amountString);

        // Validation
        if (!description) {
            alert("Please enter a description for the expense.");
            descriptionInput.focus();
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid positive amount for the expense.");
            amountInput.focus();
            return;
        }
         if (!paidBy) {
            alert("Please enter who paid for the expense.");
            paidByInput.focus();
            return;
        }

        // Create new expense object
        const newExpense = {
            id: Date.now(), // Simple unique ID
            description,
            amount,
            category,
            paidBy
        };

        expenses.push(newExpense); // Add to expenses array

        renderExpenses(); // Update the displayed list of expenses
        renderSummary();  // Update the summary

        expenseForm.reset(); // Clear form fields
        descriptionInput.focus(); // Set focus to the first field for easy next entry
    });
} else {
    console.error("Expense form not found!");
}


/**
 * Renders the list of expenses into the #expense-list element.
 */
function renderExpenses() {
    if (!expenseList) {
        console.error("#expense-list element not found for rendering expenses.");
        return;
    }
    expenseList.innerHTML = ''; // Clear current list

    if (expenses.length === 0) {
        expenseList.innerHTML = '<p>No expenses added yet.</p>'; // Show placeholder if no expenses
        return;
    }

    const ul = document.createElement('ul');
    ul.className = 'expenses-ul'; // Class for UL styling

    expenses.forEach(expense => {
        const li = document.createElement('li'); // Each expense is an LI
        li.className = 'expense-item'; // Class for LI styling
        li.setAttribute('data-id', expense.id); // Store ID for potential future actions (delete/edit)

        // Structure for each expense item
        li.innerHTML = `
            <div class="expense-item-header">
                <div class="expense-description-category">
                    <strong>${escapeHTML(expense.description)}</strong>
                    <span class="category-tag">${escapeHTML(expense.category)}</span>
                </div>
                <button class="delete-btn-placeholder" aria-label="Delete expense" title="Delete expense (Not implemented)">X</button>
            </div>
            <div class="expense-item-body">
                <span class="amount">Amount: &euro;${expense.amount.toFixed(2)}</span>
                <span class="paid-by">Paid by: ${escapeHTML(expense.paidBy)}</span>
            </div>
        `;
        ul.appendChild(li);
    });
    expenseList.appendChild(ul);
}

/**
 * Calculates and renders the expense summary, including total spent and payer balances.
 */
function renderSummary() {
    if (!expenseSummary) {
        console.error("#expense-summary element not found for rendering summary.");
        return;
    }
    expenseSummary.innerHTML = ''; // Clear current summary

    if (expenses.length === 0) {
        expenseSummary.innerHTML = '<p>Summary of expenses and who owes whom will be shown here.</p>'; // Placeholder
        return;
    }

    let totalSpent = 0;
    const payers = {}; // Object to store total amount paid by each person: { name: amount }

    // Calculate total spent and sum amounts for each payer
    expenses.forEach(expense => {
        totalSpent += expense.amount;
        const payerName = escapeHTML(expense.paidBy); // Sanitize payer name before using as key
        payers[payerName] = (payers[payerName] || 0) + expense.amount;
    });

    const summaryContentDiv = document.createElement('div'); // Wrapper for all summary content

    // Display Overall Total Expenses
    const totalP = document.createElement('p');
    totalP.innerHTML = `<strong>Overall Total Expenses: &euro;${totalSpent.toFixed(2)}</strong>`;
    summaryContentDiv.appendChild(totalP);

    // Display Total Paid by Each Person
    const payersTitleP = document.createElement('p');
    payersTitleP.innerHTML = '<strong>Total Paid by Each Person:</strong>';
    summaryContentDiv.appendChild(payersTitleP);

    const payersUl = document.createElement('ul');
    for (const person in payers) {
        const payerLi = document.createElement('li');
        payerLi.textContent = `${person}: &euro;${payers[person].toFixed(2)}`;
        payersUl.appendChild(payerLi);
    }
    summaryContentDiv.appendChild(payersUl);

    // Settlement Logic: Calculate and display who owes whom, assuming an equal split.
    const uniquePayerNames = Object.keys(payers);
    if (uniquePayerNames.length > 0) {
        const averageExpensePerPerson = totalSpent / uniquePayerNames.length;

        const settlementTitleP = document.createElement('p');
        settlementTitleP.innerHTML = `<strong>Settlement Details (Equal Split):</strong><br>(Average per person: &euro;${averageExpensePerPerson.toFixed(2)} based on ${uniquePayerNames.length} participant(s) who paid)`;
        summaryContentDiv.appendChild(settlementTitleP);

        const settlementUl = document.createElement('ul');
        uniquePayerNames.forEach(person => {
            const amountPaidByThisPerson = payers[person];
            const difference = amountPaidByThisPerson - averageExpensePerPerson;

            const settlementLi = document.createElement('li');
            if (difference > 0.01) { // Using a small epsilon for floating point comparisons
                settlementLi.innerHTML = `${person} paid &euro;${amountPaidByThisPerson.toFixed(2)}, is <span class="owed-amount">owed &euro;${difference.toFixed(2)}</span>.`;
            } else if (difference < -0.01) {
                settlementLi.innerHTML = `${person} paid &euro;${amountPaidByThisPerson.toFixed(2)}, <span class="owes-amount">owes &euro;${Math.abs(difference).toFixed(2)}</span>.`;
            } else {
                settlementLi.textContent = `${person} paid &euro;${amountPaidByThisPerson.toFixed(2)} and is settled.`;
            }
            settlementUl.appendChild(settlementLi);
        });
        summaryContentDiv.appendChild(settlementUl);
    }

    expenseSummary.appendChild(summaryContentDiv);
}

/**
 * Utility function to escape HTML special characters to prevent XSS.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, function (match) {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}
