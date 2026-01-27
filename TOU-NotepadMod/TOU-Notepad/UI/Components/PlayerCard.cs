using UnityEngine;
using UnityEngine.UI;
using TMPro;
using MiraAPI;
using TOU_Notepad.Data;
using AmongUs.Data;
using System.Collections.Generic;

namespace TOU_Notepad.UI.Components;

public class PlayerCard : MonoBehaviour
{
    public Image BodyImage;
    public TextMeshProUGUI PlayerNameText;
    public TextMeshProUGUI StatusText; // Alive/Dead
    public TMP_Dropdown SuspectedRoleDropdown;
    public TMP_InputField NoteInput;
    public Image SuspectedRoleIcon;
    public TextMeshProUGUI SuspectedRoleText;
    public TextMeshProUGUI CosmeticsText;

    private byte _playerId;
    private List<string> _roleIds = new();
    private List<RoleBehaviour> _roles = new();

    public void Setup(PlayerControl player)
    {
        _playerId = player.PlayerId;
        if (PlayerNameText) PlayerNameText.text = player.Data.PlayerName;
        
        // Body Color
        if (BodyImage)
        {
             // Assuming simple color tint for now
             int colorId = player.Data.DefaultOutfit.ColorId;
             if (colorId >= 0 && colorId < Palette.PlayerColors.Length)
             {
                 BodyImage.color = Palette.PlayerColors[colorId];
             }
        }
        
        if (StatusText)
        {
            StatusText.text = player.Data.IsDead ? "Dead" : "Alive";
            StatusText.color = player.Data.IsDead ? Color.red : Color.green;
        }

        // Cosmetics summary (IDs; safe and always available)
        if (CosmeticsText)
        {
            var outfit = player.Data.DefaultOutfit;
            CosmeticsText.text = $"Hat {outfit.HatId} • Skin {outfit.SkinId} • Visor {outfit.VisorId}";
        }

        // Populate Dropdown
        PopulateRoles();

        // Load Data from file storage
        var (note, suspectedRole) = NotepadFileStorage.Instance.GetPlayerNote(_playerId.ToString());
        
        if (NoteInput) NoteInput.text = note;
        
        // Find index of role
        if (SuspectedRoleDropdown)
        {
            int idx = -1;
            if (!string.IsNullOrEmpty(suspectedRole))
            {
                idx = _roleIds.IndexOf(suspectedRole);
            }
            SuspectedRoleDropdown.value = idx + 1; // +1 for "None"
        }

        if (NoteInput)
        {
            NoteInput.onValueChanged.RemoveAllListeners();
            NoteInput.onValueChanged.AddListener((UnityEngine.Events.UnityAction<string>)OnNoteChanged);
        }
        
        if (SuspectedRoleDropdown)
        {
            SuspectedRoleDropdown.onValueChanged.RemoveAllListeners();
            SuspectedRoleDropdown.onValueChanged.AddListener((UnityEngine.Events.UnityAction<int>)OnRoleChanged);
        }
    }

    private void PopulateRoles()
    {
        if (!SuspectedRoleDropdown) return;

        SuspectedRoleDropdown.ClearOptions();
        _roleIds.Clear();
        _roles.Clear();
        var il2cppOptions = new Il2CppSystem.Collections.Generic.List<TMP_Dropdown.OptionData>();
        il2cppOptions.Add(new TMP_Dropdown.OptionData("None"));
        
        if (RoleManager.Instance != null)
        {
            foreach (var role in RoleManager.Instance.AllRoles)
            {
                var name = DestroyableSingleton<TranslationController>.Instance.GetString(role.StringName, new Il2CppInterop.Runtime.InteropTypes.Arrays.Il2CppReferenceArray<Il2CppSystem.Object>(0));
                var od = new TMP_Dropdown.OptionData(name, role.RoleIconWhite);
                il2cppOptions.Add(od);
                _roleIds.Add(role.StringName.ToString()); // Use ID
                _roles.Add(role);
            }
        }
        SuspectedRoleDropdown.AddOptions(il2cppOptions);
    }

    private void OnNoteChanged(string text)
    {
        UpdateData(text, null);
    }

    private void OnRoleChanged(int index)
    {
        string roleId = index > 0 ? _roleIds[index - 1] : "";
        if (SuspectedRoleIcon) SuspectedRoleIcon.sprite = index > 0 ? _roles[index - 1].RoleIconWhite : null;
        if (SuspectedRoleText)
        {
            if (index > 0)
            {
                var r = _roles[index - 1];
                var name = DestroyableSingleton<TranslationController>.Instance.GetString(r.StringName, new Il2CppInterop.Runtime.InteropTypes.Arrays.Il2CppReferenceArray<Il2CppSystem.Object>(0));
                SuspectedRoleText.text = name + " (" + r.TeamType.ToString() + ")";
            }
            else
            {
                SuspectedRoleText.text = "";
            }
        }
        UpdateData(null, roleId);
    }

    private void UpdateData(string note, string roleId)
    {
        string currentNote = NoteInput ? NoteInput.text : "";
        string currentRole = "";
        
        if (SuspectedRoleDropdown && SuspectedRoleDropdown.value > 0)
        {
            currentRole = _roleIds[SuspectedRoleDropdown.value - 1];
        }
        
        if (note != null) currentNote = note;
        if (roleId != null) currentRole = roleId;
        
        NotepadFileStorage.Instance.SetPlayerNote(_playerId.ToString(), currentNote, currentRole);
    }

    public void SaveNote()
    {
        UpdateData(null, null);
    }
}
