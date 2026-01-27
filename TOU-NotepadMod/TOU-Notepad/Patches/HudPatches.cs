using HarmonyLib;
using TOU_Notepad.UI;
using UnityEngine;
using TOU_Notepad.Assets;

namespace TOU_Notepad.Patches;

[HarmonyPatch(typeof(HudManager), nameof(HudManager.Update))]
public static class HudUpdatePatch
{
    public static void Postfix(HudManager __instance)
    {
        if (NotepadPlugin.Instance == null || NotepadPlugin.Instance.OpenHotkey == null) return;
        
        // Don't open if chat is open
        if (__instance.Chat && __instance.Chat.IsOpenOrOpening) return;
        
        if (Input.GetKeyDown(NotepadPlugin.Instance.OpenHotkey.Value))
        {
            if (!NotepadMinigame.Instance)
            {
                OpenNotepad();
            }
        }
    }

    internal static void OpenNotepad()
    {
        if (NotepadMinigame.Instance) return;
        
        // Ensure loaded
        if (!NotepadAssets.NotepadPrefab) NotepadAssets.Load();
        
        GameObject prefab = NotepadAssets.NotepadPrefab;
        if (!prefab)
        {
            return;
        }

        var go = UnityEngine.Object.Instantiate(prefab);
        var minigame = go.GetComponent<NotepadMinigame>();
        if (minigame)
        {
            // Parent to HudManager to keep it organized, or root. 
            // Since it's Overlay, position doesn't matter, but lifecycle does.
            if (HudManager.Instance) 
                minigame.transform.SetParent(HudManager.Instance.transform, false);
            
            minigame.Open();
        }
    }
}

[HarmonyPatch(typeof(HudManager), nameof(HudManager.Start))]
public static class HudStartPatch
{
    public static void Postfix(HudManager __instance)
    {
        if (!__instance.MapButton) return;
        
        var mapBtn = __instance.MapButton;
        var btn = UnityEngine.Object.Instantiate(mapBtn, mapBtn.transform.parent);
        btn.name = "NotepadButton";
        
        // Move it below the map button
        btn.transform.localPosition = mapBtn.transform.localPosition + new Vector3(0, -0.8f, 0); 
        
        // Tint it cyan to distinguish it
        var renderer = btn.GetComponent<SpriteRenderer>();
        if (renderer) renderer.color = Color.cyan;
        
        btn.OnClick.RemoveAllListeners();
        btn.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => HudUpdatePatch.OpenNotepad()));
    }
}
