# TOU-Notepad

An in-game Notepad mod for Town of Us Mira (Among Us), implemented as a Minigame.

## Installation

1. Build the project using `dotnet build`.
2. Copy the generated DLL to your `Among Us/BepInEx/plugins/` folder.
3. **IMPORTANT**: You must create the UI Prefab in Unity and bundle it.
   - Create a Unity Project with Among Us modding tools.
   - Create a Prefab named `NotepadMinigame`.
   - Add the `NotepadMinigame` script (from `UI/NotepadMinigame.cs`) to the root.
   - Assign the references (Tabs, Content Objects, Buttons).
   - Create the Role Card prefab and assign it to `RolesTab` script.
   - Create the Player Card prefab and assign it to `PlayersTab` script.
   - Build an AssetBundle containing this prefab.
   - Update `Assets/NotepadAssets.cs` to load your AssetBundle.

## Keybinds

- **N**: Open/Close Notepad (Configurable in BepInEx config).
- **Esc**: Close Notepad.

## Features

- **Roles Tab**: Lists all roles from MiraAPI. Filter by name. Add notes.
- **Players Tab**: Lists all players. Assign suspected roles. Add notes.
- **General Tab**: Freeform notes.
- **Persistence**: Notes are saved in RAM and reset on Game Start.
- **Clipboard Export**: Click "Copy Notes" at the End Game screen to copy all notes to clipboard.

## Developer Info

### MiraAPI Integration
This mod uses `RoleManager.Instance.AllRoles` to fetch roles dynamically. It works with any mod that registers roles via MiraAPI.

### Custom Role Data
To register custom roles, simply use MiraAPI's `RoleManager`. The Notepad will automatically pick them up.

### Extending
To add new tabs, inherit from `MonoBehaviour` and add them to `NotepadMinigame.cs`.
