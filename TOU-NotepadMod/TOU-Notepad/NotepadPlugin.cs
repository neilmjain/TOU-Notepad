using System.Globalization;
using BepInEx;
using BepInEx.Configuration;
using BepInEx.Unity.IL2CPP;
using HarmonyLib;
using Il2CppInterop.Runtime.Injection;
using MiraAPI;
using MiraAPI.PluginLoading;
using Reactor;
using Reactor.Networking;
using Reactor.Networking.Attributes;
using Reactor.Utilities;
using TownOfUs;
using UnityEngine;
using TOU_Notepad.UI;
using TOU_Notepad.UI.Tabs;
using TOU_Notepad.UI.Components;
using TOU_Notepad.Data;

namespace TOU_Notepad;

[BepInAutoPlugin("idkimneil.tou.notepad", "TOU Notepad")]
[BepInProcess("Among Us.exe")]
[BepInDependency(ReactorPlugin.Id)]
[BepInDependency(MiraApiPlugin.Id)]
[BepInDependency(TownOfUsPlugin.Id)]
[ReactorModFlags(ModFlags.RequireOnAllClients)]
public partial class NotepadPlugin : BasePlugin, IMiraPlugin
{
    public static NotepadPlugin Instance;

    /// <summary>
    ///     Gets the specified Culture for string manipulations.
    /// </summary>
    public static CultureInfo Culture => TownOfUs.TownOfUsPlugin.Culture;

    /// <inheritdoc />
    public string OptionsTitleText => "TOU Notepad";

    /// <summary>
    ///     Determines if the current build is a dev build or not.
    /// </summary>
    public static bool IsDevBuild => true;

    /// <inheritdoc />
    public ConfigFile GetConfigFile()
    {
        return Config;
    }

    public Harmony Harmony { get; } = new(Id);

    public ConfigEntry<KeyCode> OpenHotkey { get; private set; }

    public override void Load()
    {
        Instance = this;
        OpenHotkey = Config.Bind("General", "Open Hotkey", KeyCode.N, "Key to open the Notepad");

        Harmony.PatchAll();

        // Register custom types for IL2CPP
        ClassInjector.RegisterTypeInIl2Cpp<NotepadMinigame>();
        ClassInjector.RegisterTypeInIl2Cpp<PlayersTab>();
        ClassInjector.RegisterTypeInIl2Cpp<GeneralTab>();
        ClassInjector.RegisterTypeInIl2Cpp<RolesTab>();
        ClassInjector.RegisterTypeInIl2Cpp<RoleCard>();
        ClassInjector.RegisterTypeInIl2Cpp<PlayerCard>();
        
        // Load Assets - Lazy load when needed instead
        // TOU_Notepad.Assets.NotepadAssets.Load();
    }
}
