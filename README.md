# Tab Group Saver

A Chrome extension that helps you organize and manage your browser tabs efficiently by saving them into named groups.

## Features

- **Save Tab Groups**: Create named collections of your currently open tabs
- **Selective Saving**: Choose which tabs to include in your groups
- **Group Management**: 
  - Open all tabs in a group with one click
  - Rename existing groups
  - Remove groups or individual tabs
  - View tab counts and favicons
- **Context Menu Integration**: Quickly add individual tabs to existing groups
- **Responsive Interface**: Clean and user-friendly design with collapsible groups

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

### Saving Tabs
1. Click the extension icon in your browser toolbar
2. Enter a name for your tab group
3. Select the tabs you want to save (or use "Select All")
4. Click "Save Selected Tabs"

### Managing Groups
1. Click the "Manage Groups" tab in the extension popup
2. Use the following options for each group:
   - Click the group header to expand/collapse
   - "Open" to launch all tabs in the group
   - "Rename" to change the group name
   - "Remove" to delete the entire group
   - "X" button on individual tabs to remove them from the group

### Context Menu
Right-click on any webpage and select "Add Current Tab to Group" to quickly add it to an existing group.

## Permissions

The extension requires the following permissions:
- `tabs`: To access and manage browser tabs
- `storage`: To save and retrieve tab groups
- `contextMenus`: For right-click menu integration

## Technical Details

Built using:
- Chrome Extensions Manifest V3
- Vanilla JavaScript
- CSS for styling
- Chrome Storage Sync API for data persistence
