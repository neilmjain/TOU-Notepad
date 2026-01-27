using System.Text;
using TOU_Notepad.Data;
using MiraAPI;
using UnityEngine;
using AmongUs.Data;

namespace TOU_Notepad.Data;

public static class ClipboardHelper
{
    public static string GetExportString()
    {
        StringBuilder sb = new StringBuilder();
        sb.AppendLine("== TOU Notepad Export ==");
        sb.AppendLine();
        
        sb.AppendLine("== General Notes (Left) ==");
        sb.AppendLine(NotepadData.Instance.GeneralNotesLeft);
        sb.AppendLine();
        sb.AppendLine("== General Notes (Right) ==");
        sb.AppendLine(NotepadData.Instance.GeneralNotesRight);
        sb.AppendLine();
        
        sb.AppendLine("== Role Notes ==");
        foreach (var kvp in NotepadData.Instance.RoleNotes)
        {
            if (!string.IsNullOrWhiteSpace(kvp.Value))
            {
                string name = kvp.Key; 
                // Ideally translate ID to Name if possible
                sb.AppendLine($"- {name}: {kvp.Value}");
            }
        }
        sb.AppendLine();
        
        sb.AppendLine("== Player Notes ==");
        foreach (var kvp in NotepadData.Instance.PlayerNotes)
        {
            byte pid = kvp.Key;
            var info = kvp.Value;
            string pName = $"Player_{pid}";
            
            if (GameData.Instance)
            {
                var pData = GameData.Instance.GetPlayerById(pid);
                if (pData != null) pName = pData.PlayerName;
            }
            
            sb.AppendLine($"Player: {pName}");
            if (!string.IsNullOrEmpty(info.SuspectedRoleID))
                sb.AppendLine($"  Suspected: {info.SuspectedRoleID}");
            if (!string.IsNullOrEmpty(info.Note))
                sb.AppendLine($"  Note: {info.Note}");
        }
        
        return sb.ToString();
    }
    
    public static void CopyToClipboard()
    {
        GUIUtility.systemCopyBuffer = GetExportString();
    }
}
