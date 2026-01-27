using System.Collections.Generic;

namespace TOU_Notepad.Data;

public class NotepadData
{
    private static NotepadData _instance;
    public static NotepadData Instance => _instance ??= new NotepadData();

    public string GeneralNotesLeft = "";
    public string GeneralNotesRight = "";
    
    // Key: Role ID (from MiraAPI), Value: User Note
    public Dictionary<string, string> RoleNotes = new(); 
    
    // Key: Player ID, Value: Player Note Info
    public Dictionary<byte, PlayerNoteInfo> PlayerNotes = new(); 

    public class PlayerNoteInfo
    {
        public string SuspectedRoleID; // The Role ID they are suspected to be
        public string Note;
    }

    public void Reset()
    {
        GeneralNotesLeft = "";
        GeneralNotesRight = "";
        RoleNotes.Clear();
        PlayerNotes.Clear();
    }
}
