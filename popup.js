document.addEventListener('DOMContentLoaded', function() {
    const saveTabsBtn = document.getElementById('saveTabsBtn');
    const manageGroupsBtn = document.getElementById('manageGroupsBtn');
    const saveTabsScreen = document.getElementById('saveTabsScreen');
    const manageGroupsScreen = document.getElementById('manageGroupsScreen');
    const saveButton = document.getElementById('saveButton');
    const groupNameInput = document.getElementById('groupName');
    const tabList = document.getElementById('tabList');
    const groupList = document.getElementById('groupList');
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
  
    saveTabsBtn.addEventListener('click', () => showScreen(saveTabsScreen));
    manageGroupsBtn.addEventListener('click', () => showScreen(manageGroupsScreen));
  
    function showScreen(screen) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      screen.classList.add('active');
      if (screen === saveTabsScreen) {
        saveTabsBtn.classList.add('active');
        loadTabs();
      } else {
        manageGroupsBtn.classList.add('active');
        loadGroups();
      }
    }
  
    function loadTabs() {
      chrome.tabs.query({currentWindow: true}, function(tabs) {        
        tabList.innerHTML = tabs.map(tab => {
          let faviconSrc;
    
          if (tab.url === 'chrome://newtab/') {
            faviconSrc = 'https://fonts.gstatic.com/s/i/materialicons/settings/v1/24px.svg'; 
          } else {
            faviconSrc = tab.favIconUrl || getDefaultIcon(tab.url);
          }
    
          return `
            <div class="tab-item">
              <input type="checkbox" id="tab-${tab.id}" data-id="${tab.id}">
              <label for="tab-${tab.id}">
                <img src="${faviconSrc}" alt="Favicon" class="favicon">
                <span class="tab-title">${tab.title}</span>
              </label>
            </div>
          `;
        }).join('');
        addCheckboxListeners();
      });
    }
    
    function getDefaultIcon(url) {
      if (url.startsWith('chrome://')) {
        return 'https://fonts.gstatic.com/s/i/materialicons/settings/v1/24px.svg';
      } else if (url.startsWith('chrome-extension://')) {
        return 'https://fonts.gstatic.com/s/i/materialicons/extension/v1/24px.svg';
      } else {
        return 'https://fonts.gstatic.com/s/i/materialicons/public/v1/24px.svg';
      }
    }
  
    function addCheckboxListeners() {
      tabList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSaveButtonState);
      });
    }
  
    function updateSaveButtonState() {
      const checkedBoxes = tabList.querySelectorAll('input[type="checkbox"]:checked');
      saveButton.disabled = checkedBoxes.length === 0 || groupNameInput.value.trim() === '';
    }
  
    groupNameInput.addEventListener('input', updateSaveButtonState);
  
    selectAllBtn.addEventListener('click', () => setAllCheckboxes(true));
    deselectAllBtn.addEventListener('click', () => setAllCheckboxes(false));
  
    function setAllCheckboxes(checked) {
      tabList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = checked;
        checkbox.dispatchEvent(new Event('change'));
      });
    }
  
    saveButton.addEventListener('click', saveSelectedTabs);
  
    function saveSelectedTabs() {
      const groupName = groupNameInput.value.trim();
      if (!groupName) {
        alert('Please enter a group name');
        return;
      }
  
      chrome.tabs.query({currentWindow: true}, function(tabs) {
        const selectedTabs = tabs.filter(tab => {
          const checkbox = document.querySelector(`input[type="checkbox"][data-id="${tab.id}"]`);
          return checkbox && checkbox.checked;
        }).map(tab => ({
          url: tab.url,
          title: tab.title,
          favIconUrl: tab.favIconUrl || getDefaultIcon(tab.url)
        }));
  
        if (selectedTabs.length === 0) {
          alert('Please select at least one tab');
          return;
        }
  
        chrome.storage.sync.get({tabGroups: {}}, function(data) {
          data.tabGroups[groupName] = selectedTabs;
          chrome.storage.sync.set({tabGroups: data.tabGroups}, function() {
            alert('Group saved successfully!');
            groupNameInput.value = '';
            setAllCheckboxes(false);
            updateSaveButtonState();
          });
        });
      });
    }
  
    function loadGroups() {
      chrome.storage.sync.get({tabGroups: {}}, function(data) {
        groupList.innerHTML = '';
        for (const [name, tabs] of Object.entries(data.tabGroups)) {
          const validTabs = tabs.filter(tab => tab && tab.url);
          const groupDiv = document.createElement('div');
          groupDiv.className = 'group-card collapsed';
          groupDiv.innerHTML = `
            <div class="group-header">
              <h2>${name}</h2>
              <span class="tab-count">${validTabs.length} tab${validTabs.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="group-content">
              <div class="group-actions">
                <button class="open-group">Open</button>
                <button class="rename-group">Rename</button>
                <button class="remove-group">Remove</button>
              </div>
              <div class="group-tabs">
                ${validTabs.map((tab, index) => `
                  <div class="tab-item" data-index="${index}">
                    <img src="${tab.favIconUrl || getDefaultIcon(tab.url)}" alt="Favicon" class="favicon">
                    <span class="tab-title"><a class="validTabLink" href="${tab.url}" target="blank">${tab.title || 'Untitled'}</a></span>
                    <button class="remove-tab" title="Remove tab">X</button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
          groupList.appendChild(groupDiv);
  
          const header = groupDiv.querySelector('.group-header');
          header.addEventListener('click', () => {
            groupDiv.classList.toggle('collapsed');
          });
  
          groupDiv.querySelector('.open-group').addEventListener('click', () => openGroup(validTabs));
          groupDiv.querySelector('.rename-group').addEventListener('click', () => renameGroup(name));
          groupDiv.querySelector('.remove-group').addEventListener('click', () => removeGroup(name));
  
          groupDiv.querySelectorAll('.remove-tab').forEach(button => {
            button.addEventListener('click', (e) => {
              e.stopPropagation();
              const tabIndex = parseInt(e.target.closest('.tab-item').dataset.index);
              removeTab(name, tabIndex, groupDiv);
            });
          });
        }
      });
    }
  
    function openGroup(tabs) {
      tabs.forEach(tab => chrome.tabs.create({url: tab.url}));
    }
  
    function renameGroup(oldName) {
      const newName = prompt('Enter new name for the group:', oldName);
      if (newName && newName !== oldName) {
        chrome.storage.sync.get({tabGroups: {}}, function(data) {
          data.tabGroups[newName] = data.tabGroups[oldName];
          delete data.tabGroups[oldName];
          chrome.storage.sync.set({tabGroups: data.tabGroups}, loadGroups);
        });
      }
    }
  
    function removeGroup(name) {
      if (confirm(`Are you sure you want to remove the group "${name}"?`)) {
        chrome.storage.sync.get({tabGroups: {}}, function(data) {
          delete data.tabGroups[name];
          chrome.storage.sync.set({tabGroups: data.tabGroups}, loadGroups);
        });
      }
    }
  
    function removeTab(groupName, tabIndex, groupDiv) {
      chrome.storage.sync.get({tabGroups: {}}, function(data) {
        if (data.tabGroups[groupName]) {
          data.tabGroups[groupName] = data.tabGroups[groupName].filter((tab, index) => index !== tabIndex && tab && tab.url);
          if (data.tabGroups[groupName].length === 0) {
            delete data.tabGroups[groupName];
            groupDiv.remove(); 
          } else {
            updateGroupContent(groupName, data.tabGroups[groupName], groupDiv);
          }
          chrome.storage.sync.set({tabGroups: data.tabGroups});
        }
      });
    }
  
    function updateGroupContent(groupName, tabs, groupDiv) {
      const validTabs = tabs.filter(tab => tab && tab.url);
      const tabCount = groupDiv.querySelector('.tab-count');
      tabCount.textContent = `${validTabs.length} tab${validTabs.length !== 1 ? 's' : ''}`;
  
      const groupTabs = groupDiv.querySelector('.group-tabs');
      groupTabs.innerHTML = validTabs.map((tab, index) => `
        <div class="tab-item" data-index="${index}">
          <img src="${tab.favIconUrl || getDefaultIcon(tab.url)}" alt="Favicon" class="favicon">
          <span class="tab-title">${tab.title || 'Untitled'}</span>
          <button class="remove-tab" title="Remove tab">X</button>
        </div>
      `).join('');
  
      groupTabs.querySelectorAll('.remove-tab').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          const tabIndex = parseInt(e.target.closest('.tab-item').dataset.index);
          removeTab(groupName, tabIndex, groupDiv);
        });
      });
    }
  
    loadTabs();
  });