using System.Collections.Generic;
using System.IO;
using UnityEngine;
using System;

namespace TOU_Notepad.Data;

/// <summary>
/// File-based storage for notepad notes that creates a file at game launch
/// and wipes it when a new game starts. This ensures data persists within
/// a game session but is cleared between games.
/// </summary>
public class NotepadFileStorage
{
    private static NotepadFileStorage _instance;
    public static NotepadFileStorage Instance => _instance ??= new NotepadFileStorage();
    
    private string _filePath;
    private Dictionary<string, string> _generalNotes = new();
    private Dictionary<string, Dictionary<string, string>> _roleNotes = new();
    private Dictionary<string, Dictionary<string, string>> _playerNotes = new();
    
    // Track if we have unsaved changes
    private bool _hasUnsavedChanges = false;
    
    // Auto-save interval in seconds
    private float _autoSaveInterval = 5.0f;
    private float _lastSaveTime = 0f;
    
    private NotepadFileStorage()
    {
        // Create file path in the game's persistent data path
        _filePath = Path.Combine(Application.persistentDataPath, "TOU_Notepad_Session.txt");
        
        // Load existing data if file exists
        LoadFromFile();
    }
    
    /// <summary>
    /// Called when a new game starts to wipe all data
    /// </summary>
    public void NewGame()
    {
        _generalNotes.Clear();
        _roleNotes.Clear();
        _playerNotes.Clear();
        _hasUnsavedChanges = false;
        
        // Delete the file if it exists
        if (File.Exists(_filePath))
        {
            File.Delete(_filePath);
        }
    }
    
    /// <summary>
    /// Save general note (left or right page)
    /// </summary>
    public void SetGeneralNote(string page, string text)
    {
        if (!_generalNotes.ContainsKey(page))
        {
            _generalNotes.Add(page, text);
        }
        else
        {
            _generalNotes[page] = text;
        }
        _hasUnsavedChanges = true;
    }
    
    /// <summary>
    /// Get general note (left or right page)
    /// </summary>
    public string GetGeneralNote(string page)
    {
        return _generalNotes.TryGetValue(page, out var value) ? value : "";
    }
    
    /// <summary>
    /// Save role note
    /// </summary>
    public void SetRoleNote(string roleId, string note)
    {
        if (!_roleNotes.ContainsKey(roleId))
        {
            _roleNotes.Add(roleId, new Dictionary<string, string>());
        }
        _roleNotes[roleId]["note"] = note;
        _hasUnsavedChanges = true;
    }
    
    /// <summary>
    /// Get role note
    /// </summary>
    public string GetRoleNote(string roleId)
    {
        if (_roleNotes.TryGetValue(roleId, out var roleData))
        {
            return roleData.TryGetValue("note", out var note) ? note : "";
        }
        return "";
    }
    
    /// <summary>
    /// Save player note
    /// </summary>
    public void SetPlayerNote(string playerId, string note, string suspectedRoleId = "")
    {
        if (!_playerNotes.ContainsKey(playerId))
        {
            _playerNotes.Add(playerId, new Dictionary<string, string>());
        }
        _playerNotes[playerId]["note"] = note;
        _playerNotes[playerId]["suspectedRole"] = suspectedRoleId;
        _hasUnsavedChanges = true;
    }
    
    /// <summary>
    /// Get player note data
    /// </summary>
    public (string note, string suspectedRole) GetPlayerNote(string playerId)
    {
        if (_playerNotes.TryGetValue(playerId, out var playerData))
        {
            string note = playerData.TryGetValue("note", out var n) ? n : "";
            string suspectedRole = playerData.TryGetValue("suspectedRole", out var sr) ? sr : "";
            return (note, suspectedRole);
        }
        return ("", "");
    }
    
