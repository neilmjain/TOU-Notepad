using HarmonyLib;
using TOU_Notepad.Data;

namespace TOU_Notepad.Patches;

[HarmonyPatch(typeof(AmongUsClient), nameof(AmongUsClient.OnGameEnd))]
public static class GameEndPatch
{
    public static void Postfix()
    {
        // Don't reset immediately if we want to export clipboard at EndGame screen
        // But the requirement says "Notes reset every game (stored in RAM only, wiped on GameEnd)"
        // AND "At GameEnd, add button... Export".
        // So we should probably reset on GameStart, not GameEnd, or reset on "Menu" return.
        
        // I'll reset on GameStart.
    }
}

[HarmonyPatch(typeof(ShipStatus), nameof(ShipStatus.Start))]
public static class GameStartPatch
{
    public static void Postfix()
    {
        NotepadData.Instance.Reset();
        NotepadFileStorage.Instance.NewGame();
    }
}
