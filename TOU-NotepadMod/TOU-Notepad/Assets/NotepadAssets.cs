using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using TOU_Notepad.UI;
using TOU_Notepad.UI.Components;
using TOU_Notepad.UI.Tabs;
using UnityEngine.EventSystems;

namespace TOU_Notepad.Assets;

public static class NotepadAssets
{
    public static GameObject NotepadPrefab;
    private static TMP_FontAsset _defaultFont;

    public static void Load()
    {
        if (NotepadPrefab) return;
        CreateCodeBasedUI();
    }

    private static void CreateCodeBasedUI()
    {
        // Try to find a font from existing UI
        if (_defaultFont == null)
        {
            var existingTmp = UnityEngine.Object.FindObjectOfType<TextMeshProUGUI>();
            if (existingTmp) _defaultFont = existingTmp.font;
        }

        // 1. Create Main Object
        var go = new GameObject("NotepadMinigame");
        go.layer = 5; // UI Layer
        UnityEngine.Object.DontDestroyOnLoad(go);
        go.SetActive(false);
        
        var minigame = go.AddComponent<NotepadMinigame>();
        var canvas = go.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = 100; // Above most things
        var scaler = go.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        go.AddComponent<GraphicRaycaster>();

        // 2. Dimmer (Background Overlay)
        var dimmer = CreatePanel(go.transform, "Dimmer", new Color(0f, 0f, 0f, 0.5f));
        Stretch(dimmer.rectTransform);
        dimmer.raycastTarget = false;

        // Removed outside click overlay to prevent intercepting tab/close button clicks

        // 3. Window Container - Cardboard-style notepad with rounded corners
        var window = CreatePanel(go.transform, "Window", new Color32(160, 120, 80, 255)); // Brown cardboard
        var windowRect = window.rectTransform;
        SetAnchor(windowRect, 0.5f, 0.5f, 0.5f, 0.5f);
        windowRect.sizeDelta = new Vector2(900, 650);
        
        // Thick cartoonish outline
        var windowOutline = window.gameObject.AddComponent<Outline>();
        windowOutline.effectColor = new Color32(60, 40, 20, 255);
        windowOutline.effectDistance = new Vector2(5, -5);
        
        // Large rounded corners (20px)
        AddRoundedCorners(window.transform, new Color32(180, 140, 90, 255), 20f);
        
        minigame.WindowRect = windowRect;
        
        // 4. Header - Dark tab bar with rounded corners
        var header = CreatePanel(window.transform, "Header", new Color32(50, 50, 70, 255));
        SetAnchor(header.rectTransform, 0, 1, 1, 1);
        header.rectTransform.sizeDelta = new Vector2(0, 55);
        header.rectTransform.anchoredPosition = new Vector2(0, -27);
        
        // Add rounded corners to header
        AddRoundedCorners(header.transform, new Color32(50, 50, 70, 255), 16f);

        // 5. Content Area
        var contentArea = CreatePanel(window.transform, "ContentArea", Color.clear);
        SetAnchor(contentArea.rectTransform, 0, 0, 1, 1);
        contentArea.rectTransform.offsetMax = new Vector2(0, -60); // Top padding for header
        contentArea.rectTransform.offsetMin = new Vector2(20, 20); // Padding sides/bottom
        contentArea.rectTransform.offsetMax = new Vector2(-20, -60);

        // 6. Tabs
        var playersContent = CreatePanel(contentArea.transform, "PlayersTab", Color.clear);
        Stretch(playersContent.rectTransform);
        var generalContent = CreatePanel(contentArea.transform, "GeneralTab", Color.clear);
        Stretch(generalContent.rectTransform);
        var rolesContent = CreatePanel(contentArea.transform, "RolesTab", Color.clear);
        Stretch(rolesContent.rectTransform);

        minigame.PlayersTabContent = playersContent.gameObject;
        minigame.GeneralTabContent = generalContent.gameObject;
        minigame.RolesTabContent = rolesContent.gameObject;

        // 6. Tab Buttons
        var hlg = header.gameObject.AddComponent<HorizontalLayoutGroup>();
        hlg.childAlignment = TextAnchor.MiddleCenter;
        hlg.childControlWidth = false;
        hlg.childForceExpandWidth = false;
        hlg.spacing = 10;
        hlg.padding = new RectOffset { left = 10, right = 10, top = 5, bottom = 5 };

        var playersBtn = CreateButton(header.transform, "PlayersBtn", "Players", 150, 50);
        var generalBtn = CreateButton(header.transform, "GeneralBtn", "General", 150, 50);
        var rolesBtn = CreateButton(header.transform, "RolesBtn", "Roles", 150, 50);
        
        // Close Button (Right Aligned - Manual positioning or spacer)
        // We'll just parent it to header but ignore layout or use a separate container
        var closeBtn = CreateButton(header.transform, "CloseBtn", "X", 50, 50);
        var le = closeBtn.gameObject.AddComponent<LayoutElement>();
        le.ignoreLayout = true;
        SetAnchor(closeBtn.GetComponent<RectTransform>(), 1, 0.5f, 1, 0.5f);
        closeBtn.GetComponent<RectTransform>().anchoredPosition = new Vector2(-35, 0);

        minigame.PlayersButton = playersBtn.GetComponent<Button>();
        minigame.GeneralButton = generalBtn.GetComponent<Button>();
        minigame.RolesButton = rolesBtn.GetComponent<Button>();
        minigame.CloseButton = closeBtn.GetComponent<Button>();

        // 7. Initialize Tabs
        BuildPlayersTab(playersContent.gameObject, minigame);
        BuildGeneralTab(generalContent.gameObject, minigame);
        BuildRolesTab(rolesContent.gameObject, minigame);

        // 9. Resize Handle (bottom-right)
        var resize = CreatePanel(window.transform, "ResizeHandle", new Color(1, 1, 1, 0.01f));
        var resizeRect = resize.rectTransform;
        SetAnchor(resizeRect, 1, 0, 1, 0);
        resizeRect.sizeDelta = new Vector2(24, 24);
        resizeRect.anchoredPosition = new Vector2(-12, 12);
        var et = resize.gameObject.AddComponent<EventTrigger>();
        var dragEntry = new EventTrigger.Entry { eventID = EventTriggerType.Drag };
        dragEntry.callback.AddListener((UnityEngine.Events.UnityAction<BaseEventData>)((data) =>
        {
            var ped = data as PointerEventData;
            if (ped == null) return;
            var size = windowRect.sizeDelta;
            size += new Vector2(ped.delta.x, -ped.delta.y);
            size.x = Mathf.Clamp(size.x, 600, 1400);
            size.y = Mathf.Clamp(size.y, 400, 1000);
            windowRect.sizeDelta = size;
        }));
        et.triggers.Add(dragEntry);

        // 8. Meeting Timer (Overlay)
        var timerObj = CreatePanel(go.transform, "MeetingTimer", new Color(0, 0, 0, 0.8f));
        timerObj.rectTransform.sizeDelta = new Vector2(200, 60);
        timerObj.rectTransform.anchoredPosition = new Vector2(0, 300); // Top centerish
        var timerText = CreateText(timerObj.transform, "TimerText", "00");
        timerText.fontSize = 36;
        timerText.alignment = TextAlignmentOptions.Center;
        Stretch(timerText.rectTransform);
        
        minigame.MeetingTimerObject = timerObj.gameObject;
        minigame.MeetingTimerText = timerText;
        timerObj.gameObject.SetActive(false);

        NotepadPrefab = go;
    }


