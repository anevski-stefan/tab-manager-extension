let tabToAdd;

function populateGroups() {
  chrome.storage.sync.get({tabGroups: {}}, (data) => {
    const select = document.getElementById("groupSelect");
    select.innerHTML = ''; 
    
    const groups = Object.keys(data.tabGroups);
    groups.forEach(group => {
      const option = document.createElement("option");
      option.value = group;
      option.textContent = group;
      select.appendChild(option);
    });

    if (groups.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No groups available";
      select.appendChild(option);
      document.getElementById("addButton").disabled = true;
    }
  });
}

populateGroups();

chrome.storage.local.get(['tabToAdd'], (result) => {
  tabToAdd = result.tabToAdd;
  document.getElementById('tabTitle').textContent = tabToAdd.title;
});

document.getElementById("addButton").addEventListener("click", () => {
  const groupName = document.getElementById("groupSelect").value;
  if (!groupName) {
    alert("Please select a group");
    return;
  }

  chrome.storage.sync.get({tabGroups: {}}, (data) => {
    if (data.tabGroups[groupName]) {
      data.tabGroups[groupName].push(tabToAdd);
      chrome.storage.sync.set({tabGroups: data.tabGroups}, () => {
        alert("Tab added to group successfully!");
        window.close();
      });
    } else {
      alert("Failed to add tab to group: Group not found");
    }
  });
});