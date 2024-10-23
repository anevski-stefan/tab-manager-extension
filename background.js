chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "addToGroup",
      title: "Add Current Tab to Group",
      contexts: ["page"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToGroup") {
      chrome.storage.local.set({ tabToAdd: {
        id: tab.id,
        url: tab.url,
        title: tab.title,
        favIconUrl: tab.favIconUrl
      }}, () => {
        chrome.windows.create({
          url: chrome.runtime.getURL("select_group.html"),
          type: "popup",
          width: 300,
          height: 200
        });
      });
    }
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addTabToGroup") {
      chrome.storage.sync.get({tabGroups: {}}, (data) => {
        const { groupName, tabToAdd } = request;
        if (data.tabGroups[groupName]) {
          data.tabGroups[groupName].push(tabToAdd);
          chrome.storage.sync.set({tabGroups: data.tabGroups}, () => {
            sendResponse({success: true});
          });
        } else {
          sendResponse({success: false, error: "Group not found"});
        }
      });
      return true; 
    }
  });