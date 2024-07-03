document.addEventListener("DOMContentLoaded", function() {
    fetch("estimate_detail 1 (1) (1) (1) (1).json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayEstimate(data.data.sections);
            calculateGrandTotal();
        })
        .catch(error => console.error("Error loading the JSON file:", error));
});

function displayEstimate(sections) {
    const container = document.getElementById("estimate-container");

    sections.forEach(section => {
        const table = document.createElement("table");
        const sectionHeader = document.createElement("h2");
        sectionHeader.textContent = section.section_name;
        container.appendChild(sectionHeader);

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Type</th>
                <th>Item Name</th>
                <th>QTY</th>
                <th>Unit Cost</th>
                <th>Unit</th>
                <th>Total</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        section.items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.item_type_display_name}</td>
                <td>${item.subject}</td>
                <td><input type="number" value="${item.quantity}" data-id="${item.item_id}" class="quantity"></td>
                <td><input type="number" value="${item.unit_cost / 100}" data-id="${item.item_id}" class="unit-cost"></td>
                <td>${item.unit}</td>
                <td class="total" data-id="${item.item_id}">${(item.quantity * item.unit_cost / 100).toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        container.appendChild(table);
    });

    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll(".quantity, .unit-cost").forEach(input => {
        input.addEventListener("input", function() {
            updateItemTotal(this.dataset.id);
            calculateGrandTotal();
        });
    });
}

function updateItemTotal(itemId) {
    const quantity = document.querySelector(`input.quantity[data-id="${itemId}"]`).value;
    const unitCost = document.querySelector(`input.unit-cost[data-id="${itemId}"]`).value;
    const total = (quantity * unitCost).toFixed(2);

    document.querySelector(`td.total[data-id="${itemId}"]`).textContent = total;
}

function calculateGrandTotal() {
    let grandTotal = 0;
    document.querySelectorAll("td.total").forEach(td => {
        grandTotal += parseFloat(td.textContent);
    });
    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
}
