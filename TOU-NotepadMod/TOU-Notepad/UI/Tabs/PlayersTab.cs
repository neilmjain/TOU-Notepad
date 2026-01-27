using System.Collections.Generic;
using UnityEngine;
using TOU_Notepad.UI.Components;

namespace TOU_Notepad.UI.Tabs;

public class PlayersTab : MonoBehaviour
{
    public GameObject PlayerCardPrefab;
    public Transform ContentContainer;
    public Transform LeftGridContainer;
    public Transform RightGridContainer;
    
    private List<PlayerCard> _spawnedCards = new();

    public void OnOpen()
    {
        RefreshPlayers();
    }

    public void SaveNotes()
    {
        foreach (var card in _spawnedCards)
        {
            if (card)
            {
                card.SaveNote();
            }
        }
    }

    private void RefreshPlayers()
    {
        foreach (var card in _spawnedCards)
        {
            if(card) Destroy(card.gameObject);
        }
        _spawnedCards.Clear();

        if (PlayerControl.AllPlayerControls != null)
        {
            int index = 0;
            foreach (var player in PlayerControl.AllPlayerControls)
            {
                Transform parent = (index < 8) ? (LeftGridContainer ? LeftGridContainer : ContentContainer)
                                               : (RightGridContainer ? RightGridContainer : ContentContainer);
                var go = Instantiate(PlayerCardPrefab, parent);
                var card = go.GetComponent<PlayerCard>();
                if (card)
                {
                    card.Setup(player);
                    _spawnedCards.Add(card);
                }
                index++;
            }
        }
    }
}
