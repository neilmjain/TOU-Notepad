using HarmonyLib;
using TOU_Notepad.Data;
using UnityEngine;
using TMPro;

namespace TOU_Notepad.Patches;

[HarmonyPatch(typeof(EndGameManager), nameof(EndGameManager.Start))]
public static class EndGameClipboardPatch
{
    public static void Postfix(EndGameManager __instance)
    {
        // Try to find the button safely
        Transform btnTransform = __instance.transform.Find("PlayAgainButton");
        if (btnTransform == null) btnTransform = __instance.transform.Find("PlayAgainBtn");
        
        PassiveButton playAgainBtn = btnTransform ? btnTransform.GetComponent<PassiveButton>() : null;

        if (playAgainBtn)
        {
            var btn = UnityEngine.Object.Instantiate(playAgainBtn, playAgainBtn.transform.parent);
            // Move it slightly to the side or down
            btn.transform.localPosition += new Vector3(2.5f, 0, 0); 
            btn.name = "CopyNotesButton";
            
            var tmPro = btn.GetComponentInChildren<TextMeshPro>();
            if (tmPro) tmPro.text = "Copy Notes";
            
            btn.OnClick.RemoveAllListeners();
            btn.OnClick.AddListener((UnityEngine.Events.UnityAction)TOU_Notepad.Data.ClipboardHelper.CopyToClipboard);

            // Also reset notes when returning to lobby via Play Again
            playAgainBtn.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => {
                NotepadData.Instance.Reset();
                NotepadFileStorage.Instance.NewGame();
            }));
        }
    }
}

