/**
 * Name: Benjamin Woods
 * Date: 02.17.2024
 * CSC 372-01, UNCG
 *
 * Description:
 * Contains all JavaScript for the hw3 assignment.
 * 1) Handles the image gallery click event on index.html (enlarge image, display dish info).
 * 2) Manages the meal plan page: add/remove dishes, update totals.
 */

// --------------------------------------
// PART 1: Dish Gallery (index.html)
// --------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Select all dish-gallery containers
  const galleries = document.querySelectorAll(".dish-gallery");

  // For each image, attach a click event to enlarge + show info
  galleries.forEach((gallery) => {
    const images = gallery.querySelectorAll("img");
    images.forEach((img) => {
      img.addEventListener("click", () => {

        console.log("Image clicked:", {
            name: img.getAttribute("data-dish-name"),
            desc: img.getAttribute("data-dish-desc"),
            cost: img.getAttribute("data-dish-cost"),
            credit: img.getAttribute("data-credit"),
          });

        // 1) Reset all images in this gallery to small
        images.forEach((otherImg) => {
          otherImg.classList.remove("selected-dish");
        });

        // 2) Mark this clicked image as 'selected-dish' (enlarged)
        img.classList.add("selected-dish");

        // 3) Display dish info in the aside (id="selected-dish-info")
        const dishName = img.getAttribute("data-dish-name");
        const dishDesc = img.getAttribute("data-dish-desc");
        const dishCost = img.getAttribute("data-dish-cost");
        const dishCredit = img.getAttribute("data-credit");

        const dishInfoAside = document.getElementById("selected-dish-info");
        const nameEl = document.getElementById("dish-name");
        const descEl = document.getElementById("dish-desc");
        const costEl = document.getElementById("dish-cost");
        const creditEl = document.getElementById("dish-credit");

        nameEl.textContent = dishName;
        descEl.textContent = dishDesc;
        costEl.textContent = dishCost;
        creditEl.textContent = `Image credit: ${dishCredit}`;

        // Show the aside if it's hidden
        dishInfoAside.classList.remove("hidden");
      });
    });
  });

  // --------------------------------------
  // PART 2: Meal Plan (mealplan.html)
  // --------------------------------------

  // Grab references for the meal plan page
  const addButtons = document.querySelectorAll(".add-btn");
  const mealPlanTableBody = document.querySelector("#meal-plan-table tbody");
  const totalCostEl = document.getElementById("total-cost");

  // Data structure to track what's in the meal plan
  let mealPlan = {}; // key: dishName, value: { qty, costEach }

  // Utility function to format numbers as currency
  function formatCurrency(num) {
    return num.toFixed(2);
  }

  // Re-render the meal plan table
  function renderMealPlan() {
    // Clear current table rows
    mealPlanTableBody.innerHTML = "";

    let total = 0;

    // For each dish in mealPlan, create a row
    Object.keys(mealPlan).forEach((dishName) => {
      const item = mealPlan[dishName];
      const subtotal = item.qty * item.costEach;
      total += subtotal;

      // Create table row
      const row = document.createElement("tr");

      // Dish Name
      const tdDish = document.createElement("td");
      tdDish.textContent = dishName;
      row.appendChild(tdDish);

      // Qty
      const tdQty = document.createElement("td");
      tdQty.textContent = item.qty;
      row.appendChild(tdQty);

      // Cost Each
      const tdCost = document.createElement("td");
      tdCost.textContent = `$${formatCurrency(item.costEach)}`;
      row.appendChild(tdCost);

      // Subtotal
      const tdSubtotal = document.createElement("td");
      tdSubtotal.textContent = `$${formatCurrency(subtotal)}`;
      row.appendChild(tdSubtotal);

      // Actions (Add More, Remove)
      const tdActions = document.createElement("td");

      const addMoreBtn = document.createElement("button");
      addMoreBtn.textContent = "+";
      addMoreBtn.addEventListener("click", () => {
        mealPlan[dishName].qty += 1;
        renderMealPlan();
      });

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "-";
      removeBtn.style.marginLeft = "0.5em";
      removeBtn.addEventListener("click", () => {
        // If qty > 1, decrement. If qty == 1, remove entirely.
        if (mealPlan[dishName].qty > 1) {
          mealPlan[dishName].qty -= 1;
        } else {
          delete mealPlan[dishName];
        }
        renderMealPlan();
      });

      tdActions.appendChild(addMoreBtn);
      tdActions.appendChild(removeBtn);
      row.appendChild(tdActions);

      // Append row to table body
      mealPlanTableBody.appendChild(row);
    });

    // Update total cost
    totalCostEl.textContent = formatCurrency(total);
  }

  // Attach event listeners to all "Add" buttons
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const dishName = btn.getAttribute("data-dish");
      const dishCost = parseFloat(btn.getAttribute("data-cost"));

      // If dish not in mealPlan, initialize. Else, increment qty
      if (!mealPlan[dishName]) {
        mealPlan[dishName] = {
          qty: 1,
          costEach: dishCost,
        };
      } else {
        mealPlan[dishName].qty += 1;
      }

      // Re-render table
      renderMealPlan();
    });
  });
});
