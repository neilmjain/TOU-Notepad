using System.Collections.Generic;
using UnityEngine;
using TMPro;
using MiraAPI;
using System.Linq;
using TOU_Notepad.UI.Components;

namespace TOU_Notepad.UI.Tabs;

public class RolesTab : MonoBehaviour
{
    public GameObject RoleCardPrefab;
    public Transform ContentContainer;
    public TMP_InputField SearchInput;
    public TMP_Dropdown SortDropdown;
    
    private List<RoleCard> _spawnedCards = new();
    private List<RoleBehaviour> _allRoles = new();

    public void OnOpen()
    {
        if (_allRoles.Count == 0 || _spawnedCards.Count == 0)
        {
            RefreshRoles();
        }
        UpdateFilterAndSort();
    }

    public void RefreshRoles()
    {
        // Clear existing
        foreach (var card in _spawnedCards)
        {
            if (card) Destroy(card.gameObject);
        }
        _spawnedCards.Clear();
        _allRoles.Clear();

        // Fetch roles from MiraAPI
        if (RoleManager.Instance != null)
        {
            foreach (var role in RoleManager.Instance.AllRoles)
            {
                _allRoles.Add(role);
            }
        }

        // Spawn cards
        foreach (var role in _allRoles)
        {
            var go = Instantiate(RoleCardPrefab, ContentContainer);
            var card = go.GetComponent<RoleCard>();
            if (card)
            {
                card.Setup(role);
                _spawnedCards.Add(card);
            }
        }
    }

    public void UpdateFilterAndSort()
    {
        string query = SearchInput ? SearchInput.text.ToLowerInvariant() : "";
        
        var filtered = _spawnedCards.Where(card => 
            string.IsNullOrEmpty(query) || 
            card.RoleNameText.text.ToLowerInvariant().Contains(query)
        ).ToList();

        // Sort
        if (SortDropdown)
        {
            int sortOption = SortDropdown.value;
            // 0: Name, 1: Alignment (Team)
            if (sortOption == 0)
            {
                filtered.Sort((a, b) => string.Compare(a.RoleNameText.text, b.RoleNameText.text));
            }
            else if (sortOption == 1)
            {
                 // Simple sort by text of alignment for now
                filtered.Sort((a, b) => string.Compare(a.AlignmentText.text, b.AlignmentText.text));
            }
        }

        // Apply order and visibility
        int index = 0;
        foreach (var card in _spawnedCards)
        {
            if (filtered.Contains(card))
            {
                card.gameObject.SetActive(true);
                card.transform.SetSiblingIndex(index++);
            }
            else
            {
                card.gameObject.SetActive(false);
            }
        }
    }

    private void Start()
    {
        if (SearchInput)
        {
            SearchInput.onValueChanged.AddListener((UnityEngine.Events.UnityAction<string>)((s) => UpdateFilterAndSort()));
        }
        if (SortDropdown)
        {
            SortDropdown.onValueChanged.AddListener((UnityEngine.Events.UnityAction<int>)((i) => UpdateFilterAndSort()));
        }
    }
}
