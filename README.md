# Tab Group Saver

A Chrome extension that helps you organize and manage your browser tabs by saving them into named groups.

## Features

- **Save Tab Groups**: Create named collections of your currently open tabs
- **Selective Saving**: Choose which tabs to include in your groups
- **Group Management**: 
  - Open all tabs in a group with one click
  - Rename groups
  - Remove groups or individual tabs
  - View tab counts and favicons
- **Context Menu Integration**: Quickly add individual tabs to existing groups
- **User-Friendly Interface**: Clean, intuitive design with responsive controls

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/anevski-stefan/tab-manager-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

### Saving Tabs

1. Click the extension icon in your browser toolbar
2. Enter a name for your tab group
3. Select the tabs you want to save using the checkboxes
4. Click "Save Selected Tabs"

### Managing Groups

1. Click the "Manage Groups" tab in the extension popup
2. For each group, you can:
   - Click the group header to expand/collapse
   - Use "Open" to launch all tabs in the group
   - Use "Rename" to change the group name
   - Use "Remove" to delete the group
   - Remove individual tabs using the "X" button

### Context Menu

Right-click on any webpage and select "Add Current Tab to Group" to quickly add the current tab to an existing group.

## Technical Details

The extension uses:
- Chrome Extension Manifest V3
- Chrome Storage Sync API for cross-device synchronization
- Chrome Tabs API for tab management
- Context Menus API for right-click functionality
- Modern CSS features for responsive design

## Permissions Required

- `tabs`: To access and manage browser tabs
- `storage`: To save and retrieve tab groups
- `contextMenus`: For right-click menu integration