    private static void BuildPlayersTab(GameObject parent, NotepadMinigame minigame)
    {
        var tab = parent.AddComponent<PlayersTab>();
        minigame.PlayersTab = tab;

        var folder = CreatePanel(parent.transform, "FolderPlayers", new Color32(139, 90, 43, 255));
        var folderRect = folder.rectTransform;
        SetAnchor(folderRect, 0.5f, 0.5f, 0.5f, 0.5f);
        folderRect.sizeDelta = new Vector2(820, 580);
        var folderOutline = folder.gameObject.AddComponent<Outline>();
        folderOutline.effectColor = new Color32(60, 40, 20, 255);
        folderOutline.effectDistance = new Vector2(4, -4);
        AddRoundedCorners(folder.transform, new Color32(139, 90, 43, 255), 24f);

        var leftPage = CreatePanel(folder.transform, "LeftPage", new Color32(252, 251, 245, 255));
        var lp = leftPage.rectTransform;
        SetAnchor(lp, 0, 0, 0.5f, 1);
        lp.offsetMin = new Vector2(14, 20);
        lp.offsetMax = new Vector2(-6, -20);
        AddRoundedCorners(leftPage.transform, new Color32(220, 218, 210, 255), 8f);

        var rightPage = CreatePanel(folder.transform, "RightPage", new Color32(252, 251, 245, 255));
        var rp = rightPage.rectTransform;
        SetAnchor(rp, 0.5f, 0, 1, 1);
        rp.offsetMin = new Vector2(6, 20);
        rp.offsetMax = new Vector2(-14, -20);
        AddRoundedCorners(rightPage.transform, new Color32(220, 218, 210, 255), 8f);

        var spine = CreatePanel(folder.transform, "Spine", new Color32(200, 170, 100, 255));
        var sp = spine.rectTransform;
        SetAnchor(sp, 0.5f, 0, 0.5f, 1);
        sp.sizeDelta = new Vector2(6, 0);

        var leftGridGO = new GameObject("LeftGrid");
        leftGridGO.transform.SetParent(leftPage.transform, false);
        var leftGridRect = leftGridGO.AddComponent<RectTransform>();
        Stretch(leftGridRect);
        leftGridRect.offsetMin = new Vector2(12, 12);
        leftGridRect.offsetMax = new Vector2(-12, -12);
        var leftGrid = leftGridGO.AddComponent<GridLayoutGroup>();
        leftGrid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
        leftGrid.constraintCount = 2;
        leftGrid.cellSize = new Vector2(180, 90);
        leftGrid.spacing = new Vector2(12, 12);
        leftGrid.childAlignment = TextAnchor.UpperLeft;

        var rightGridGO = new GameObject("RightGrid");
        rightGridGO.transform.SetParent(rightPage.transform, false);
        var rightGridRect = rightGridGO.AddComponent<RectTransform>();
        Stretch(rightGridRect);
        rightGridRect.offsetMin = new Vector2(12, 12);
        rightGridRect.offsetMax = new Vector2(-12, -12);
        var rightGrid = rightGridGO.AddComponent<GridLayoutGroup>();
        rightGrid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
        rightGrid.constraintCount = 2;
        rightGrid.cellSize = new Vector2(180, 90);
        rightGrid.spacing = new Vector2(12, 12);
        rightGrid.childAlignment = TextAnchor.UpperLeft;

        tab.LeftGridContainer = leftGridGO.transform;
        tab.RightGridContainer = rightGridGO.transform;
        tab.PlayerCardPrefab = CreatePlayerCardPrefab();
    }

