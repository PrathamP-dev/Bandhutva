console.log("Bandhutva script loaded.");

// Check if we're on supported pages
function isOnSupportedPage() {
  return location.href.includes("/mynetwork/invitation-manager/") || location.href.includes("/mynetwork/grow/");
}

function addBulkControls() {
  if (document.getElementById("bulk-controls")) return;

  const controlBar = document.createElement("div");
  controlBar.id = "bulk-controls";
  controlBar.style.cssText = `
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px;
    background: #f3f2ef;
    border: 1px solid #d1d1d1;
    border-radius: 8px;
    margin: 16px 0;
    animation: fadeIn 0.25s ease forwards;
    justify-content: flex-end;
  `;

  const selectAllCheckbox = document.createElement("input");
  selectAllCheckbox.type = "checkbox";
  selectAllCheckbox.id = "select-all";
  selectAllCheckbox.className = "animated-checkbox";
  selectAllCheckbox.style.marginRight = "6px";

  const selectAllLabel = document.createElement("label");
  selectAllLabel.style.cssText = `
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    cursor: pointer;
  `;
  selectAllLabel.appendChild(selectAllCheckbox);
  selectAllLabel.appendChild(document.createTextNode(" Select All"));

  const acceptButton = document.createElement("button");
  acceptButton.id = "accept-selected";
  acceptButton.className = "bulk-btn";
  acceptButton.textContent = "Accept Selected";

  const rejectButton = document.createElement("button");
  rejectButton.id = "reject-selected";
  rejectButton.className = "bulk-btn reject";
  rejectButton.textContent = "Reject Selected";

  controlBar.appendChild(selectAllLabel);
  controlBar.appendChild(acceptButton);
  controlBar.appendChild(rejectButton);

  const mainContainer = document.querySelector("main");
  if (mainContainer) {
    mainContainer.prepend(controlBar);
  }

  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".bulk-select");
    checkboxes.forEach(cb => cb.checked = this.checked);
  });

  acceptButton.addEventListener("click", () => handleBulkAction("accept"));
  rejectButton.addEventListener("click", () => handleBulkAction("reject"));
}

function addCheckboxes() {
  const invitations = document.querySelectorAll(".invitation-card, .discover-entity-type-card");

  invitations.forEach(invite => {
    if (invite.querySelector(".bulk-select")) return;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "bulk-select animated-checkbox";
    checkbox.style.marginRight = "8px";

    const header = invite.querySelector(".entity-result__content") ||
                   invite.querySelector(".discover-person-card__name") ||
                   invite.querySelector(".artdeco-entity-lockup__title") ||
                   invite.querySelector("span"); // fallback

    if (header) {
      header.prepend(checkbox);
    } else {
      invite.prepend(checkbox);
    }
  });
}

function handleBulkAction(action) {
  const selectedCheckboxes = document.querySelectorAll(".bulk-select:checked");
  selectedCheckboxes.forEach(cb => {
    const card = cb.closest(".invitation-card, .discover-entity-type-card");
    if (!card) return;

    const acceptButton = card.querySelector('button[aria-label^="Accept"], button.artdeco-button--secondary, button[aria-label^="Connect with"]');
    const rejectButton = card.querySelector('button[aria-label^="Ignore"], button.artdeco-button--tertiary');

    if (action === "accept" && acceptButton) {
      acceptButton.click();
    } else if (action === "reject" && rejectButton) {
      rejectButton.click();
    }
    cb.checked = false;
  });

  const selectAll = document.getElementById("select-all");
  if (selectAll) selectAll.checked = false;
}

function debounce(func, wait = 300) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

function setupObserver() {
  const observer = new MutationObserver(debounce(() => {
    if (isOnSupportedPage()) {
      addBulkControls();
      addCheckboxes();
    }
  }, 500));

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  if (isOnSupportedPage()) {
    addBulkControls();
    addCheckboxes();
  }
}

// Styling
const style = document.createElement("style");
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes checkmark {
    from { opacity: 0; transform: scale(0) rotate(45deg); }
    to { opacity: 1; transform: scale(1) rotate(45deg); }
  }
  .bulk-btn {
    background: #0a66c2;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
    font-size: 14px;
  }
  .bulk-btn:hover {
    background: #004182;
  }
  .bulk-btn.reject {
    background: #c50000;
  }
  .bulk-btn.reject:hover {
    background: #8a0000;
  }
  .animated-checkbox {
    width: 18px;
    height: 18px;
    appearance: none;
    border: 2px solid #666;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: all 0.25s ease;
    background: #fff;
  }
  .animated-checkbox:checked {
    background-color: #0a66c2;
    border-color: #0a66c2;
  }
  .animated-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    animation: checkmark 0.3s ease forwards;
  }
`;
document.head.appendChild(style);

setupObserver();
