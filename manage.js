document.addEventListener('DOMContentLoaded', function() {
    const groupList = document.getElementById('groupList');
  
    loadGroups();
  
    function loadGroups() {
      chrome.storage.sync.get({tabGroups: {}}, function(data) {
        groupList.innerHTML = '';
        for (const [name, tabs] of Object.entries(data.tabGroups)) {
          const groupDiv = document.createElement('div');
          groupDiv.className = 'group';
          groupDiv.innerHTML = `
            <h2>${name} (${tabs.length} tabs)</h2>
            <button class="open">Open</button>
            <button class="rename">Rename</button>
            <button class="remove">Remove</button>
            <ul>
              ${tabs.map(tab => `<li>${tab.title}</li>`).join('')}
            </ul>
          `;
          groupList.appendChild(groupDiv);
  
          groupDiv.querySelector('.open').addEventListener('click', () => openGroup(tabs));
          groupDiv.querySelector('.rename').addEventListener('click', () => renameGroup(name));
          groupDiv.querySelector('.remove').addEventListener('click', () => removeGroup(name));
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
  });