    private static void BuildGeneralTab(GameObject parent, NotepadMinigame minigame)
    {
        var tab = parent.AddComponent<GeneralTab>();
        minigame.GeneralTab = tab;

        var folder = CreatePanel(parent.transform, "FolderGeneral", new Color32(255, 255, 255, 255));
        var folderRect = folder.rectTransform;
        SetAnchor(folderRect, 0.5f, 0.5f, 0.5f, 0.5f);
        folderRect.sizeDelta = new Vector2(820, 580);
        var folderOutline = folder.gameObject.AddComponent<Outline>();
        folderOutline.effectColor = new Color32(60, 40, 20, 255);
        folderOutline.effectDistance = new Vector2(4, -4);
        AddRoundedCorners(folder.transform, new Color32(255, 255, 255, 255), 20f);
        var leftPage = CreatePanel(folder.transform, "LeftPage", new Color32(255, 255, 255, 255));
        var lp = leftPage.rectTransform;
        SetAnchor(lp, 0, 0, 0.5f, 1);
        lp.offsetMin = new Vector2(14, 20);
        lp.offsetMax = new Vector2(-6, -20);
        AddRoundedCorners(leftPage.transform, new Color32(220, 218, 210, 255), 8f);
        var lpMask = leftPage.gameObject.AddComponent<Mask>();
        lpMask.showMaskGraphic = false;

        var rightPage = CreatePanel(folder.transform, "RightPage", new Color32(255, 255, 255, 255));
        var rp = rightPage.rectTransform;
        SetAnchor(rp, 0.5f, 0, 1, 1);
        rp.offsetMin = new Vector2(6, 20);
        rp.offsetMax = new Vector2(-14, -20);
        AddRoundedCorners(rightPage.transform, new Color32(220, 218, 210, 255), 8f);
        var rpMask = rightPage.gameObject.AddComponent<Mask>();
        rpMask.showMaskGraphic = false;

        var spine = CreatePanel(folder.transform, "Spine", new Color32(200, 170, 100, 255));
        var sp = spine.rectTransform;
        SetAnchor(sp, 0.5f, 0, 0.5f, 1);
        sp.sizeDelta = new Vector2(6, 0);

        System.Action<Transform> buildPageLines = (Transform page) =>
        {
            var margin = CreatePanel(page, "Margin", new Color32(200, 80, 80, 180));
            var mr = margin.rectTransform;
            SetAnchor(mr, 0, 1, 0, 0);
            mr.sizeDelta = new Vector2(3, 0);
            mr.anchoredPosition = new Vector2(35, 0);
            margin.raycastTarget = false;

            var holes = new GameObject("Holes");
            holes.transform.SetParent(page, false);
            var holesRect = holes.AddComponent<RectTransform>();
            SetAnchor(holesRect, 0, 0, 0, 1);
            holesRect.sizeDelta = new Vector2(40, 0);
            for (int i = 0; i < 11; i++)
            {
                var dot = CreatePanel(holes.transform, "Hole" + i, new Color32(255, 255, 255, 255));
                var dr = dot.rectTransform;
                dr.sizeDelta = new Vector2(10, 10);
                SetAnchor(dr, 0, 1, 0, 1);
                dr.anchoredPosition = new Vector2(20, -50 - i * 40);
                dot.gameObject.AddComponent<Outline>().effectColor = new Color32(180, 180, 180, 255);
            }

            var linesGO = new GameObject("Lines");
            linesGO.transform.SetParent(page, false);
            var linesRect = linesGO.AddComponent<RectTransform>();
            Stretch(linesRect);
            linesRect.offsetMin = new Vector2(50, 40);
            linesRect.offsetMax = new Vector2(-10, -40);
            for (int i = 0; i < 14; i++)
            {
                var ln = CreatePanel(linesGO.transform, "Line" + i, new Color(0.4f, 0.6f, 0.9f, 0.35f));
                var lr = ln.rectTransform;
                SetAnchor(lr, 0, 1, 1, 1);
                lr.sizeDelta = new Vector2(0, 2);
                lr.anchoredPosition = new Vector2(0, -i * 28);
                ln.raycastTarget = false;
            }
        };

        buildPageLines(leftPage.transform);
        buildPageLines(rightPage.transform);

        var leftInput = CreateInputField(leftPage.transform, "LeftNotes", "Type your notes...", 360, 420);
        var leftRect = leftInput.GetComponent<RectTransform>();
        Stretch(leftRect);
        leftRect.offsetMin = new Vector2(55, 45);
        leftRect.offsetMax = new Vector2(-20, -45);
        leftInput.lineType = TMP_InputField.LineType.MultiLineNewline;
        leftInput.textComponent.alignment = TextAlignmentOptions.TopLeft;
        leftInput.textComponent.color = Color.black;
        leftInput.GetComponent<Image>().color = new Color(1f, 1f, 1f, 0f);
        if (leftInput.placeholder is TextMeshProUGUI lph) lph.alignment = TextAlignmentOptions.TopLeft;

        var rightInput = CreateInputField(rightPage.transform, "RightNotes", "Type your notes...", 360, 420);
        var rightRect = rightInput.GetComponent<RectTransform>();
        Stretch(rightRect);
        rightRect.offsetMin = new Vector2(55, 45);
        rightRect.offsetMax = new Vector2(-20, -45);
        rightInput.lineType = TMP_InputField.LineType.MultiLineNewline;
        rightInput.textComponent.alignment = TextAlignmentOptions.TopLeft;
        rightInput.textComponent.color = Color.black;
        rightInput.GetComponent<Image>().color = new Color(1f, 1f, 1f, 0f);
        if (rightInput.placeholder is TextMeshProUGUI rph) rph.alignment = TextAlignmentOptions.TopLeft;

        tab.LeftNoteInput = leftInput;
        tab.RightNoteInput = rightInput;
    }

