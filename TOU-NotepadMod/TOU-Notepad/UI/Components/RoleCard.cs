using UnityEngine;
using UnityEngine.UI;
using TMPro;
using MiraAPI;
using TOU_Notepad.Data;

using Il2CppInterop.Runtime.InteropTypes.Arrays;

namespace TOU_Notepad.UI.Components;

public class RoleCard : MonoBehaviour
{
    public Image RoleIcon;
    public TextMeshProUGUI RoleNameText;
    public TextMeshProUGUI AlignmentText;
    public TMP_InputField NoteInput;
    
    private RoleBehaviour _role;
    private string _roleId;

    public void Setup(RoleBehaviour role)
    {
        _role = role;
        _roleId = role.StringName.ToString();
        
        if (RoleIcon) RoleIcon.sprite = role.RoleIconWhite;
        
        // Use StringName for localization usually, but here we just display it
        if (RoleNameText) RoleNameText.text = DestroyableSingleton<TranslationController>.Instance.GetString(role.StringName, new Il2CppInterop.Runtime.InteropTypes.Arrays.Il2CppReferenceArray<Il2CppSystem.Object>(0));
        
        if (AlignmentText)
        {
            AlignmentText.text = role.TeamType.ToString(); // Simplified
        }

        // Load existing note from file storage
        string note = NotepadFileStorage.Instance.GetRoleNote(_roleId);
        if (NoteInput) NoteInput.text = note;

        NoteInput.onValueChanged.RemoveAllListeners();
        NoteInput.onValueChanged.AddListener((UnityEngine.Events.UnityAction<string>)OnNoteChanged);
    }

    private void OnNoteChanged(string text)
    {
        NotepadFileStorage.Instance.SetRoleNote(_roleId, text);
    }
}
