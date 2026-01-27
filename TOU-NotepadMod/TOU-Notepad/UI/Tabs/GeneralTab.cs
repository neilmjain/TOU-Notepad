using UnityEngine;
using TMPro;
using UnityEngine.UI;
using TOU_Notepad.Data;

namespace TOU_Notepad.UI.Tabs;

public class GeneralTab : MonoBehaviour
{
    public TMP_InputField LeftNoteInput;
    public TMP_InputField RightNoteInput;

    public void OnOpen()
    {
        if (LeftNoteInput)
        {
            LeftNoteInput.text = NotepadFileStorage.Instance.GetGeneralNote("left");
            LeftNoteInput.onValueChanged.RemoveAllListeners();
            LeftNoteInput.onValueChanged.AddListener((UnityEngine.Events.UnityAction<string>)((string s) => OnLeftNoteChanged(s)));
            LeftNoteInput.onEndEdit.RemoveAllListeners();
            LeftNoteInput.onEndEdit.AddListener((UnityEngine.Events.UnityAction<string>)((string s) => OnLeftNoteChanged(s)));
            LeftNoteInput.ActivateInputField();
            LeftNoteInput.Select();
        }
        if (RightNoteInput)
        {
            RightNoteInput.text = NotepadFileStorage.Instance.GetGeneralNote("right");
            RightNoteInput.onValueChanged.RemoveAllListeners();
            RightNoteInput.onValueChanged.AddListener((UnityEngine.Events.UnityAction<string>)((string s) => OnRightNoteChanged(s)));
            RightNoteInput.onEndEdit.RemoveAllListeners();
            RightNoteInput.onEndEdit.AddListener((UnityEngine.Events.UnityAction<string>)((string s) => OnRightNoteChanged(s)));
        }
    }

    private void OnLeftNoteChanged(string text)
    {
        NotepadFileStorage.Instance.SetGeneralNote("left", text);
    }

    private void OnRightNoteChanged(string text)
    {
        NotepadFileStorage.Instance.SetGeneralNote("right", text);
    }
}