    private static void BuildRolesTab(GameObject parent, NotepadMinigame minigame)
    {
        var tab = parent.AddComponent<RolesTab>();
        minigame.RolesTab = tab;

        var folder = CreatePanel(parent.transform, "FolderRoles", new Color32(100, 100, 130, 255));
        var folderRect = folder.rectTransform;
        SetAnchor(folderRect, 0.5f, 0.5f, 0.5f, 0.5f);
        folderRect.sizeDelta = new Vector2(820, 580);
        var folderOutline = folder.gameObject.AddComponent<Outline>();
        folderOutline.effectColor = new Color32(60, 40, 20, 255);
        folderOutline.effectDistance = new Vector2(4, -4);
        AddRoundedCorners(folder.transform, new Color32(100, 100, 130, 255), 20f);

        // Search and Sort Bar - Positioned at TOP of folder inside
        var searchBar = CreatePanel(folder.transform, "SearchBar", new Color32(80, 80, 110, 200));
        var searchRect = searchBar.rectTransform;
        SetAnchor(searchRect, 0, 1, 1, 1);
        searchRect.anchoredPosition = new Vector2(0, -25);
        searchRect.sizeDelta = new Vector2(-20, 45);
        searchRect.offsetMin = new Vector2(10, 0);
        searchRect.offsetMax = new Vector2(-10, 0);

        var searchInput = CreateInputField(searchBar.transform, "SearchInput", "Search roles...", 250, 32);
        var searchInputRect = searchInput.GetComponent<RectTransform>();
        SetAnchor(searchInputRect, 0, 0.5f, 0, 0.5f);
        searchInputRect.anchoredPosition = new Vector2(140, 0);
        searchInputRect.sizeDelta = new Vector2(250, 32);
        searchInput.lineType = TMP_InputField.LineType.SingleLine;
        searchInput.textComponent.alignment = TextAlignmentOptions.Left;
        searchInput.textComponent.color = Color.black;
        searchInput.GetComponent<Image>().color = new Color(1f, 1f, 1f, 0.9f);
        if (searchInput.placeholder is TextMeshProUGUI sph) sph.alignment = TextAlignmentOptions.Left;

        var sortDropdownObj = new GameObject("SortDropdown");
        sortDropdownObj.transform.SetParent(searchBar.transform, false);
        var sortDropdown = sortDropdownObj.AddComponent<TMP_Dropdown>();
        var sortRect = sortDropdownObj.GetComponent<RectTransform>();
        sortRect.sizeDelta = new Vector2(150, 32);
        SetAnchor(sortRect, 1, 0.5f, 1, 0.5f);
        sortRect.anchoredPosition = new Vector2(-90, 0);
        
        // Add sort options
        var sortOptions = new Il2CppSystem.Collections.Generic.List<TMP_Dropdown.OptionData>();
        sortOptions.Add(new TMP_Dropdown.OptionData("Name"));
        sortOptions.Add(new TMP_Dropdown.OptionData("Alignment"));
        sortDropdown.AddOptions(sortOptions);
        sortDropdown.value = 0;

        tab.SearchInput = searchInput;
        tab.SortDropdown = sortDropdown;

        // Content area for role cards - Positioned BELOW search bar
        var contentPanel = CreatePanel(folder.transform, "ContentPanel", new Color32(90, 90, 120, 255));
        var contentRect = contentPanel.rectTransform;
        SetAnchor(contentRect, 0, 0, 1, 1);
        contentRect.offsetMin = new Vector2(10, 55); // Start below search bar
        contentRect.offsetMax = new Vector2(-10, -10); // Leave padding at bottom
        
        var scroll = CreateScrollView(contentPanel.transform, "RoleScroll");
        tab.ContentContainer = scroll.content;

        tab.RoleCardPrefab = CreateRoleCardPrefab();
    }

