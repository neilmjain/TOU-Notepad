using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TOU_Notepad.UI.Tabs;
using AmongUs.Data;
using TMPro;
using TOU_Notepad.Data;

namespace TOU_Notepad.UI;

public class NotepadMinigame : MonoBehaviour
{
    public static NotepadMinigame Instance;
    public RectTransform WindowRect;

    // Tabs Scripts
    public PlayersTab PlayersTab;
    public GeneralTab GeneralTab;
    public RolesTab RolesTab;

    // Tab Content Objects
    public GameObject PlayersTabContent;
    public GameObject GeneralTabContent;
    public GameObject RolesTabContent;

    // Navigation Buttons
    public Button PlayersButton;
    public Button GeneralButton;
    public Button RolesButton;
    public Button CloseButton;

    // Overlay
    public GameObject MeetingTimerObject;
    public TextMeshProUGUI MeetingTimerText;

    // Current active tab state
    private enum TabState { General, Players, Roles }
    private TabState _currentTab = TabState.General;

    private void Awake()
    {
        Instance = this;
    }

    public void Open()
    {
        gameObject.SetActive(true);
        _currentTab = TabState.General;

        // Freeze player
        if (PlayerControl.LocalPlayer)
        {
            PlayerControl.LocalPlayer.moveable = false;
            Cursor.visible = true;
            Cursor.lockState = CursorLockMode.None;
        }
        
        // Setup Buttons with both Button and PassiveButton listeners for maximum compatibility
        SetupButtonListeners();
        
        // Initialize tab states
        ShowGeneralTab();
    }

    private void SetupButtonListeners()
    {
        // General Button
        if (GeneralButton)
        {
            GeneralButton.onClick.RemoveAllListeners();
            GeneralButton.onClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowGeneralTab()));
            
            // Also add PassiveButton if it exists
            var passive = GeneralButton.GetComponent<PassiveButton>();
            if (passive)
            {
                passive.OnClick.RemoveAllListeners();
                passive.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowGeneralTab()));
            }
        }
        
        // Players Button
        if (PlayersButton)
        {
            PlayersButton.onClick.RemoveAllListeners();
            PlayersButton.onClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowPlayersTab()));
            
            var passive = PlayersButton.GetComponent<PassiveButton>();
            if (passive)
            {
                passive.OnClick.RemoveAllListeners();
                passive.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowPlayersTab()));
            }
        }
        
        // Roles Button
        if (RolesButton)
        {
            RolesButton.onClick.RemoveAllListeners();
            RolesButton.onClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowRolesTab()));
            
            var passive = RolesButton.GetComponent<PassiveButton>();
            if (passive)
            {
                passive.OnClick.RemoveAllListeners();
                passive.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => ShowRolesTab()));
            }
        }
        
        // Close Button
        if (CloseButton)
        {
            CloseButton.onClick.RemoveAllListeners();
            CloseButton.onClick.AddListener((UnityEngine.Events.UnityAction)(() => Close()));
            
            var passive = CloseButton.GetComponent<PassiveButton>();
            if (passive)
            {
                passive.OnClick.RemoveAllListeners();
                passive.OnClick.AddListener((UnityEngine.Events.UnityAction)(() => Close()));
            }
        }
    }

    public void Close()
    {
        // Force save all data
        NotepadFileStorage.Instance.SaveNow();
        
        if (PlayerControl.LocalPlayer)
        {
            PlayerControl.LocalPlayer.moveable = true;
        }
        Destroy(gameObject);
    }

    public void ShowPlayersTab()
    {
        _currentTab = TabState.Players;
        
        if (PlayersTabContent) PlayersTabContent.SetActive(true);
        if (GeneralTabContent) GeneralTabContent.SetActive(false);
        if (RolesTabContent) RolesTabContent.SetActive(false);
        
        if (PlayersTab) PlayersTab.OnOpen();
        
        UpdateTabButtonStates();
    }

    public void ShowGeneralTab()
    {
        _currentTab = TabState.General;
        
        if (PlayersTabContent) PlayersTabContent.SetActive(false);
        if (GeneralTabContent) GeneralTabContent.SetActive(true);
        if (RolesTabContent) RolesTabContent.SetActive(false);
        
        if (GeneralTab) GeneralTab.OnOpen();
        
        UpdateTabButtonStates();
    }

    public void ShowRolesTab()
    {
        _currentTab = TabState.Roles;
        
        if (PlayersTabContent) PlayersTabContent.SetActive(false);
        if (GeneralTabContent) GeneralTabContent.SetActive(false);
        if (RolesTabContent) RolesTabContent.SetActive(true);
        
        if (RolesTab) RolesTab.OnOpen();
        
        UpdateTabButtonStates();
    }

    private void UpdateTabButtonStates()
    {
        // Highlight active tab with different color
        Color activeColor = new Color32(120, 180, 220, 255);
        Color inactiveColor = new Color32(70, 130, 180, 255);
        
        if (GeneralButton)
        {
            var colors = GeneralButton.colors;
            colors.normalColor = _currentTab == TabState.General ? activeColor : inactiveColor;
            colors.selectedColor = colors.normalColor;
            GeneralButton.colors = colors;
        }
        
        if (PlayersButton)
        {
            var colors = PlayersButton.colors;
            colors.normalColor = _currentTab == TabState.Players ? activeColor : inactiveColor;
            colors.selectedColor = colors.normalColor;
            PlayersButton.colors = colors;
        }
        
        if (RolesButton)
        {
            var colors = RolesButton.colors;
            colors.normalColor = _currentTab == TabState.Roles ? activeColor : inactiveColor;
            colors.selectedColor = colors.normalColor;
            RolesButton.colors = colors;
        }
    }
    
    private void Update()
    {
        // Close on ESC
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            Close();
            return;
        }

        // Timer Logic
        if (MeetingTimerObject)
        {
            if (MeetingHud.Instance)
            {
                if (!MeetingTimerObject.activeSelf) MeetingTimerObject.SetActive(true);
                float time = MeetingHud.Instance.discussionTimer; 
                if (MeetingTimerText)
                {
                    MeetingTimerText.text = Mathf.CeilToInt(time).ToString();
                }
            }
            else
            {
                MeetingTimerObject.SetActive(false);
            }
        }
    }

    private void OnDestroy()
    {
        if (Instance == this) Instance = null;
    }
}