    /// <summary>
    /// Force save to file immediately
    /// </summary>
    public void SaveNow()
    {
        try
        {
            var lines = new List<string>();
            
            // Header
            lines.Add("[TOU_NOTEPAD_SESSION_V1]");
            lines.Add($"# Created: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
            lines.Add("");
            
            // General Notes
            lines.Add("[GENERAL_NOTES]");
            foreach (var kvp in _generalNotes)
            {
                lines.Add($"{kvp.Key}={EscapeValue(kvp.Value)}");
            }
            lines.Add("");
            
            // Role Notes
            lines.Add("[ROLE_NOTES]");
            foreach (var roleKvp in _roleNotes)
            {
                foreach (var dataKvp in roleKvp.Value)
                {
                    lines.Add($"{roleKvp.Key}:{dataKvp.Key}={EscapeValue(dataKvp.Value)}");
                }
            }
            lines.Add("");
            
            // Player Notes
            lines.Add("[PLAYER_NOTES]");
            foreach (var playerKvp in _playerNotes)
            {
                foreach (var dataKvp in playerKvp.Value)
                {
                    lines.Add($"{playerKvp.Key}:{dataKvp.Key}={EscapeValue(dataKvp.Value)}");
                }
            }
            
            File.WriteAllLines(_filePath, lines);
            _hasUnsavedChanges = false;
            _lastSaveTime = Time.realtimeSinceStartup;
        }
        catch (Exception ex)
        {
            UnityEngine.Debug.LogError($"NotepadFileStorage: Failed to save - {ex.Message}");
        }
    }
    
    /// <summary>
    /// Load data from file
    /// </summary>
    private void LoadFromFile()
    {
        if (!File.Exists(_filePath))
        {
            return;
        }
        
        try
        {
            var lines = File.ReadAllLines(_filePath);
            string currentSection = "";
            string currentKey = "";
            
            foreach (var line in lines)
            {
                var trimmed = line.Trim();
                
                if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith("#") || trimmed.StartsWith("["))
                {
                    if (trimmed.StartsWith("["))
                    {
                        currentSection = trimmed.Trim('[', ']');
                        currentKey = "";
                    }
                    continue;
                }
                
                var eqIndex = trimmed.IndexOf('=');
                if (eqIndex < 0)
                {
                    // Might be a key:value line (like roleId:note=value)
                    var colonIndex = trimmed.IndexOf(':');
                    if (colonIndex >= 0)
                    {
                        var keyColon = trimmed.Substring(0, colonIndex);
                        var afterColon = trimmed.Substring(colonIndex + 1);
                        var eqIdx2 = afterColon.IndexOf('=');
                        if (eqIdx2 >= 0)
                        {
                            currentKey = keyColon;
                            var dataKey = afterColon.Substring(0, eqIdx2);
                            var value = UnescapeValue(afterColon.Substring(eqIdx2 + 1));
                            
                            ProcessLoadedData(currentSection, currentKey, dataKey, value);
                        }
                    }
                    continue;
                }
                
                var key = trimmed.Substring(0, eqIndex);
                var unescapedValue = UnescapeValue(trimmed.Substring(eqIndex + 1));
                
                if (currentSection == "GENERAL_NOTES")
                {
                    _generalNotes[key] = unescapedValue;
                }
                else if (!string.IsNullOrEmpty(currentKey))
                {
                    ProcessLoadedData(currentSection, currentKey, key, unescapedValue);
                }
            }
        }
        catch (Exception ex)
        {
            UnityEngine.Debug.LogError($"NotepadFileStorage: Failed to load - {ex.Message}");
        }
    }
    
    private void ProcessLoadedData(string section, string primaryKey, string dataKey, string value)
    {
        if (section == "ROLE_NOTES")
        {
            if (!_roleNotes.ContainsKey(primaryKey))
            {
                _roleNotes.Add(primaryKey, new Dictionary<string, string>());
            }
            _roleNotes[primaryKey][dataKey] = value;
        }
        else if (section == "PLAYER_NOTES")
        {
            if (!_playerNotes.ContainsKey(primaryKey))
            {
                _playerNotes.Add(primaryKey, new Dictionary<string, string>());
            }
            _playerNotes[primaryKey][dataKey] = value;
        }
    }
    
    private string EscapeValue(string value)
    {
        // Escape special characters for file storage
        return value
            .Replace("\\", "\\\\")
            .Replace("\n", "\\n")
            .Replace("\r", "\\r")
            .Replace("=", "\\=");
    }
    
    private string UnescapeValue(string value)
    {
        // Unescape special characters
        return value
            .Replace("\\=", "=")
            .Replace("\\r", "\r")
            .Replace("\\n", "\n")
            .Replace("\\\\", "\\");
    }
    
    /// <summary>
    /// Update loop - handles auto-save
    /// </summary>
    public void Update()
    {
        if (_hasUnsavedChanges && Time.realtimeSinceStartup - _lastSaveTime >= _autoSaveInterval)
        {
            SaveNow();
        }
    }
    
    /// <summary>
    /// Check if there are unsaved changes
    /// </summary>
    public bool HasUnsavedChanges() => _hasUnsavedChanges;
}