    // --- Prefab Builders ---

    private static GameObject CreateRoleCardPrefab()
    {
        var go = CreatePanel(null, "RoleCard", new Color(0.3f, 0.3f, 0.3f, 1f));
        go.gameObject.SetActive(false);
        var layout = go.gameObject.AddComponent<LayoutElement>();
        layout.minHeight = 80;
        layout.preferredHeight = 80;

        var card = go.gameObject.AddComponent<RoleCard>();
        
        // Icon
        var iconObj = new GameObject("Icon");
        iconObj.transform.SetParent(go.transform, false);
        var iconImg = iconObj.AddComponent<Image>();
        iconImg.color = Color.white;
        var iconRect = iconObj.GetComponent<RectTransform>();
        iconRect.sizeDelta = new Vector2(60, 60);
        iconRect.anchoredPosition = new Vector2(40, 0);
        SetAnchor(iconRect, 0, 0.5f, 0, 0.5f);
        card.RoleIcon = iconImg;

        // Name
        var nameText = CreateText(go.transform, "Name", "Role Name");
        var nameRect = nameText.rectTransform;
        SetAnchor(nameRect, 0, 0.5f, 0, 0.5f);
        nameRect.anchoredPosition = new Vector2(150, 15);
        nameRect.sizeDelta = new Vector2(200, 30);
        card.RoleNameText = nameText;

        // Alignment
        var alignText = CreateText(go.transform, "Alignment", "Crewmate");
        alignText.fontSize = 14;
        alignText.color = Color.gray;
        var alignRect = alignText.rectTransform;
        SetAnchor(alignRect, 0, 0.5f, 0, 0.5f);
        alignRect.anchoredPosition = new Vector2(150, -15);
        alignRect.sizeDelta = new Vector2(200, 30);
        card.AlignmentText = alignText;

        // Note Input
        var noteInput = CreateInputField(go.transform, "Note", "Notes...", 300, 60);
        var noteRect = noteInput.GetComponent<RectTransform>();
        SetAnchor(noteRect, 1, 0.5f, 1, 0.5f);
        noteRect.anchoredPosition = new Vector2(-160, 0);
        card.NoteInput = noteInput;

        return go.gameObject;
    }

    private static GameObject CreatePlayerCardPrefab()
    {
        var go = CreatePanel(null, "PlayerCard", new Color(0.3f, 0.3f, 0.3f, 1f));
        go.gameObject.SetActive(false);
        var layout = go.gameObject.AddComponent<LayoutElement>();
        layout.minHeight = 60;
        layout.preferredHeight = 60;

        var card = go.gameObject.AddComponent<PlayerCard>();

        // Body Color (Image)
        var bodyObj = new GameObject("Body");
        bodyObj.transform.SetParent(go.transform, false);
        var bodyImg = bodyObj.AddComponent<Image>();
        var bodyRect = bodyObj.GetComponent<RectTransform>();
        bodyRect.sizeDelta = new Vector2(48, 48);
        SetAnchor(bodyRect, 0, 0.5f, 0, 0.5f);
        bodyRect.anchoredPosition = new Vector2(36, 0);
        card.BodyImage = bodyImg;

        // Cosmetics Text (Hat/Skin/Visor)
        var cosText = CreateText(go.transform, "Cosmetics", "");
        var cosRect = cosText.rectTransform;
        SetAnchor(cosRect, 0, 0.5f, 0, 0.5f);
        cosRect.anchoredPosition = new Vector2(150, -18);
        cosText.fontSize = 12;
        cosText.color = new Color32(180, 180, 200, 255);
        card.CosmeticsText = cosText;

        // Name
        var nameText = CreateText(go.transform, "Name", "Player Name");
        var nameRect = nameText.rectTransform;
        SetAnchor(nameRect, 0, 0.5f, 0, 0.5f);
        nameRect.anchoredPosition = new Vector2(150, 10);
        card.PlayerNameText = nameText;

        // Suspected Role Dropdown
        var roleDropdownObj = new GameObject("SuspectedRole");
        roleDropdownObj.transform.SetParent(go.transform, false);
        var roleDropdown = roleDropdownObj.AddComponent<TMP_Dropdown>();
        var roleRect = roleDropdownObj.GetComponent<RectTransform>();
        roleRect.sizeDelta = new Vector2(180, 36);
        SetAnchor(roleRect, 1, 0.5f, 1, 0.5f);
        roleRect.anchoredPosition = new Vector2(-330, 0);
        card.SuspectedRoleDropdown = roleDropdown;

        // Suspected Role Icon
        var suspectedIconObj = new GameObject("SuspectedIcon");
        suspectedIconObj.transform.SetParent(go.transform, false);
        var suspectedIcon = suspectedIconObj.AddComponent<Image>();
        var suspectedIconRect = suspectedIconObj.GetComponent<RectTransform>();
        suspectedIconRect.sizeDelta = new Vector2(32, 32);
        SetAnchor(suspectedIconRect, 1, 0.5f, 1, 0.5f);
        suspectedIconRect.anchoredPosition = new Vector2(-145, 0);
        card.SuspectedRoleIcon = suspectedIcon;

        // Suspected Role Text
        var suspectedText = CreateText(go.transform, "SuspectedText", "");
        var suspectedTextRect = suspectedText.rectTransform;
        SetAnchor(suspectedTextRect, 1, 0.5f, 1, 0.5f);
        suspectedTextRect.anchoredPosition = new Vector2(-260, -16);
        suspectedText.fontSize = 14;
        card.SuspectedRoleText = suspectedText;

        // Note Input
        var noteInput = CreateInputField(go.transform, "Note", "Notes...", 250, 40);
        var noteRect = noteInput.GetComponent<RectTransform>();
        SetAnchor(noteRect, 1, 0.5f, 1, 0.5f);
        noteRect.anchoredPosition = new Vector2(-135, 0);
        card.NoteInput = noteInput;

        // Status Text
        var status = CreateText(go.transform, "Status", "Alive");
        status.fontSize = 14;
        SetAnchor(status.rectTransform, 0.5f, 0.5f, 0.5f, 0.5f);
        card.StatusText = status;

        return go.gameObject;
    }

    // --- UI Helpers ---

    private static Image CreatePanel(Transform parent, string name, Color color)
    {
        var go = new GameObject(name);
        if (parent) go.transform.SetParent(parent, false);
        var img = go.AddComponent<Image>();
        img.color = color;
        // Try to get a sprite or use none (white block)
        return img;
    }

    private static GameObject CreateButton(Transform parent, string name, string text, float w, float h)
    {
        var go = new GameObject(name);
        if (parent) go.transform.SetParent(parent, false);
        
        // Cartoonish button with rounded corners
        var img = go.AddComponent<Image>();
        img.color = new Color32(70, 130, 180, 255); // Steel blue like Among Us buttons
        
        var btn = go.AddComponent<Button>();
        btn.targetGraphic = img;
        
        // Add hover effect via color block
        var colors = btn.colors;
        colors.normalColor = new Color32(70, 130, 180, 255);
        colors.highlightedColor = new Color32(100, 160, 210, 255);
        colors.pressedColor = new Color32(50, 100, 150, 255);
        btn.colors = colors;
        
        var tm = CreateText(go.transform, "Text", text);
        tm.alignment = TextAlignmentOptions.Center;
        tm.fontSize = 20;
        tm.fontStyle = FontStyles.Bold;
        tm.color = Color.white;
        Stretch(tm.rectTransform);

        var rect = go.GetComponent<RectTransform>();
        rect.sizeDelta = new Vector2(w, h);
        
        // Add rounded corners to button
        var cornerRadius = h / 2; // Fully rounded ends
        AddRoundedCorners(go.transform, new Color32(70, 130, 180, 255), cornerRadius);
        
        return go;
    }

    private static TextMeshProUGUI CreateText(Transform parent, string name, string content)
    {
        var go = new GameObject(name);
        if (parent) go.transform.SetParent(parent, false);
        var tm = go.AddComponent<TextMeshProUGUI>();
        tm.text = content;
        tm.fontSize = 18;
        tm.color = Color.white;
        tm.alignment = TextAlignmentOptions.Left;
        tm.fontStyle = FontStyles.Bold;
        if (_defaultFont) tm.font = _defaultFont;
        // Add subtle drop shadow-like effect
        var shadow = go.AddComponent<Shadow>();
        shadow.effectColor = new Color(0, 0, 0, 0.5f);
        shadow.effectDistance = new Vector2(1, -1);
        return tm;
    }

    private static TMP_InputField CreateInputField(Transform parent, string name, string placeholder, float w, float h)
    {
        var go = new GameObject(name);
        if (parent) go.transform.SetParent(parent, false);
        
        // Background image
        var img = go.AddComponent<Image>();
        img.color = new Color(1f, 1f, 1f, 0f);
        
        // Input field component
        var input = go.AddComponent<TMP_InputField>();
        var rect = go.GetComponent<RectTransform>();
        rect.sizeDelta = new Vector2(w, h);

        // TextArea - This is required for TMP_InputField to work properly
        var textArea = new GameObject("TextArea");
        textArea.transform.SetParent(go.transform, false);
        var textAreaRect = textArea.AddComponent<RectTransform>();
        Stretch(textAreaRect);
        textAreaRect.offsetMin = new Vector2(5, 5);
        textAreaRect.offsetMax = new Vector2(-5, -5);
        
        // Create Text child for TextArea
        var txt = CreateText(textArea.transform, "Text", "");
        txt.raycastTarget = false;
        Stretch(txt.rectTransform);
        txt.color = Color.black;
        
        // Set up input field text viewport FIRST (before textComponent)
        input.textViewport = textAreaRect;
        
        // Set text component AFTER viewport
        input.textComponent = txt;
        
        // Placeholder
        var ph = CreateText(textArea.transform, "Placeholder", placeholder);
        ph.color = new Color(0.5f, 0.5f, 0.5f, 0.5f);
        ph.fontStyle = FontStyles.Italic;
        ph.alignment = TextAlignmentOptions.TopLeft;
        Stretch(ph.rectTransform);
        input.placeholder = ph;

        // Important settings for input to work
        input.interactable = true;
        input.readOnly = false;
        input.enabled = true;
        input.pointSize = 18;
        input.lineType = TMP_InputField.LineType.MultiLineNewline;
        input.textComponent.enableVertexGradient = false;
        input.caretColor = Color.white;
        input.selectionColor = new Color(0.5f, 0.7f, 1f, 0.5f);
        
        // Add EventTrigger for click to activate
        var et = go.AddComponent<EventTrigger>();
        et.triggers.Clear();
        
        var clickEntry = new EventTrigger.Entry { eventID = EventTriggerType.PointerClick };
        clickEntry.callback.AddListener((UnityEngine.Events.UnityAction<BaseEventData>)((_) => {
            input.ActivateInputField();
            input.Select();
        }));
        et.triggers.Add(clickEntry);
        
        var selectEntry = new EventTrigger.Entry { eventID = EventTriggerType.Select };
        selectEntry.callback.AddListener((UnityEngine.Events.UnityAction<BaseEventData>)((_) => {
            input.ActivateInputField();
        }));
        et.triggers.Add(selectEntry);

        return input;
    }

    private static ScrollRect CreateScrollView(Transform parent, string name)
    {
        var go = new GameObject(name);
        if (parent) go.transform.SetParent(parent, false);
        var scroll = go.AddComponent<ScrollRect>();
        scroll.horizontal = false;
        scroll.vertical = true;
        scroll.scrollSensitivity = 20;

        var viewport = CreatePanel(go.transform, "Viewport", new Color(0,0,0,0.5f));
        var mask = viewport.gameObject.AddComponent<Mask>();
        mask.showMaskGraphic = false;
        Stretch(viewport.rectTransform);
        scroll.viewport = viewport.rectTransform;

        var content = CreatePanel(viewport.transform, "Content", Color.clear);
        var vlg = content.gameObject.AddComponent<VerticalLayoutGroup>();
        vlg.childControlHeight = false;
        vlg.childForceExpandHeight = false;
        vlg.spacing = 5;
        vlg.padding = new RectOffset { left = 5, right = 5, top = 5, bottom = 5 };
        var csf = content.gameObject.AddComponent<ContentSizeFitter>();
        csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;
        
        SetAnchor(content.rectTransform, 0, 1, 1, 1);
        content.rectTransform.pivot = new Vector2(0.5f, 1);
        content.rectTransform.sizeDelta = new Vector2(0, 0); // Height controlled by CSF

        scroll.content = content.rectTransform;
        return scroll;
    }

    // --- Rect Helpers ---

    private static void Stretch(Graphic g) => Stretch(g.rectTransform);
    private static void Stretch(RectTransform rt)
    {
        rt.anchorMin = Vector2.zero;
        rt.anchorMax = Vector2.one;
        rt.offsetMin = Vector2.zero;
        rt.offsetMax = Vector2.zero;
    }

    private static void SetAnchor(RectTransform rt, float minX, float minY, float maxX, float maxY)
    {
        rt.anchorMin = new Vector2(minX, minY);
        rt.anchorMax = new Vector2(maxX, maxY);
    }

    private static void AddRoundedCorners(Transform target, Color maskColor, float radius)
    {
        // Creates 4 quarter-circle masks to fake rounded corners
        var tl = CreateCorner(target, "CornerTL", maskColor, Image.Origin90.TopLeft, radius);
        var tr = CreateCorner(target, "CornerTR", maskColor, Image.Origin90.TopRight, radius);
        var bl = CreateCorner(target, "CornerBL", maskColor, Image.Origin90.BottomLeft, radius);
        var br = CreateCorner(target, "CornerBR", maskColor, Image.Origin90.BottomRight, radius);
        tl.raycastTarget = false; tr.raycastTarget = false; bl.raycastTarget = false; br.raycastTarget = false;
    }

    private static Image CreateCorner(Transform parent, string name, Color color, Image.Origin90 origin, float size)
    {
        var go = new GameObject(name);
        go.transform.SetParent(parent, false);
        var img = go.AddComponent<Image>();
        img.color = color;
        img.type = Image.Type.Filled;
        img.fillMethod = Image.FillMethod.Radial90;
        img.fillOrigin = (int)origin;
        var rt = img.rectTransform;
        rt.sizeDelta = new Vector2(size, size);
        switch (origin)
        {
            case Image.Origin90.TopLeft:
                SetAnchor(rt, 0, 1, 0, 1);
                rt.anchoredPosition = new Vector2(size * 0.5f, -size * 0.5f);
                break;
            case Image.Origin90.TopRight:
                SetAnchor(rt, 1, 1, 1, 1);
                rt.anchoredPosition = new Vector2(-size * 0.5f, -size * 0.5f);
                break;
            case Image.Origin90.BottomLeft:
                SetAnchor(rt, 0, 0, 0, 0);
                rt.anchoredPosition = new Vector2(size * 0.5f, size * 0.5f);
                break;
            case Image.Origin90.BottomRight:
                SetAnchor(rt, 1, 0, 1, 0);
                rt.anchoredPosition = new Vector2(-size * 0.5f, size * 0.5f);
                break;
        }
        return img;
    }
}
