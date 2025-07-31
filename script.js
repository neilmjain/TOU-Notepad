// Function to convert RGB float values (0-1) to a hex color string (#RRGGBB).
function rgbFloatToHex(r, g, b) {
    const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Global variable to store the promise resolver for the message box
let resolveMessageBoxPromise;

// --- Custom Message Box Functionality ---
const messageBoxOverlay = document.getElementById('messageBoxOverlay');
const messageBoxText = document.getElementById('messageBoxText');
const messageBoxConfirm = document.getElementById('messageBoxConfirm');
const messageBoxCancel = document.getElementById('messageBoxCancel');

// Check if elements exist before adding listeners to prevent errors
if (messageBoxConfirm && messageBoxOverlay && messageBoxText && messageBoxCancel) {
    function showMessageBox(message, isConfirm = false) {
        messageBoxText.textContent = message;
        messageBoxCancel.classList.toggle('hidden', !isConfirm);
        messageBoxConfirm.textContent = isConfirm ? 'Confirm' : 'OK';
        messageBoxOverlay.classList.add('active');

        return new Promise(resolve => {
            resolveMessageBoxPromise = resolve;
        });
    }

    messageBoxConfirm.addEventListener('click', () => {
        messageBoxOverlay.classList.remove('active');
        if (resolveMessageBoxPromise) {
            resolveMessageBoxPromise(true);
        }
    });

    messageBoxCancel.addEventListener('click', () => {
        messageBoxOverlay.classList.remove('active');
        if (resolveMessageBoxPromise) {
            resolveMessageBoxPromise(false);
        }
    });
} else {
    // Fallback for missing message box elements (will log to console instead of showing UI)
    console.warn("Message box elements not found. Message box functionality will be limited.");
    function showMessageBox(message, isConfirm = false) {
        console.log(`MessageBox: ${message} (isConfirm: ${isConfirm})`);
        return Promise.resolve(true); // Always confirm if UI is missing
    }
}
// --- End Custom Message Box Functionality ---


// --- Role/Team/Modifier Colors (from your provided C# snippet and data) ---
const teamColors = {
    "Crewmate": { dotColor: '#00ffff', boxBg: 'rgba(0, 255, 255, 0.2)' }, /* Cyan */
    "Impostor": { dotColor: '#ff0000', boxBg: 'rgba(255, 0, 0, 0.2)'}, /* Red */
    "Neutral": { dotColor: 'grey', boxBg: 'rgba(83, 83, 82, 0.2)'}, /* Yellow */
    "Alliance": { dotColor: '#669966', boxBg: 'rgba(102, 153, 102, 0.2)' }, /* Alliance Green */
    // Add modifiers if they need distinct colors:
    "Crewmate Modifier": { dotColor: '#00ffff', boxBg: 'rgba(0, 255, 255, 0.1)', boxShadow: '0 0 5px #00ffff' },
    "Global Modifier": { dotColor: '#9333ea', boxBg: 'rgba(147, 51, 234, 0.1)', boxShadow: '0 0 5px #9333ea' }, /* A purple-ish tone for Global Modifiers */
    "Impostor Modifier": { dotColor: '#ff0000', boxBg: 'rgba(255, 0, 0, 0.1)', boxShadow: '0 0 5px #ff0000' },
    "Crewmate Alliance modifier": { dotColor: '#669966', boxBg: 'rgba(102, 153, 102, 0.1)', boxShadow: '0 0 5px #669966' }
};

const roleColors = {
    "Crewmate": rgbFloatToHex(0.00, 0.75, 1.00),
    "Mayor": rgbFloatToHex(0.44, 0.31, 0.66),
    "Sheriff": rgbFloatToHex(1.00, 1.00, 0.00),
    "Engineer": rgbFloatToHex(1.00, 0.65, 0.04),
    "Swapper": rgbFloatToHex(0.40, 0.90, 0.40),
    "Investigator": rgbFloatToHex(0.00, 0.70, 0.70),
    "Medic": rgbFloatToHex(0.00, 0.40, 0.00),
    "Seer": rgbFloatToHex(1.00, 0.80, 0.50),
    "Spy": rgbFloatToHex(0.80, 0.64, 0.80),
    "Snitch": rgbFloatToHex(0.83, 0.69, 0.22),
    "Altruist": rgbFloatToHex(0.40, 0.00, 0.00),
    "Vigilante": rgbFloatToHex(1.00, 1.00, 0.60),
    "Veteran": rgbFloatToHex(0.60, 0.50, 0.25),
    "Haunter": rgbFloatToHex(0.83, 0.83, 0.83),
    "Transporter": rgbFloatToHex(0.00, 0.93, 1.00),
    "Medium": rgbFloatToHex(0.65, 0.50, 1.00),
    "Mystic": rgbFloatToHex(0.30, 0.60, 0.90),
    "Trapper": rgbFloatToHex(0.65, 0.82, 0.70),
    "Detective": rgbFloatToHex(0.30, 0.30, 1.00),
    "Imitator": rgbFloatToHex(0.70, 0.85, 0.30),
    "Prosecutor": rgbFloatToHex(0.70, 0.50, 0.00),
    "Oracle": rgbFloatToHex(0.75, 0.00, 0.75),
    "Aurial": rgbFloatToHex(0.70, 0.30, 0.60),
    "Politician": rgbFloatToHex(0.40, 0.00, 0.60),
    "Warden": rgbFloatToHex(0.60, 0.00, 1.00),
    "Jailor": rgbFloatToHex(0.65, 0.65, 0.65),
    "Hunter": rgbFloatToHex(0.16, 0.67, 0.53),
    "Tracker": rgbFloatToHex(0.00, 0.60, 0.00),
    "Lookout": rgbFloatToHex(0.20, 1.00, 0.40),
    "Deputy": rgbFloatToHex(1.00, 0.80, 0.00),
    "Plumber": rgbFloatToHex(0.80, 0.40, 0.00),
    "Cleric": rgbFloatToHex(0.00, 1.00, 0.70),

    "Neutral": rgbFloatToHex(0.50, 0.50, 0.50),
    "Jester": rgbFloatToHex(1.00, 0.75, 0.80),
    "Executioner": rgbFloatToHex(0.39, 0.23, 0.12),
    "Glitch": rgbFloatToHex(0.00, 1.00, 0.00),
    "Arsonist": rgbFloatToHex(1.00, 0.30, 0.00),
    "Amnesiac": rgbFloatToHex(0.50, 0.70, 1.00),
    "Juggernaut": rgbFloatToHex(0.55, 0.00, 0.30),
    "Survivor": rgbFloatToHex(1.00, 0.90, 0.30),
    "Protector": rgbFloatToHex(0.70, 1.00, 1.00),
    "Plaguebearer": rgbFloatToHex(0.90, 1.00, 0.70),
    "Pestilence": rgbFloatToHex(0.30, 0.30, 0.30),
    "Werewolf": rgbFloatToHex(0.66, 0.40, 0.16),
    "Doomsayer": rgbFloatToHex(0.00, 1.00, 0.50),
    "Vampire": rgbFloatToHex(0.64, 0.16, 0.16),
    "Soul Collector": rgbFloatToHex(0.60, 1.00, 0.80),
    "Guardian Angel": rgbFloatToHex(0.70, 1.00, 1.00),
    "Phantom": rgbFloatToHex(0.40, 0.16, 0.38),
    "Mercenary": rgbFloatToHex(0.55, 0.40, 0.60),
    "Inquisitor": rgbFloatToHex(0.85, 0.26, 0.57),

    "Impostor": rgbFloatToHex(1.00, 0.00, 0.00),
    "ImpSoft": rgbFloatToHex(1.00, 0.00, 0.00),
    "Eclipsal": rgbFloatToHex(1.00, 0.00, 0.00),
    "Escapist": rgbFloatToHex(1.00, 0.00, 0.00),
    "Grenadier": rgbFloatToHex(1.00, 0.00, 0.00),
    "Morphling": rgbFloatToHex(1.00, 0.00, 0.00),
    "Swooper": rgbFloatToHex(1.00, 0.00, 0.00),
    "Venerer": rgbFloatToHex(1.00, 0.00, 0.00),
    "Bomber": rgbFloatToHex(1.00, 0.00, 0.00),
    "Scavenger": rgbFloatToHex(1.00, 0.00, 0.00),
    "Traitor": rgbFloatToHex(1.00, 0.00, 0.00),
    "Warlock": rgbFloatToHex(1.00, 0.00, 0.00),
    "Blackmailer": rgbFloatToHex(1.00, 0.00, 0.00),
    "Hypnotist": rgbFloatToHex(1.00, 0.00, 0.00),
    "Janitor": rgbFloatToHex(1.00, 0.00, 0.00),
    "Miner": rgbFloatToHex(1.00, 0.00, 0.00),
    "Undertaker": rgbFloatToHex(1.00, 0.00, 0.00)
};

const modifierColors = {
    "Bait": rgbFloatToHex(0.20, 0.70, 0.70),
    "Aftermath": rgbFloatToHex(0.65, 1.00, 0.65),
    "Diseased": rgbFloatToHex(0.50, 0.50, 0.50),
    "Torch": rgbFloatToHex(1.00, 1.00, 0.60),
    "Button Barry": rgbFloatToHex(0.70, 0.20, 0.80),
    "Flash": rgbFloatToHex(1.00, 0.50, 0.50),
    "Giant": rgbFloatToHex(1.00, 0.70, 0.30),
    "Lover": rgbFloatToHex(1.00, 0.40, 0.80),
    "Sleuth": rgbFloatToHex(0.50, 0.20, 0.20),
    "Tiebreaker": rgbFloatToHex(0.60, 0.90, 0.60),
    "Radar": rgbFloatToHex(1.00, 0.00, 0.50),
    "Multitasker": rgbFloatToHex(1.00, 0.50, 0.30),
    "Frosty": rgbFloatToHex(0.60, 1.00, 1.00),
    "Sixth Sense": rgbFloatToHex(0.85, 1.00, 0.55),
    "Shy": rgbFloatToHex(1.00, 0.70, 0.80),
    "Mini": rgbFloatToHex(0.80, 1.00, 0.90),
    "Camouflaged": rgbFloatToHex(0.50, 0.50, 0.50),
    "Satellite": rgbFloatToHex(0.00, 0.60, 0.80),
    "Egotist": rgbFloatToHex(0.40, 0.60, 0.40),
    "Lovers": rgbFloatToHex(1.00, 0.40, 0.80),
    "Taskmaster": rgbFloatToHex(0.58, 0.84, 0.93),
    "Celebrity": rgbFloatToHex(1.00, 0.60, 0.60),
    "Immovable": rgbFloatToHex(0.90, 0.90, 0.80),
    "Rotting": rgbFloatToHex(0.67, 0.50, 0.41),
    "Noisemaker": rgbFloatToHex(0.91, 0.41, 0.62),
    "Scientist": rgbFloatToHex(0.00, 0.78, 0.41),
    "Operative": rgbFloatToHex(0.60, 0.03, 0.07),
    "Scout": rgbFloatToHex(0.27, 0.38, 0.34),

    "Disperser": rgbFloatToHex(1.00, 0.00, 0.00),
    "Double Shot": rgbFloatToHex(1.00, 0.00, 0.00),
    "Saboteur": rgbFloatToHex(1.00, 0.00, 0.00),
    "Underdog": rgbFloatToHex(1.00, 0.00, 0.00),
    "Telepath": rgbFloatToHex(1.00, 0.00, 0.00),
    "Spy Modifier": rgbFloatToHex(0.80, 0.64, 0.80)
};


// --- ALL ENTITIES DATA (Including SkillIcon Arrays and Ability Adjustments) ---
// THIS DATA IS NOW INCLUDED DIRECTLY IN SCRIPT.JS FOR SIMPLICITY.
// If you prefer to keep it in a separate file, remove this block
// and ensure `allEntitiesData` is loaded globally before this script.
const allEntitiesData = [
    // Crewmate Roles
    {
        category: "Role", name: "Aurial", team: "Crewmate",
        description: "The Aurial is a Crewmate that can sense when players use an ability nearby. If any player near the Aurial uses a button ability, the Aurial will get an arrow pointing towards where that ability was used.",
        abilities: [{ name: "Sense Interactions", icon: 'TownOfUs.Resources.RoleIcons.Aurial.png', description: "Senses when players use an ability nearby." }],
        icon: 'Aurial',
        types: ["Detection", "Other"],
        options: [
            { name: "Aurial", description: "The percentage probability of the Aurial appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Radiate Colour Range", description: "The range of the Aurial's aura where they see the colour of the ability user", type: "Multiplier", default: "0.5x", range: "N/A" },
            { name: "Radiate Max Range", description: "The max range of the Aurial's aura where they see ability uses", type: "Multiplier", default: "1.5x", range: "N/A" },
            { name: "Sense Duration", description: "The duration of the arrow to show an ability use", type: "Time", default: "10s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Detective", team: "Crewmate",
        description: "The Detective has a 2 step ability.\nThe first stage involves inspecting a crime scene. Once a crime scene is inspected they can then examine other players on cooldown to see if that player was at the scene of the crime.\nCrime scenes spawn at each dead body. They also get a detective report telling them the type of killer if they examine someone’s body.",
        abilities: [
            { name: "Inspect", icon: 'TownOfUs.Resources.CrewButtons.InspectButton.png', description: "Inspects a crime scene to gather clues." },
            { name: "Examine", icon: 'TownOfUs.Resources.CrewButtons.ExamineButton.png', description: "Examines players to check their presence at a crime scene." }
        ],
        icon: 'Detective',
        types: ["Detection"],
        options: [
            { name: "Detective", description: "The percentage probability of the Detective appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Examine Cooldown", description: "The cooldown of the Detective's Examine button", type: "Time", default: "25s", range: "N/A" },
            { name: "Show Detective Reports", description: "Whether the Detective should get information when reporting a body", type: "Toggle", default: "True", range: "N/A" },
            { name: "Time Where Detective Reports Will Have Role", description: "If a body has been dead for shorter than this amount, the Detective's report will contain the killer's role", type: "Time", default: "15s", range: "N/A" },
            { name: "Time Where Detective Reports Will Have Faction", description: "If a body has been dead for shorter than this amount, the Detective's report will contain the killer's faction", type: "Time", default: "30s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Engineer", team: "Crewmate",
        description: "The Engineer is a Crewmate that can fix sabotages from anywhere on the map.\nThey can use vents to get across the map easily.",
        abilities: [
            { name: "Vent", icon: 'TownOfUs.Resources.CrewButtons.EngiVentButton.png', description: "Uses vents for quick movement." },
            { name: "Fix Sabotage", icon: 'TownOfUs.Resources.CrewButtons.FixButton.png', description: "Fixes sabotages from any location." }
        ],
        icon: 'Engineer',
        types: ["Utility", "Movement"],
        options: [
            { name: "Engineer", description: "The percentage probability of the Engineer appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Maximum Fixes", description: "The number of times the Engineer can fix a sabotage", type: "Number", default: "5", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Medic", team: "Crewmate",
        description: "The Medic is a Crewmate that can give any player a shield that will make them immortal until the Medic dies.\nA Shielded player cannot be killed by anyone, unless by suicide.\nIf the Medic reports a dead body, they can get a report containing clues to the Killer's identity.\nA report can contain the color type (Darker/Lighter) of the killer if the body is not too old.",
        abilities: [{ name: "Shield", icon: 'TownOfUs.Resources.CrewButtons.MedicButton.png', description: "Provides a shield to a player, making them immortal." }],
        icon: 'Medic',
        types: ["Protective", "Support"],
        options: [
            { name: "Medic", description: "The percentage probability of the Medic appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Show Shielded Player", description: "Who should be able to see who is Shielded", type: "Self / Medic / Self + Medic", default: "Medic", range: "N/A" },
            { name: "Who gets murder attempt indicator", description: "Who will receive an indicator when someone tries to Kill them", type: "Medic / Shielded / Nobody", default: "Medic", range: "N/A" },
            { name: "Shield breaks on murder attempt", description: "Whether the Shield breaks when someone attempts to Kill them", type: "Toggle", default: "False", range: "N/A" },
            { name: "Show Medic Reports", description: "Whether the Medic should get information \nwhen reporting a body", type: "Toggle", default: "True", range: "N/A" },
            { name: "Time Where Medic Reports Will Have Color Type", description: "If a body has been dead for shorter than this amount, the Medic's report will have the type of color", type: "Time", default: "15s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Sheriff", team: "Crewmate",
        description: "The Sheriff is a Crewmate that has the ability to eliminate the Impostors using their kill button.\nHowever, if they kill a Crewmate or a Neutral player they can't kill, they instead die themselves.",
        abilities: [{ name: "Shoot", icon: 'TownOfUs.Resources.CrewButtons.SheriffShootButton.png', description: "Eliminates Impostors. Miskilling results in self-elimination." }],
        icon: 'Sheriff',
        types: ["Killing"],
        options: [
            { name: "Sheriff", description: "The percentage probability of the Sheriff appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Sheriff Miskill Kills Crewmate", description: "Whether the other player is killed if the Sheriff Misfires", type: "Toggle", default: "False", range: "N/A" },
            { name: "Sheriff Kills Neutral Evil Roles", description: "Whether the Sheriff is able to kill a Neutral Evil Role", type: "Toggle", default: "False", range: "N/A" },
            { name: "Sheriff Kills Neutral Killing Roles", description: "Whether the Sheriff is able to kill a Neutral Killing Role", type: "Toggle", default: "False", range: "N/A" },
            { name: "Sheriff Kill Cooldown", description: "The cooldown on the Sheriff's kill button", type: "Time", default: "25s", range: "N/A" },
            { name: "Sheriff can report who they've killed", description: "Whether the Sheriff is able to report their own kills", type: "Toggle", default: "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Snitch", team: "Crewmate",
        description: "The Snitch is a \nCrewmate that can get arrows pointing towards the Impostors, once all their tasks are finished.\nThe names of the Impostors will also show up as red on their screen.\nHowever, when they only have a single task left, the Impostors get an arrow pointing towards the Snitch.",
        abilities: [{ name: "Reveal Imps", icon: 'TownOfUs.Resources.RoleIcons.Snitch.png', description: "Reveals Impostor locations after tasks are completed." }],
        icon: 'Snitch',
        types: ["Information"],
        options: [
            { name: "Snitch", description: "The percentage probability of the Snitch appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Snitch Sees Neutral Roles", description: "Whether the Snitch also Reveals Neutral Roles", type: "Toggle", default: "False", range: "N/A" },
            { name: "Tasks Remaining When Revealed", description: "The number of tasks remaining when the Snitch is revealed to Impostors", type: "Number", default: "1", range: "N/A" },
            { name: "Snitch Sees Impostors in Meetings", description: "Whether the Snitch sees the Impostor's names red in Meetings", type: "Toggle", default: "True", range: "N/A" },
            { name: "Snitch Sees Traitor", description: "Whether the Snitch sees the \nTraitor", type: "Toggle", default: "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Swapper", team: "Crewmate",
        description: "The Swapper is a Crewmate that can swap the votes on 2 players during a meeting.\nAll the votes for the first player will instead be counted towards the second player and vice versa.",
        abilities: [{ name: "Swap Players", icon: 'TownOfUs.Resources.SwapActive.png', description: "Swaps votes between two players during a meeting." }],
        icon: 'Swapper',
        types: ["Support", "Utility"],
        options: [
            { name: "Swapper", description: "The percentage probability of the Swapper appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Swapper Can Button", description: "Whether the Swapper Can Press the Button", type: "Toggle", "default": "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Transporter", team: "Crewmate",
        description: "The Transporter is a Crewmate that can change the locations of two random players at will.\nPlayers who have been transported are alerted with a blue flash on their screen.",
        abilities: [{ name: "Transport", icon: 'TownOfUs.Resources.CrewButtons.TransportButton.png', description: "Changes the locations of two random players." }],
        icon: 'Transporter',
        types: ["Utility"],
        options: [
            { name: "Transporter", description: "The percentage probability of the Transporter appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Transport Cooldown", description: "The cooldown of the Transporter's transport ability", type: "Time", "default": "25s", range: "N/A" },
            { name: "Max Uses", description: "The amount of times the Transport ability can be used", type: "Number", "default": "5", range: "N/A" },
            { name: "Transporter can use Vitals", description: "Whether the Transporter has the ability to use Vitals", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
     {
        category: "Role", name: "Haunter", team: "Crewmate",
        description: "Once a random Crewmate dies they become the Haunter. The Haunter has the ability to run around as a ghost and to do tasks. Once all tasks are finished they reveal the Impostors to all alive non-Impostors. However, if the Haunter is clicked they lose their ability to reveal Impostors and are once again a normal ghost. The Impostors also get a warning shortly before and as the Haunter finishes their tasks.",
        abilities: [{ name: "Reveal Imps", icon: 'TownOfUs.Resources.RoleIcons.Haunter.png', description: "Reveals Impostors to all non-Impostors after tasks are finished." }],
        icon: 'Haunter',
        types: ["Detection", "Utility", "Other"],
        options: [
            { name: "Haunter", description: "The percentage probability of the Haunter appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "When Haunter Can Be Clicked", description: "The amount of tasks remaining when the Haunter Can Be Clicked", type: "Number", default: "5", range: "N/A" },
            { name: "Haunter Alert", description: "The amount of tasks remaining when the Impostors are alreted that the Haunter is nearly finished", type: "Number", default: "1", range: "N/A" },
            { name: "Haunter Reveals Neutral Roles", description: "Whether the Haunter also Reveals Neutral Roles", type: "Toggle", default: "False", range: "N/A" },
            { name: "Who can Click Haunter", description: "Whether even other Crewmates can click the Haunter", type: "All / Non-Crew / Imps Only", default: "All", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Investigator", team: "Crewmate",
        description: "The Investigator can see player's footprints throughout the game. Swooper footprints are hidden.",
        abilities: [{ name: "View Footprints", icon: 'TownOfUs.Resources.Footprint.png', description: "Can see players' footprints throughout the game." }],
        icon: 'Investigator',
        types: ["Detection"],
        options: [
            { name: "Investigator", description: "The percentage probability of the Investigator appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Footprint Size", description: "Changes how big footprints are.", type: "Multiplier", default: "4x", range: "1x - 10x" },
            { name: "Footprint Interval", description: "Changes how often footprints are created.", type: "Seconds", default: "1s", range: "0.5s - 6s" },
            { name: "Footprint Duration", description: "Changes how long footprints are visible for.", type: "Seconds", default: "10s", range: "1s - 15s" },
            { name: "Anonymous Footprint", description: "Determines if footprints are color coded based off the player.", type: "Toggle", default: "False", range: "N/A" },
            { name: "Show Vent Footprints", description: "Determines if footprints are visible from a player that's in a vent.", type: "Toggle", default: "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Lookout", team: "Crewmate",
        description: "The Lookout is a Crewmate that can watch other players during rounds. During meetings they will see all roles who interact with each watched player.",
        abilities: [{ name: "Watch Player", icon: 'TownOfUs.Resources.CrewButtons.WatchButton.png', description: "Watches other players during rounds to see who interacts with them." }],
        icon: 'Lookout',
        types: ["Detection"],
        options: [
            { name: "Lookout", description: "The percentage probability of the Lookout appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Watch Cooldown", description: "The cooldown on the Lookout's Watch button", type: "Time", default: "10s", range: "N/A" },
            { name: "Lookout Watches Reset After Each Round", description: "Whether Lookout Watches are removed after each meeting", type: "Toggle", default: "True", range: "N/A" },
            { name: "Maximum Number Of Players That Can Be Watched", description: "The number of people they can watch", type: "Number", default: "5", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Mystic", team: "Crewmate",
        description: "The Mystic is a Crewmate that gets an alert revealing when someone has died. On top of this, the Mystic briefly gets an arrow pointing in the direction of the body.",
        abilities: [{ name: "Know Kills", icon: 'TownOfUs.Resources.RoleIcons.Mystic.png', description: "Receives alerts when someone dies and sees an arrow to the body." }],
        icon: 'Mystic',
        types: ["Detection", "Other"],
        options: [
            { name: "Mystic", description: "The percentage probability of the Mystic appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Arrow Duration", description: "The duration of the arrows pointing to the bodies", type: "Time", default: "0.1s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Seer", team: "Crewmate",
        description: "The Seer is a Crewmate that can reveal the alliance of other players. Based on settings, the Seer can find out whether a player is a Good or an Evil role. A player's name will change color depending on faction and role.",
        abilities: [{ name: "Reveal Alliance", icon: 'TownOfUs.Resources.CrewButtons.SeerButton.png', description: "Reveals the alliance (Good/Evil) of other players." }],
        icon: 'Seer',
        types: ["Detection"],
        options: [
            { name: "Seer", description: "The percentage probability of the Seer appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Seer Cooldown", description: "The Cooldown of the Seer's Reveal button", type: "Time", default: "25s", range: "N/A" },
            { name: "Crewmate Killing Roles Are Red", description: "Crewmate Killing roles show up as Red", type: "Toggle", default: "False", range: "N/A" },
            { name: "Neutral Benign Roles Are Red", description: "Neutral Benign roles show up as Red", type: "Toggle", default: "False", range: "N/A" },
            { name: "Neutral Evil Roles Are Red", description: "Neutral Evil roles show up as Red", type: "Toggle", default: "False", range: "N/A" },
            { name: "Neutral Killing Roles Are Red", description: "Neutral Killing roles show up as Red", type: "Toggle", default: "True", range: "N/A" },
            { name: "Traitor does not swap Colours", description: "The Traitor remains their original colour", type: "Toggle", default: "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Spy", team: "Crewmate",
        description: "The Spy is a Crewmate Investigative role that gains extra information on the admin table. Not only does the Spy see how many people are in a room, but they will also see who is in every room. The Spy also has a toggle for a portable Admin Table with a limited battery charge.",
        abilities: [{ name: "View Admin", icon: 'TownOfUs.Resources.AdminButton.png', description: "Views detailed information on the admin table, including who is in each room." }],
        icon: 'Spy',
        types: ["Detection", "Utility"],
        options: [
            { name: "Spy", description: "The percentage probability of the Spy appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Who Sees Dead Bodies On Admin", description: "Which players see dead bodies on the admin map", type: "Nobody / Spy / Everyone But Spy / Everyone", default: "Nobody", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Tracker", team: "Crewmate",
        description: "The Tracker is a Crewmate that can track other players by tracking them during a round. Once they track someone, an arrow is continuously pointing to them, which updates in set intervals.",
        abilities: [{ name: "Track Player", icon: 'TownOfUs.Resources.CrewButtons.TrackButton.png', description: "Continuously tracks a player with a persistent arrow." }],
        icon: 'Tracker',
        types: ["Detection"],
        options: [
            { name: "Tracker", description: "The percentage probability of the Tracker appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Arrow Update Interval", description: "The time it takes for the arrow to update to the new location of the tracked player", type: "Time", default: "5s", range: "N/A" },
            { name: "Track Cooldown", description: "The cooldown on the Tracker's track button", type: "Time", default: "10s", range: "N/A" },
            { name: "Tracker Arrows Reset Each Round", description: "Whether Tracker Arrows are removed after each meeting", type: "Toggle", default: "True", range: "N/A" },
            { name: "Maximum Number of Tracks", description: "The number of people they can track", type: "Number", default: "5", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Trapper", team: "Crewmate",
        description: "The Trapper is a Crewmate that can place traps around the map. When players enter a trap they trigger the trap. In the following meeting, all players who triggered a trap will have their role displayed to the Trapper. However, this is done so in a random order, not stating who entered the trap, nor what role a specific player is.",
        abilities: [{ name: "Place Trap", icon: 'TownOfUs.Resources.CrewButtons.TrapButton.png', description: "Places traps that reveal roles of players who trigger them." }],
        icon: 'Trapper',
        types: ["Detection", "Utility"],
        options: [
            { name: "Trapper", description: "The percentage probability of the Trapper appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Min Amount of Time in Trap to Register", description: "How long a player must stay in the trap for it to trigger", type: "Time", default: "1s", range: "0s - 10s" },
            { name: "Trap Cooldown", description: "The cooldown on the Trapper's trap button", type: "Time", default: "10s", range: "N/A" },
            { name: "Traps Removed Each Round", description: "Whether the Trapper's traps are removed after each meeting", type: "Toggle", default: "True", range: "N/A" },
            { name: "Maximum Number of Traps", description: "The number of traps they can place", type: "Number", default: "5", range: "N/A" },
            { name: "Trap Size", description: "The size of each trap", type: "Factor", default: "0.25x", range: "N/A" },
            { name: "Minimum Number of Roles required to Trigger Trap", description: "The number of players that must enter the trap for it to be triggered", type: "Number", default: "3", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Deputy", team: "Crewmate",
        description: "The Deputy is a Crewmate that can camp other players. Camped players will alert the Deputy when they are killed. The following meeting the Deputy then can attempt to shoot their killer. If they successfully shoot the killer, they will die, otherwise nothing happens.",
        abilities: [
            { name: "Camp", icon: 'TownOfUs.Resources.CrewButtons.CampButton.png', description: "Camps players to be alerted if they are killed." },
            { name: "Shoot", icon: 'TownOfUs.Resources.Shoot.png', description: "Attempts to shoot a killer in the following meeting." }
        ],
        icon: 'Deputy',
        types: ["Kill", "Detection"],
        options: [
            { name: "Deputy", description: "The percentage probability of the Deputy appearing", type: "Percentage", default: "0%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Hunter", team: "Crewmate",
        description: "The Hunter is a Crewmate Killing role with the ability to track players and execute them if they do anything suspicious. Unlike the Sheriff, the Hunter does not die if they kill an innocent player, however the Hunter may only execute players who have given them probable cause.",
        abilities: [
            { name: "Stalk", icon: 'TownOfUs.Resources.CrewButtons.StalkButton.png', description: "Stalks players to find suspicious activity." },
            { name: "Kill", icon: 'TownOfUs.Resources.CrewButtons.HunterKillButton.png', description: "Executes players who have given probable cause." }
        ],
        icon: 'Hunter',
        types: ["Kill", "Detection"],
        options: [
            { name: "Hunter", description: "The percentage probability of the Hunter appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Hunter Kill Cooldown", description: "The cooldown of the Hunter's Kill button", type: "Number", default: "25s", range: "N/A" },
            { name: "Hunter Stalk Cooldown", description: "The cooldown of the Hunter's Stalk button", type: "Number", default: "10s", range: "N/A" },
            { name: "Hunter Stalk Duration", description: "The duration of the Hunter's Stalk", type: "Number", default: "25s", range: "N/A" },
            { name: "Maximum Stalk Uses", description: "Maximum number of times a Hunter can Stalk", type: "Number", default: "5", range: "N/A" },
            { name: "Hunter Kills Last Voter If Voted Out", description: "Whether the Hunter kills the last person that votes them if they are voted out", type: "Toggle", default: "False", range: "N/A" },
            { name: "Hunter Can Report Who They've Killed", description: "Whether the Hunter is able to report their own kills", type: "Toggle", default: "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Jailor", team: "Crewmate",
        description: "The Jailor is a Crewmate that can jail Crewmates. During meetings all players can see when a Crewmate is jailed. When someone is jailed they cannot use any meeting ability and no meeting ability can be used on them. The Jailor may privately communicate with the jailee. If the Jailor then thinks the jailee is bad, they may then execute them. If the Jailor executes incorrectly, they lose the ability to jail.",
        abilities: [
            { name: "Jail", icon: 'TownOfUs.Resources.CrewButtons.JailButton.png', description: "Jails Crewmates, preventing them from using meeting abilities." },
            { name: "Execute", icon: 'TownOfUs.Resources.ExecuteClean.png', description: "Executes jailed players if deemed suspicious." }
        ],
        icon: 'Jailor',
        types: ["Kill", "Utility"],
        options: [
            { name: "Jailor", description: "The percentage probability of the Jailor appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Jail Cooldown", description: "The cooldown on the Jailor's jail button", type: "Time", default: "10s", range: "N/A" },
            { name: "Maximum Executes", description: "Maximum number of times a Jailor can Execute", type: "Number", default: "3", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Veteran", team: "Crewmate",
        description: "The Veteran is a Crewmate that can go on alert. When the Veteran is on alert, anyone, whether Crew, Neutral or Impostor, if they interact with the Veteran, they die.",
        abilities: [{ name: "Toggle Alert", icon: 'TownOfUs.Resources.CrewButtons.AlertButton.png', description: "Goes on alert, killing anyone who interacts with them." }],
        icon: 'Veteran',
        types: ["Kill", "Support"],
        options: [
            { name: "Veteran", description: "The percentage probability of the Veteran appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Can Be Killed On Alert", description: "Whether the Veteran dies when someone tries to kill them when they're on alert", type: "Toggle", default: "False", range: "N/A" },
            { name: "Alert Cooldown", description: "The cooldown on the Veteran's alert button.", type: "Time", default: "5s", range: "N/A" },
            { name: "Alert Duration", description: "The duration of the alert", type: "Time", default: "25s", range: "N/A" },
            { name: "Maximum Number of Alerts", description: "The number of times the Veteran can alert throughout the game", type: "Number", default: "3", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Vigilante", team: "Crewmate",
        description: "The Vigilante is a Crewmate that can kill during meetings. During meetings, the Vigilante can choose to kill someone by guessing their role, however, if they guess incorrectly, they die instead.",
        abilities: [{ name: "Guess Role", icon: 'TownOfUs.Resources.Guess.png', description: "Kills a player during meetings by guessing their role. Miskill results in self-elimination." }],
        icon: 'Vigilante',
        types: ["Kill"],
        options: [
            { name: "Vigilante", description: "The percentage probability of the Vigilante appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Vigilante Kill", description: "The number of kill the Vigilante can do with his ability", type: "Number", default: "1", range: "N/A" },
            { name: "Vigilante Multiple Kill", description: "Whether the Vigilante can kill more than once per meeting", type: "Toggle", default: "False", range: "N/A" },
            { name: "Vigilante Guess Neutral Benign", description: "Whether the Vigilante can Guess Neutral Benign roles", type: "Toggle", default: "False", range: "N/A" },
            { name: "Vigilante Guess Neutral Evil", description: "Whether the Vigilante can Guess Neutral Evil roles", type: "Toggle", default: "False", range: "N/A" },
            { name: "Vigilante Guess Neutral Killing", description: "Whether the Vigilante can Guess Neutral Killing roles", type: "Toggle", default: "False", range: "N/A" },
            { name: "Vigilante Guess Impostor Modifiers", description: "Whether the Vigilante can Guess Impostor modifiers", type: "Toggle", default: "False", range: "N/A" },
            { name: "Vigilante Guess Lovers", description: "Whether the Vigilante can Guess Lovers", type: "Toggle", default: "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Altruist", team: "Crewmate",
        description: "The Altruist is a Crewmate that is capable of reviving dead players. The Altruist may attempt to revive all dead players from that round. When reviving the Altruist may not move and all killers will be pointed towards the Altruist. After a set period of time, all dead player's bodies within the Altruist's range will be resurrected, if the revival isn't interrupted. Once a revival is used, the Altruist, along with all revived players will not be able to button for the remainder of the game.",
        abilities: [{ name: "Revive", icon: 'TownOfUs.Resources.CrewButtons.ReviveButton.png', description: "Revives dead players within a certain radius." }],
        icon: 'Altruist',
        types: ["Support"],
        options: [
            { name: "Altruist", description: "The percentage probability of the Altruist appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Revive Duration", description: "The time it takes for the Altruist to revive all dead bodies", type: "Time", default: "5s", range: "N/A" },
            { name: "Revive Uses", description: "The number of times the Revive ability can be used", type: "Number", default: "3", range: "N/A" },
            { name: "Revive Radius", description: "How wide the revive radius is", type: "Multiplier", default: "1x", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Cleric", team: "Crewmate",
        description: "The Cleric is a Crewmate that can barrier or cleanse other players. When a player is barriered they cannot be killed for a set duration. When a player is cleansed all negative effects are removed, however, not all effects are removed instantly, some are instead removed at the beginning of the following meeting.",
        abilities: [
            { name: "Barrier", icon: 'TownOfUs.Resources.CrewButtons.BarrierButton.png', description: "Barriers players, making them immune to kills for a duration." },
            { name: "Cleanse", icon: 'TownOfUs.Resources.CrewButtons.CleanseButton.png', description: "Removes negative effects from players." }
        ],
        icon: 'Cleric',
        types: ["Support"],
        options: [
            { name: "Cleric", description: "The percentage probability of the Cleric appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Barrier Cooldown", description: "The cooldown of the Cleric's Barrier and Cleanse buttons", type: "Time", default: "25s", range: "N/A" },
            { name: "Show Barriered Player", description: "Who should be able to see who is Barriered", type: "Self / Cleric / Self + Cleric", default: "Cleric", range: "N/A" },
            { name: "Cleric Gets Attack Notification", description: "Whether the Cleric knows when the barriered player is attacked", type: "Toggle", default: "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Oracle", team: "Crewmate",
        description: "The Oracle is a Crewmate that can get another player to confess information to them. The Oracle has 2 abilities. The first, confess, makes a player confess saying that one of two players is good and will reveal their alignment when the Oracle dies. The second, bless, makes someone immune to dying during a meeting.",
        abilities: [
            { name: "Confess", icon: 'TownOfUs.Resources.CrewButtons.ConfessButton.png', description: "Makes a player confess information, revealing alignments upon Oracle's death." },
            { name: "Bless", icon: 'TownOfUs.Resources.CrewButtons.BlessButton.png', description: "Grants immunity from dying during a meeting." }
        ],
        icon: 'Oracle',
        types: ["Detection", "Support"],
        options: [
            { name: "Oracle", description: "The percentage probability of the Oracle appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Confess Cooldown", description: "The Cooldown of the Oracle's Confess button", type: "Time", default: "10s", range: "N/A" },
            { name: "Initial Bless Cooldown", description: "The Initial Cooldown of the Oracle's Bless button", type: "Time", default: "10s", range: "N/A" },
            { name: "Reveal Accuracy", description: "The percentage probability of the Oracle's confessed player telling the truth", type: "Percentage", default: "80%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Warden", team: "Crewmate",
        description: "The Warden is a Crewmate that can fortify other players. Fortified players cannot be interacted with. If someone tries to interact with or assassinate a fortified player, Both the Warden and the interactor receive an alert.",
        abilities: [{ name: "Fortify Player", icon: 'TownOfUs.Resources.CrewButtons.FortifyButton.png', description: "Fortifies players, making them immune to interactions and assassinations." }],
        icon: 'Warden',
        types: ["Support"],
        options: [
            { name: "Warden", description: "The percentage probability of the Warden appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Show Fortified Player", description: "Who should be able to see who is Fortified", type: "Self / Warden / Self + Warden", default: "Warden", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Imitator", team: "Crewmate",
        description: "The Imitator is a Crewmate that can mimic dead crewamtes. During meetings the Imitator can select who they are going to imitate the following round from the dead. They can choose to use each dead players as many times as they wish.",
        abilities: [{ name: "Imitate Role", icon: 'TownOfUs.Resources.CrewButtons.ImitatorSelect.png', description: "Mimics dead crewmates' roles during meetings." }],
        icon: 'Imitator',
        types: ["Utility", "Other"],
        options: [
            { name: "Imitator", description: "The percentage probability of the Imitator appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Imitator Can Become Mayor", description: "Whether the Imitator can permanently become the Mayor", type: "Toggle", default: "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Mayor", team: "Crewmate",
        description: "Once per game the Mayor can reveal themselves as the Mayor mid-meeting, once done so they gain an additional 2 votes.",
        abilities: [{ name: "Reveal as Mayor", icon: 'TownOfUs.Resources.RevealClean.png', description: "Reveals self as Mayor to gain additional votes." }],
        icon: 'Mayor',
        types: ["Utility"],
        options: [
            { name: "Mayor", description: "The percentage probability of the Mayor appearing", type: "Percentage", default: "0%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Medium", team: "Crewmate",
        description: "The Medium is a Crewmate that can see ghosts. During each round the Medium has an ability called Mediate. If the Medium uses this ability and no one is dead, nothing will happen. However, if someone is dead, the Medium and the dead player will be able to see each other and communicate from beyond the grave!",
        abilities: [{ name: "Mediate", icon: 'TownOfUs.Resources.CrewButtons.MediateButton.png', description: "Communicates with dead players." }],
        icon: 'Medium',
        types: ["Utility", "Detection"],
        options: [
            { name: "Medium", description: "The percentage probability of the Medium appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Mediate Cooldown", description: "The cooldown of the Medium's Mediate button", type: "Time", default: "10s", range: "N/A" },
            { name: "Reveal Appearance of Mediate Target", description: "Whether the Ghosts will show as themselves, or camouflaged", type: "Toggle", default: "True", range: "N/A" },
            { name: "Reveal the Medium to the Mediate Target", description: "Whether the ghosts can see that the Medium is the Medium", type: "Toggle", default: "True", range: "N/A" },
            { name: "Who is Revealed", description: "Which players are revealed to the Medium", type: "Oldest Dead / Newest Dead / All Dead", default: "Oldest Dead", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Plumber", team: "Crewmate",
        description: "The Plumber is a Crewmate that maintains vent systems. The Plumber can either flush vents, ejecting all players currently in vents, or block a vent, placing a barricade on the vent preventing it's use.",
        abilities: [
            { name: "Flush", icon: 'TownOfUs.Resources.CrewButtons.FlushButton.png', description: "Ejects all players from vents." },
            { name: "Barricade", icon: 'TownOfUs.Resources.CrewButtons.BarricadeButton.png', description: "Blocks a vent with a barricade." }
        ],
        icon: 'Plumber',
        types: ["Utility", "Sabotage"],
        options: [
            { name: "Plumber", description: "The percentage probability of the Plumber appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Flush Cooldown", description: "The cooldown of the Plumber's Flush and Block buttons", type: "Time", default: "25s", range: "N/A" },
            { name: "Maximum Barricades", description: "The number of times the Plumber can block a vent", type: "Number", default: "5", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Politician", team: "Crewmate",
        description: "The Politician is a Crewmate that can campaign to other players. Once half or more of the Crewmates are campaigned to, the Politician can reveal themselves as the new Mayor. If less then half of the Crewmates have been campaigned to the reveal will fail and the Politician will be unable to campaign for 1 round.",
        abilities: [{ name: "Campaign to Reveal", icon: 'TownOfUs.Resources.CrewButtons.CampaignButton.png', description: "Campaigns to other players to reveal as Mayor." }],
        icon: 'Politician',
        types: ["Utility"],
        options: [
            { name: "Politician", description: "The percentage probability of the Politician appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Campaign Cooldown", description: "The cooldown of the Politician's Campaign button", type: "Time", default: "25s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Prosecutor", team: "Crewmate",
        description: "The Prosecutor has 2 abilities, one is the ability for them to see all the votes (non-anonymous voting), the other, once per game during a meeting the Prosecutor can prosecute someone, making all other votes redundant and having whoever the Prosecutor selected exiled that meeting.",
        abilities: [{ name: "Prosecute", icon: 'TownOfUs.Resources.RoleIcons.Prosecutor.png', description: "Can see all votes and can exile someone once per game." }],
        icon: 'Prosecutor',
        types: ["Utility", "Detection"],
        options: [
            { name: "Prosecutor", description: "The percentage probability of the Prosecutor appearing", type: "Percentage", default: "0%", range: "N/A" },
            { name: "Prosecutor Dies When They Exile A Crewmate", description: "Whether the Prosecutor also gets exiled when they exile a Crewmate", type: "Toggle", default: "False", range: "N/A" }
        ]
    },

    {
        category: "Role", name: "Amnesiac", team: "Neutral",
        description: "The Amnesiac is a Neutral role with no win condition.\nThey have zero tasks and are essentially roleless. However, they can remember a role by finding a dead player.\nOnce they remember their role, they go on to try win with their new win condition.",
        abilities: [{ name: "Remember Role", icon: 'TownOfUs.Resources.NeutButtons.RememberButton.png', description: "Remembers a role by finding a dead player." }],
        icon: 'Amnesiac',
        types: ["Information"],
        options: [
            { name: "Amnesiac", description: "The percentage probability of the Amnesiac appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Amnesiac Gets Arrows", description: "Whether the Amnesiac has arrows pointing to dead bodies", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Arrow Appear Delay", description: "The delay of the arrows appearing after the person died", type: "Time", "default": "5s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Guardian Angel", team: "Neutral",
        description: "The Guardian Angel is a Neutral role which aligns with the faction of their target.\nTheir job is to protect their target at all costs.\nIf their target loses, they lose.",
        abilities: [{ name: "Protect Target", icon: 'TownOfUs.Resources.NeutButtons.ProtectButton.png', description: "Protects their target from being killed." }],
        icon: 'GuardianAngel',
        types: ["Protective"],
        options: [
            { name: "Guardian Angel", description: "The percentage probability of the Guardian Angel appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Protect Cooldown", description: "The cooldown of the Guardian Angel's Protect button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Protect Duration", description: "How long The Guardian Angel's Protect lasts", type: "Time", "default": "10s", range: "N/A" },
            { name: "Max Uses", description: "The amount of times the Protect ability can be used", type: "Number", "default": "5", range: "N/A" },
            { name: "Show Protected Player", description: "Who should be able to see who is Protected", type: "Self / GA / Self + GA", "default": "Self", range: "N/A" },
            { name: "Guardian Angel becomes on Target Dead", description: "Which role the Guardian Angel becomes when their target dies", type: "Crewmate / Amnesiac / Mercenary / Survivor / Jester", "default": "Survivor", range: "N/A" },
            { name: "Target Knows GA Exists", description: "Whether the GA's Target knows they have a GA", type: "Toggle", "default": "False", range: "N/A" },
            { name: "GA Knows Targets Role", description: "Whether the GA knows their target's role", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Odds Of Target Being Evil", description: "The chances of the Guardian Angel's target being evil", type: "Percentage", "default": "20%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Mercenary", team: "Neutral",
        description: "The Mercenary is a Neutral role which can guard other players.\nGuarded players absorb abilities and convert it into currency. This currency can be used to bribe other players.\nIf a bribed player lives and goes onto win the game, the Mercenary does too.\nThe Mercenary does not need to survive themselves. They cannot win with Neutral Evils or Lovers.",
        abilities: [
            { name: "Bribe", icon: 'TownOfUs.Resources.NeutButtons.BribeButton.png', description: "Uses currency to bribe other players." },
            { name: "Guard", icon: 'TownOfUs.Resources.NeutButtons.GuardButton.png', description: "Guards players, converting absorbed abilities into currency." }
        ],
        icon: 'Mercenary',
        types: ["Utility", "Support"],
        options: [
            { name: "Mercenary", description: "The percentage probability of the Mercenary appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Guard Cooldown", description: "The cooldown of the Mercenary's Guard button", type: "Time", "default": "10s", range: "N/A" },
            { name: "Max Guards", description: "The maximum amount of Guards active at one time", type: "Number", "default": "3", range: "N/A" },
            { name: "Gold To Bribe", description: "The amount of gold required to bribe a player", type: "Number", "default": "3", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Survivor", team: "Neutral",
        description: "The Survivor is a Neutral role which can win by simply surviving.\nHowever, if Lovers, or a Neutral Evil role wins the game, the Survivor loses.",
        abilities: [{ name: "Safeguard", icon: 'TownOfUs.Resources.NeutButtons.VestButton.png', description: "Activates a vest to protect against kills." }],
        icon: 'Survivor',
        types: ["Protective"],
        options: [
            { name: "Survivor", description: "The percentage probability of the Survivor appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Vest Cooldown", description: "The cooldown of the Survivor's Vest button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Vest Duration", description: "How long The Survivor's Vest lasts", type: "Time", "default": "10s", range: "N/A" },
            { name: "Max Uses", description: "The amount of times the Vest ability can be used", type: "Number", "default": "5", range: "N/A" },
            { name: "Survivor Scatter Mechanic", description: "Whether the Survivor needs to keep moving to avoid dying", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Survivor Movement Timer", description: "How frequently the Survivor needs to move", type: "Time", "default": "25s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Doomsayer", team: "Neutral",
        description: "The Doomsayer is a Neutral role with its own win condition.\nTheir goal is to assassinate 3 players to win. If there are only 2 other people alive, the Doomsayer only needs to assassinate the remainder of the players.\nThey have an additional observe ability that hints towards certain player's roles.",
        abilities: [
            { name: "Observe", icon: 'TownOfUs.Resources.NeutButtons.ObserveButton.png', description: "Observes players to gain hints about their roles." },
            { name: "Guess", icon: 'TownOfUs.Resources.Guess.png', description: "Assassinate players by guessing their role." }
        ],
        icon: 'Doomsayer',
        types: ["Killing", "Information"],
        options: [
            { name: "Doomsayer", description: "The percentage probability of the Doomsayer appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Observe Cooldown", description: "The Cooldown of the Doomsayer's Observe button", type: "Time", "default": "10s", range: "N/A" },
            { name: "Doomsayer Guesses All At Once", description: "Whether the Doomsayer has to guess all 3 roles to win at once", type: "Toggle", "default": "True", range: "N/A" },
            { name: "(Experienced) Doomsayer Can't Observe", description: "The Doomsayer doesn't have the observe feature", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Doomsayer Win Ends Game", description: "Whether Doomsayer winning ends the game", type: "Toggle", "default": "True", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Executioner", team: "Neutral",
        description: "The Executioner is a Neutral role with its own win condition.\nTheir goal is to vote out a player, specified in the beginning of a game.\nIf that player gets voted out, they win the game.",
        abilities: [], // No active ability as per description
        icon: 'Executioner',
        types: ["Chaos", "Killing"],
        options: [
            { name: "Executioner", description: "The percentage probability of the Executioner appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Executioner becomes on Target Dead", description: "Which role the Executioner becomes when their target dies", type: "Crewmate / Amnesiac / Mercenary / Survivor / Jester", "default": "Jester", range: "N/A" },
            { name: "Executioner Can Button", description: "Whether the Executioner Can Press the Button", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Executioner Win", description: "What happens when the Executioner wins", type: "Ends Game / Nothing / Torments", "default": "Ends Game", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Jester", team: "Neutral",
        description: "The Jester is a Neutral role with its own win condition.\nIf they are voted out after a meeting, the game finishes and they win.\nHowever, the Jester does not win if the Crewmates, Impostors or another Neutral role wins.",
        abilities: [], // No active ability as per description
        icon: 'Jester',
        types: ["Chaos", "Killing"],
        options: [
            { name: "Jester", description: "The percentage probability of the Jester appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Jester Can Button", description: "Whether the Jester Can Press the Button", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Jester Can Vent", description: "Whether the Jester Can Vent", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Jester Has Impostor Vision", description: "Whether the Jester Has Impostor Vision", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Jester Scatter Mechanic", description: "Whether the Jester needs to keep moving to avoid dying", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Jester Movement Timer", description: "How frequently the Jester needs to move", type: "Time", "default": "25s", range: "N/A" },
            { name: "Jester Win", description: "What happens when the Jester wins", type: "Ends Game / Nothing / Haunts", "default": "Ends Game", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Phantom", team: "Neutral",
        description: "The Phantom \nis a Neutral role with its own win condition. They become half-invisible when they die and has to complete all their tasks without getting caught.",
        abilities: [{ name: "Finish Tasks To Win", icon: 'TownOfUs.Resources.RoleIcons.Phantom.png', description: "Completes tasks to win the game while half-invisible after death." }],
        icon: 'Phantom',
        types: ["Stealth", "Utility"],
        options: [
            { name: "Phantom", description: "The percentage probability of the Phantom appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "When Phantom Can Be Clicked", description: "The amount \nof tasks remaining when the Phantom Can Be Clicked", type: "Number", "default": "5", range: "N/A" },
            { name: "Phantom Win Ends Game", description: "Whether Phantom winning ends the game", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Inquisitor", team: "Neutral",
        description: "The Inquisitor is a Neutral Evil role that wins if their targets (Heretics) die.\nThe only information provided is their roles, and it\'s up to the Inquisitor to identify those players (marked with a dark pink-ish $ to the dead) and get them killed by any means neccesary.",
        abilities: [
            { name: "Inquire", icon: 'TownOfUs.Resources.NeutButtons.InquireButton.png', description: "Inquires to identify targets (Heretics)." },
            { name: "Vanquish", icon: 'TownOfUs.Resources.NeutButtons.InquisKillButton.png', description: "Eliminates identified targets." }
        ],
        icon: 'Inquisitor',
        types: ["Killing", "Information"],
        options: [
            { name: "Inquisitor", description: "The percentage probability of the Inquisitor appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Soul Collector", team: "Neutral",
        description: "The Soul Collector is a Neutral role with its own win condition.\nThe Soul Collector kills be reaping players, reaped players do not leave behind a dead body, instead they leave a soul.\nThe Soul Collector needs to be the last killer alive to win the game.",
        abilities: [{ name: "Reap", icon: 'TownOfUs.Resources.NeutButtons.ReapButton.png', description: "Reaps players, leaving behind a soul instead of a body." }],
        icon: 'SoulCollector',
        types: ["Killing", "Utility"],
        options: [
            { name: "Soul Collector", description: "The percentage probability of the Soul Collector appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Reap Cooldown", description: "The Cooldown of the Soul Collector's Reap button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Soul Collector can Vent", description: "Whether the Soul Collector can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Arsonist", team: "Neutral",
        description: "The Arsonist is a Neutral role with its own win condition.\nThey have two abilities, one is to douse other players with gasoline.\nThe other is to ignite all doused players near them.\nThe Arsonist needs to be the last killer alive to win the game.",
        abilities: [
            { name: "Douse", icon: 'TownOfUs.Resources.NeutButtons.DouseButton.png', description: "Douses players with gasoline." },
            { name: "Ignite", icon: 'TownOfUs.Resources.NeutButtons.IgniteButton.png', description: "Ignites all doused players nearby." }
        ],
        icon: 'Arsonist',
        types: ["Killing"],
        options: [
            { name: "Arsonist", description: "The percentage probability of the Arsonist appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Douse Cooldown", description: "The cooldown of the Arsonist's Douse button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Ignite Radius", description: "How wide the ignite radius is", type: "Multiplier", "default": "0.25x", range: "N/A" },
            { name: "Arsonist can Vent", description: "Whether the Arsonist can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Juggernaut", team: "Neutral",
        description: "The Juggernaut is a Neutral role \nwith its own win condition. The Juggernaut\'s special ability is that their kill cooldown reduces with each kill.\nThis means in theory the Juggernaut can have a 0 second kill cooldown!\nThe Juggernaut needs to be the last killer alive to win the game.",
        abilities: [{ name: "Kill", icon: 'TownOfUs.Resources.NeutButtons.JuggKillButton.png', description: "Kills with a cooldown that reduces with each kill." }],
        icon: 'Juggernaut',
        types: ["Killing"],
        options: [
            { name: "Juggernaut", description: "The percentage probability of the Juggernaut appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Juggernaut Kill Cooldown", description: "The initial cooldown of the Juggernaut's Kill button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Reduced Kill Cooldown Per Kill", description: "The amount of time removed from the Juggernaut's Kill Cooldown Per Kill", type: "Time", "default": "5s", range: "N/A" },
            { name: "Juggernaut can Vent", description: "Whether the Juggernaut can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Plaguebearer", team: "Neutral",
        description: "The Plaguebearer is a Neutral role with its own win condition, as well as an ability to transform into another role.\nThe Plaguebearer has one ability, which allows them to infect other players.\nOnce infected, the infected player can go and infect other players via interacting with them.\nOnce all players are infected, the Plaguebearer becomes Pestilence. The Pestilence is a unkillable force which can only be killed by being voted out, even their lover dying won't kill them.\nThe Plaguebearer or Pestilence needs to be the last killer alive to win the game.",
        abilities: [{ name: "Infect", icon: 'TownOfUs.Resources.NeutButtons.InfectButton.png', description: "Infects other players, spreading the plague." }],
        icon: 'Plaguebearer',
        types: ["Converting", "Killing"],
        options: [
            { name: "Plaguebearer", description: "The percentage probability of the Plaguebearer appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Infect Cooldown", description: "The cooldown of the Plaguebearer's Infect button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Pestilence Kill Cooldown", description: "The cooldown of the Pestilence's Kill button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Pestilence can Vent", description: "Whether the Pestilence can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Pestilence", team: "Neutral",
        description: "The Pestilence is a \nNeutral role with its own win condition. They can only be killed by being voted out, even their lover dying won't kill them.",
        abilities: [{ name: "Kill", icon: 'TownOfUs.Resources.NeutButtons.PestKillButton.png', description: "Kills players, cannot be killed except by voting." }],
        icon: 'Pestilence',
        types: ["Killing", "Defense"],
        options: [
            { name: "Pestilence", description: "The percentage probability of the Pestilence appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Glitch", team: "Neutral",
        description: "The Glitch is a Neutral role with its own win condition.\nThe Glitch's aim is to kill everyone and be the last person standing.\nThe Glitch can Hack players, resulting in them being unable to report bodies and use abilities.\nHacking prevents the hacked player from doing anything but walk around the map.\nThe Glitch can Mimic someone, which results in them looking exactly like the other person.",
        abilities: [
            { name: "Kill", icon: 'TownOfUs.Resources.NeutButtons.GlitchKillButton.png', description: "Eliminates other players." },
            { name: "Hack", icon: 'TownOfUs.Resources.NeutButtons.HackButton.png', description: "Disables players' ability to report or use abilities." },
            { name: "Mimic", icon: 'TownOfUs.Resources.NeutButtons.MimicButton.png', description: "Mimics another player's appearance." }
        ],
        icon: 'Glitch',
        types: ["Killing", "Sabotage", "Deception"],
        options: [
            { name: "The Glitch", description: "The percentage probability of The Glitch appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Mimic Cooldown", description: "The cooldown of The Glitch's Mimic button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Mimic Duration", description: "How long The Glitch can Mimic a player", type: "Time", "default": "10s", range: "N/A" },
            { name: "Hack Cooldown", description: "The cooldown of The Glitch's Hack button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Hack Duration", description: "How long The Glitch can Hack a player", type: "Time", "default": "10s", range: "N/A" },
            { name: "Glitch Kill Cooldown", description: "The cooldown of the Glitch's Kill button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Glitch can Vent", description: "Whether the Glitch can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Vampire", team: "Neutral",
        description: "The Vampire is a Neutral role with its own \nwin condition. The Vampire can convert or kill other players by biting them.\nIf the bitten player was a Crewmate they will turn into a Vampire (unless there are 2 Vampires alive) Else they will kill the bitten player.",
        abilities: [{ name: "Bite", icon: 'TownOfUs.Resources.NeutButtons.BiteButton.png', description: "Converts or kills players by biting them." }],
        icon: 'Vampire',
        types: ["Converting", "Killing"],
        options: [
            { name: "Vampire", description: "The percentage probability of the Vampire appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Bite Cooldown", description: "The cooldown of the Vampire's \nBite button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Vampire Has Impostor Vision", description: "Whether the Vampire Has Impostor Vision", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Vampire Can Vent", description: "Whether the Vampire Can Vent", type: "Toggle", "default": "False", range: "N/A" },
            { name: "New Vampire Can Assassinated", description: "Whether the new Vampire can assassinate", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Maximum Vampires Per Game", description: "The maximum amount of players that can be Vampires", type: "Number", "default": "2", range: "N/A" },
            { name: "Can Convert Neutral Benign Roles", description: "Whether Neutral Benign Roles can be turned into Vampires", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Can Convert Neutral Evil Roles", description: "Whether Neutral Evil Roles can be turned into Vampires", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Werewolf", team: "Neutral",
        description: "The Werewolf is a Neutral role with its own win condition.\nAlthough the Werewolf has a kill button, they can't use it unless they are Rampaged.\nOnce the Werewolf rampages they gain Impostor vision and the ability to kill.\nHowever, unlike most killers their kill cooldown is really short.\nThe Werewolf needs to be the last killer alive to win the game.",
        abilities: [
            { name: "Rampage", icon: 'TownOfUs.Resources.NeutButtons.RampageButton.png', description: "Activates rampage mode, gaining Impostor vision and kill ability." },
            { name: "Kill", icon: 'TownOfUs.Resources.NeutButtons.WolfKillButton.png', description: "Kills with a short cooldown while rampaging." }
        ],
        icon: 'Werewolf',
        types: ["Killing", "Movement"],
        options: [
            { name: "Werewolf", description: "The percentage probability of the Werewolf appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Rampage Cooldown", description: "The cooldown of the Werewolf's Rampage button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Rampage Duration", description: "The duration of the Werewolf's Rampage", type: "Time", "default": "25s", range: "N/A" },
            { name: "Rampage Kill Cooldown", description: "The cooldown of the Werewolf's Kill button", type: "Time", "default": "10s", range: "N/A" },
            { name: "Werewolf can Vent when Rampaged", description: "Whether the Werewolf can Vent when Rampaged", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Eclipsal", team: "Impostor",
        description: "The Eclipsal is an Impostor that can blind other players.\nBlinded players have no vision and their report buttons do not light up (but can still be used).",
        abilities: [{ name: "Blind", icon: 'TownOfUs.Resources.ImpButtons.BlindButton.png', description: "Blinds other players, removing their vision." }],
        icon: 'Eclipsal',
        types: ["Sabotage"],
        options: [
            { name: "Eclipsal", description: "The percentage probability of the Eclipsal appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Blind Cooldown", description: "The cooldown of the Eclipsal's Blind button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Blind Duration", description: "How long the Blind lasts for", type: "Time", "default": "25s", range: "N/A" },
            { name: "Blind Radius", description: "How wide the blind radius is", type: "Multiplier", "default": "1x", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Escapist", team: "Impostor",
        description: "The Escapist is an \nImpostor that can teleport to a different location. Once per round the Escapist can Mark a location which they can then escape to later in the round.",
        abilities: [{ name: "Teleport", icon: 'TownOfUs.Resources.ImpButtons.RecallButton.png', description: "Marks a location and teleports back to it." }],
        icon: 'Escapist',
        types: ["Movement"],
        options: [
            { name: "Escapist", description: "The percentage probability of the Escapist appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Recall Cooldown", description: "The cooldown of the \nEscapist\'s Recall button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Escapist can Vent", description: "Whether the Escapist can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Grenadier", team: "Impostor",
        description: "The Grenadier is an Impostor that can throw smoke grenades. During the game, the Grenadier has the option to throw down a smoke grenade which blinds Crewmates so they can't see. However, a sabotage and a smoke grenade can not be active at the same time.",
        abilities: [{ name: "Flashbang", icon: 'TownOfUs.Resources.ImpButtons.FlashButton.png', description: "Throws smoke grenades to blind Crewmates." }],
        icon: 'Grenadier',
        types: ["Kill"],
        options: [
            { name: "Grenadier", description: "The percentage probability of the Grenadier appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Flash Grenade Cooldown", description: "The cooldown of the Grenadier's Flash button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Flash Grenade Duration", description: "How long the Flash Grenade lasts for", type: "Time", "default": "10s", range: "N/A" },
            { name: "Flash Radius", description: "How wide the flash radius is", type: "Multiplier", "default": "1x", range: "N/A" },
            { name: "Grenadier can Vent", description: "Whether the Grenadier can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Morphling", team: "Impostor",
        description: "The Morphling is an Impostor that can Morph into another player. At the beginning of the game and after every meeting, they can choose someone to Sample. They can then Morph into that person at any time for a limited amount of time.",
        abilities: [
            { name: "Sample", icon: 'TownOfUs.Resources.ImpButtons.SampleButton.png', description: "Samples a player to morph into them later." },
            { name: "Morph", icon: 'TownOfUs.Resources.ImpButtons.MorphButton.png', description: "Temporarily morphs into a sampled player." }
        ],
        icon: 'Morphling',
        types: ["Utility", "Sabotage"],
        options: [
            { name: "Morphling", description: "The percentage probability of the Morphling appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Morph Cooldown", description: "The cooldown of the Morphling's Morph button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Morph Duration", description: "How long the Morph lasts for", type: "Time", "default": "10s", range: "N/A" },
            { name: "Morphling can Vent", description: "Whether the Morphling can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Swooper", team: "Impostor",
        description: "The Swooper is an Impostor that can temporarily turn invisible.",
        abilities: [{ name: "Turn Invisible", icon: 'TownOfUs.Resources.ImpButtons.SwoopButton.png', description: "Temporarily turns invisible." }],
        icon: 'Swooper',
        types: ["Utility"],
        options: [
            { name: "Swooper", description: "The percentage probability of the Swooper appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Swooper Cooldown", description: "The cooldown of the Swooper's Swoop button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Swooper Duration", description: "How long the Swooping lasts for", type: "Time", "default": "10s", range: "N/A" },
            { name: "Swooper can Vent", description: "Whether the Swooper can Vent", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Venerer", team: "Impostor",
        description: "The Venerer is an Impostor that gains abilities through killing. After their first kill, the Venerer can camouflage themself. After their second kill, the Venerer can sprint. After their third kill, every other player is slowed while their ability is activated. All abilities are activated by the one button and have the same duration.",
        abilities: [
            { name: "Camouflage", icon: 'TownOfUs.Resources.ImpButtons.CamoflageButton.png', description: "Camouflages self after first kill." },
            { name: "Sprint", icon: 'TownOfUs.Resources.ImpButtons.CamoSprintButton.png', description: "Sprints after second kill." },
            { name: "Freeze", icon: 'TownOfUs.Resources.ImpButtons.CamoSprintFreezeButton.png', description: "Slows other players after third kill." }
        ],
        icon: 'Venerer',
        types: ["Sabotage", "Utility"],
        options: [
            { name: "Venerer", description: "The percentage probability of the Venerer appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Ability Cooldown", description: "The cooldown of the Venerer's Ability button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Ability Duration", description: "How long the Venerer's ability lasts for", type: "Time", "default": "10s", range: "N/A" },
            { name: "Sprint Speed", description: "How fast the speed increase of the Venerer is when sprinting", type: "Multiplier", "default": "1.25x", range: "N/A" },
            { name: "Min Freeze Speed", description: "How slow the minimum speed is when the Venerer's ability is active", type: "Multiplier", "default": "0.25x", range: "N/A" },
            { name: "Freeze Radius", description: "How wide the freeze radius is", type: "Multiplier", "default": "1x", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Bomber", team: "Impostor",
        description: "The Bomber is an Impostor who has the ability to plant bombs instead of kill. After a bomb is planted, the bomb will detonate a fixed time period as per settings. Once the bomb detonates it will kill all Crewmates (and Impostors!) inside the radius.",
        abilities: [{ name: "Plant Bomb", icon: 'TownOfUs.Resources.ImpButtons.DetonatingButton.png', description: "Plants bombs that detonate and kill players within a radius." }],
        icon: 'Bomber',
        types: ["Kill", "Sabotage"],
        options: [
            { name: "Bomber", description: "The percentage probability of the Bomber appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Detonate Delay", description: "The delay of the detonation after bomb has been planted", type: "Time", "default": "5s", range: "N/A" },
            { name: "Max Kills In Detonation", description: "Maximum number of kills in the detonation", type: "Time", "default": "5s", range: "N/A" },
            { name: "Detonate Radius", description: "How wide the detonate radius is", type: "Multiplier", "default": "0.25x", range: "N/A" },
            { name: "Bomber can Vent", description: "Whether the Bomber can Vent", type: "Toggle", "default": "False", range: "N/A" },
            { name: "All Imps See Bomb", description: "Whether all the Impostors see the Bomber's bombs", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Scavenger", team: "Impostor",
        description: "The Scavenger is an Impostor who hunts down prey. With each successful hunt the Scavenger has a shortened kill cooldown. On an incorrect kill the Scavenger has a significantly increased kill cooldown.",
        abilities: [{ name: "Kill", icon: 'TownOfUs.Resources.RoleIcons.Scavenger.png', description: "Kills with a cooldown shortened on successful hunts, increased on incorrect ones." }],
        icon: 'Scavenger',
        types: ["Utility", "Sabotage"],
        options: [
            { name: "Scavenger", description: "The percentage probability of the Scavenger appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Scavenge Duration", description: "How long the Scavenger's scavenge lasts for", type: "Time", "default": "25s", range: "N/A" },
            { name: "Scavenge Duration Increase Per Kill", description: "How much time the Scavenge duration increases on a correct kill", type: "Time", "default": "10s", range: "N/A" },
            { name: "Scavenge Kill Cooldown On Correct Kill", description: "The kill cooldown the Scavenger has on a correct kill", type: "Time", "default": "10s", range: "N/A" },
            { name: "Kill Cooldown Multiplier On Incorrect Kill", description: "The increased time the kill cooldown has on an incorrect kill", type: "Multiplier", "default": "3x", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Traitor", team: "Impostor",
        description: "If all Impostors die before a certain point in the game, a random Crewmate is selected to become the Traitor. The Traitor has no additional abilities and their job is simply to avenge the dead Impostors. Once this player has turned into the Traitor their alliance sits with the Impostors. The Traitor is offered a choice of up to 3 Impostor roles when they initially change roles.",
        abilities: [{ name: "Select a Role", icon: 'TownOfUs.Resources.ImpButtons.TraitorSelect.png', description: "Selects an Impostor role to take on if all Impostors die." }],
        icon: 'Traitor',
        types: ["Other"],
        options: [
            { name: "Traitor", description: "The percentage probability of the Traitor appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Minimum People Alive When Traitor Can Spawn", description: "The minimum number of people alive when a Traitor can spawn", type: "Number", "default": "5", range: "N/A" },
            { name: "Traitor Won't Spawn if Neutral Killing are Alive", description: "Whether the Traitor won't spawn if any Neutral Killing roles are alive", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Warlock", team: "Impostor",
        description: "The Warlock is an Impostor that can charge up their kill button. Once activated the Warlock can use their kill button infinitely until they run out of charge. However, they do not need to fully charge their kill button to use it.",
        abilities: [{ name: "Charge Kill", icon: 'TownOfUs.Resources.RoleIcons.Warlock.png', description: "Charges kill button for infinite kills until charge runs out." }],
        icon: 'Warlock',
        types: ["Sabotage"],
        options: [
            { name: "Warlock", description: "The percentage probability of the Warlock appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Time It Takes To Fully Charge", description: "The time it takes to fully charge the Warlock's Kill Button", type: "Time", "default": "25s", range: "N/A" },
            { name: "Time It Takes To Use Full Charge", description: "The maximum duration a charge of the Warlock's Kill Button lasts", type: "Time", "default": "1s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Blackmailer", team: "Impostor",
        description: "The Blackmailer is an Impostor that can silence people in meetings. During each round, the Blackmailer can go up to someone and blackmail them. This prevents the blackmailed person from speaking and possibly voting during the next meeting.",
        abilities: [{ name: "Blackmail", icon: 'TownOfUs.Resources.ImpButtons.BlackmailButton.png', description: "Silences people in meetings, preventing them from speaking and voting." }],
        icon: 'Blackmailer',
        types: ["Sabotage"],
        options: [
            { name: "Blackmailer", description: "The percentage probability of the Blackmailer appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Initial Blackmail Cooldown", description: "The initial cooldown of the Blackmailer's Blackmail button", type: "Time", "default": "10s", range: "N/A" },
            { name: "Only Target Sees Blackmail", description: "If enabled, only the blackmailed player (and the Blackmailer) will see that the player can't speak", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Maximum People Alive Where Blackmailed Can Vote", description: "The maximum number of players alive to allow the blackmailed player to vote", type: "Number", "default": "5", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Hypnotist", team: "Impostor",
        description: "The Hypnotist is an Impostor that can hypnotize people. Once enough people are hypnotized, the Hypnotist can release Mass Hysteria. With Mass Hysteria released, all hypnotized players see all other players as either themselves, camouflaged or invisible. Once the Hypnotist dies Mass Hysteria is removed and people can see everyone normally again.",
        abilities: [
            { name: "Hypnotize", icon: 'TownOfUs.Resources.ImpButtons.HypnotiseButton.png', description: "Hypnotizes people to prepare for Mass Hysteria." },
            { name: "Mass Hysteria", icon: 'TownOfUs.Resources.HysteriaClean.png', description: "Releases Mass Hysteria, altering hypnotized players' vision." }
        ],
        icon: 'Hypnotist',
        types: ["Sabotage"],
        options: [
            { name: "Hypnotist", description: "The percentage probability of the Hypnotist appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Hypnotize Cooldown", description: "The cooldown of the Hypnotist's Hypnotize button", type: "Time", "default": "25s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Janitor", team: "Impostor",
        description: "The Janitor is an Impostor that can clean up bodies. Both their Kill and Clean ability have a shared cooldown, meaning they have to choose which one they want to use.",
        abilities: [{ name: "Clean Body", icon: 'TownOfUs.Resources.ImpButtons.CleanButton.png', description: "Cleans up bodies." }],
        icon: 'Janitor',
        types: ["Utility"],
        options: [
            { name: "Janitor", description: "The percentage probability of the Janitor appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Miner", team: "Impostor",
        description: "The Miner is an Impostor that can create new vents. These vents only connect to each other, forming a new passway.",
        abilities: [{ name: "Place Vent", icon: 'TownOfUs.Resources.ImpButtons.MineButton.png', description: "Creates new interconnected vents." }],
        icon: 'Miner',
        types: ["Utility"],
        options: [
            { name: "Miner", description: "The percentage probability of the Miner appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Mine Cooldown", description: "The cooldown of the Miner's Mine button", type: "Time", "default": "25s", range: "N/A" }
        ]
    },
    {
        category: "Role", name: "Undertaker", team: "Impostor",
        description: "The Undertaker is an Impostor that can drag and drop bodies.",
        abilities: [{ name: "Drag Body", icon: 'TownOfUs.Resources.ImpButtons.DragButton.png', description: "Drags and drops bodies." }],
        icon: 'Undertaker',
        types: ["Utility"],
        options: [
            { name: "Undertaker", description: "The percentage probability of the Undertaker appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Undertaker Drag Cooldown", description: "The cooldown of the Undertaker Drag ability", type: "Time", "default": "25s", range: "N/A" },
            { name: "Undertaker Speed While Dragging", description: "How fast the Undertaker moves while dragging a body in comparison to normal", type: "Multiplier", "default": "0.75x", range: "N/A" },
            { name: "Undertaker can Vent", description: "Whether the Undertaker can Vent", type: "Toggle", "default": "False", range: "N/A" },
            { name: "Undertaker can Vent while Dragging", description: "Whether the Undertaker can Vent when they are Dragging a Body", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    // Crewmate Modifiers
    {
        category: "Modifier", name: "Aftermath", team: "Crewmate Modifier",
        description: "Killing the Aftermath forces their killer to use their ability (if they have one and it's not in use).",
        abilities: [{ name: "Force your Killer to Use Ability", icon: 'TownOfUs.Resources.ModifierIcons.AfterMath.png', description: "Forces killer to use their ability upon death." }],
        icon: 'Aftermath',
        types: ["Passive", "Death Trigger"],
        options: [
            { name: "Aftermath", description: "The percentage probability of the Aftermath appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Bait", team: "Crewmate Modifier",
        description: "Killing the Bait makes the killer auto self-report.",
        abilities: [{ name: "Forces Your Killer to Report", icon: 'TownOfUs.Resources.ModifierIcons.Bait.png', description: "Forces killer to auto self-report upon death." }],
        icon: 'Bait',
        types: ["Passive", "Death Trigger"],
        options: [
            { name: "Bait", description: "The percentage probability of the Bait appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Bait Minimum Delay", description: "The minimum time the killer of the Bait reports the body", type: "Time", "default": "0s", range: "0s - 10s" },
            { name: "Bait Maximum Delay", description: "The maximum time the killer of the Bait reports the body", type: "Time", "default": "1s", range: "0s - 10s" }
        ]
    },
    {
        category: "Modifier", name: "Celebrity", team: "Crewmate Modifier",
        description: "The Celebrity announces how, when and where they died the meeting after they die.",
        abilities: [{ name: "Lets Everyone Know when and where you Died", icon: 'TownOfUs.Resources.ModifierIcons.Celebrity.png', description: "Announces death details to everyone after dying." }],
        icon: 'Celebrity',
        types: ["Passive", "Death Trigger", "Information"],
        options: [
            { name: "Celebrity", description: "The percentage probability of the Celebrity appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Diseased", team: "Crewmate Modifier",
        description: "Killing the Diseased increases the killer's kill cooldown.",
        abilities: [{ name: "Forces your Killer to have longer Cooldown", icon: 'TownOfUs.Resources.ModifierIcons.Diseased.png', description: "Increases killer's cooldown upon death." }],
        icon: 'Diseased',
        types: ["Passive", "Death Trigger", "Debuff"],
        options: [
            { name: "Diseased", description: "The percentage probability of the Diseased appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Kill Multiplier", description: "How much the Kill Cooldown of the Impostor is increased by", type: "Multiplier", "default": "3x", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Frosty", team: "Crewmate Modifier",
        description: "Killing the Frosty slows the killer for a short duration.",
        abilities: [{ name: "Forces your Killer to Go Slower", icon: 'TownOfUs.Resources.ModifierIcons.Frosty.png', description: "Slows the killer for a short duration upon death." }],
        icon: 'Frosty',
        types: ["Passive", "Death Trigger", "Debuff"],
        options: [
            { name: "Frosty", description: "The percentage probability of the Frosty appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Chill Duration", description: "The duration of the chill after killing the Frosty", type: "Time", "default": "10s", range: "N/A" },
            { name: "Chill Start Speed", description: "The start speed of the chill after killing the Frosty", type: "Multiplier", "default": "0.75x", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Multitasker", team: "Crewmate Modifier",
        description: "The Multitasker's tasks are transparent.",
        abilities: [{ name: "Allows you to See through Task", icon: 'TownOfUs.Resources.ModifierIcons.Multitasker.png', description: "Makes tasks transparent for easier visibility." }],
        icon: 'Multitasker',
        types: ["Passive", "Utility"],
        options: [
            { name: "Multitasker", description: "The percentage probability of the Multitasker appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Taskmaster", team: "Crewmate Modifier",
        description: "The Taskmaster completes a random task on the completion of each meeting.",
        abilities: [{ name: "Allows you to complete Tasks Faster", icon: 'TownOfUs.Resources.ModifierIcons.TaskMaster.png', description: "Completes a random task after each meeting." }],
        icon: 'Taskmaster',
        types: ["Passive", "Utility"],
        options: [
            { name: "Taskmaster", description: "The percentage probability of the Taskmaster appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Torch", team: "Crewmate Modifier",
        description: "The Torch's vision doesn't get reduced when the lights are sabotaged.",
        abilities: [{ name: "Allows you to see more", icon: 'TownOfUs.Resources.ModifierIcons.Torch.png', description: "Maintains full vision during light sabotages." }],
        icon: 'Torch',
        types: ["Passive", "Utility"],
        options: [
            { name: "Torch", description: "The percentage probability of the Torch appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    // Crewmate Postmortem Modifiers
    {
        category: "Modifier", name: "Noisemaker", team: "Crewmate Modifier",
        description: "After your death, you will show a red body indicator to everyone on the map.",
        abilities: [{ name: "Show Red Body Indicator", icon: 'TownOfUs.Resources.ModifierIcons.Noisemaker.png', description: "Shows a red body indicator to everyone after death." }],
        icon: 'Noisemaker',
        types: ["Passive", "Postmortem", "Detection"],
        options: [
            { name: "Noisemaker", description: "The percentage probability of the Noisemaker appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Operative", team: "Crewmate Modifier",
        description: "Use cameras at anytime, anywhere with a limited battery charge.",
        abilities: [{ name: "Portable Cameras", icon: 'TownOfUs.Resources.CamButton.png', description: "Accesses cameras anytime, anywhere with limited battery." }],
        icon: 'Operative',
        types: ["Active", "Postmortem", "Utility"],
        options: [
            { name: "Operative", description: "The percentage probability of the Operative appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Rotting", team: "Crewmate Modifier",
        description: "After a set amount of time, your body will rot away, preventing you from being reported",
        abilities: [{ name: "Body Rot", icon: 'TownOfUs.Resources.ModifierIcons.Rotting.png', description: "Body rots away after time, preventing reports." }],
        icon: 'Rotting',
        types: ["Passive", "Postmortem", "Utility"],
        options: [
            { name: "Rotting", description: "The percentage probability of the Rotting appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Scientist", team: "Crewmate Modifier",
        description: "Access Vitals anytime, anywhere with a limited battery charge.",
        abilities: [{ name: "Portable Vitals", icon: 'TownOfUs.Resources.VitalsButton.png', description: "Accesses vitals anytime, anywhere with limited battery." }],
        icon: 'Scientist',
        types: ["Active", "Postmortem", "Utility"],
        options: [
            { name: "Scientist", description: "The percentage probability of the Scientist appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Scout", team: "Crewmate Modifier",
        description: "While you can see twice as far as a regular Crewmate, your vision falters when lights are off.",
        abilities: [{ name: "Enhanced Vision", icon: 'TownOfUs.Resources.ModifierIcons.Scout.png', description: "Has enhanced vision but falters when lights are off." }],
        icon: 'Scout',
        types: ["Passive", "Postmortem", "Detection"],
        options: [
            { name: "Scout", description: "The percentage probability of the Scout appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    // Global Modifiers
    {
        category: "Modifier", name: "Button Barry", team: "Global Modifier",
        description: "Button Barry has the ability to call a meeting from anywhere on the map, even during sabotages. They have the same amount of meetings as a regular player.",
        abilities: [{ name: "Portable Button", icon: 'TownOfUs.Resources.BarryButton.png', description: "Calls a meeting from anywhere, even during sabotages." }],
        icon: 'ButtonBarry',
        types: ["Passive", "Utility"],
        options: [
            { name: "Button Barry", description: "The percentage probability of Button Barry appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Flash", team: "Global Modifier",
        description: "The Flash travels at a faster speed in comparison to a normal player.",
        abilities: [{ name: "Go Faster", icon: 'TownOfUs.Resources.ModifierIcons.Flash.png', description: "Moves at a faster speed." }],
        icon: 'Flash',
        types: ["Passive", "Buff"],
        options: [
            { name: "Flash", description: "The percentage probability of the Flash appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Speed", description: "How fast the Flash moves in comparison to normal", type: "Multiplier", "default": "1.25x", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Giant", team: "Global Modifier",
        description: "The Giant is a gigantic Crewmate, that has a decreased walk speed.",
        abilities: [{ name: "Be Bigger and Slower", icon: 'TownOfUs.Resources.ModifierIcons.Giant.png', description: "Is larger and moves slower." }],
        icon: 'Giant',
        types: ["Passive", "Buff"],
        options: [
            { name: "Giant", description: "The percentage probability of the Giant appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Speed", description: "How fast the Giant moves in comparison to normal", type: "Multiplier", "default": "0.75x", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Immovable", team: "Global Modifier",
        description: "The Immovable cannot be moved by meetings, transports and disperse.",
        abilities: [{ name: "Stay in the same spot", icon: 'TownOfUs.Resources.ModifierIcons.Immovable.png', description: "Cannot be moved by meetings, transports, or disperse." }],
        icon: 'Immovable',
        types: ["Passive", "Defense"],
        options: [
            { name: "Immovable", description: "The percentage probability of the Immovable appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Lovers", team: "Global Modifier",
        description: "The Lovers are two players who are linked together. These two players get picked randomly between Crewmates and Impostors. They gain the primary objective to stay alive together. If they are both among the last 3 players, they win. In order to do so, they gain access to a private chat, only visible by them in between meetings. However, they can also win with their respective team, hence why the Lovers do not know the role of the other lover.",
        abilities: [{ name: "Win with Lover", icon: 'TownOfUs.Resources.ModifierIcons.Lover.png', description: "Wins if both Lovers survive and are among the last 3 players." }],
        icon: 'Lover',
        types: ["Passive", "Social", "Win Condition"],
        options: [
            { name: "Lovers", description: "The percentage probability of the Lovers appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Both Lovers Die", description: "Whether the other Lover automatically dies if the other does", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Loving Impostor Probability", description: "The chances of one lover being an Impostor", type: "Percentage", "default": "20%", range: "N/A" },
            { name: "Neutral Roles Can Be Lovers", description: "Whether a Lover can be a Neutral Role", type: "Toggle", "default": "True", range: "N/A" },
            { name: "Impostor Lover Can Kill Teammate", description: "Whether an Impostor Lover can kill another Impostor", type: "Toggle", "default": "False", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Mini", team: "Global Modifier",
        description: "The Mini is a tiny Crewmate.",
        abilities: [{ name: "Be Smaller and Faster", icon: 'TownOfUs.Resources.ModifierIcons.Mini.png', description: "Is smaller and moves faster." }],
        icon: 'Mini',
        types: ["Passive", "Debuff"],
        options: [
            { name: "Mini", description: "The percentage probability of the Mini appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Radar", team: "Global Modifier",
        description: "The Radar is a Crewmate who knows where the closest player is to them.",
        abilities: [{ name: "See Closest Player", icon: 'TownOfUs.Resources.ModifierIcons.Radar.png', description: "Knows the location of the closest player." }],
        icon: 'Radar',
        types: ["Passive", "Detection"],
        options: [
            { name: "Radar", description: "The percentage probability of the Radar appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Satellite", team: "Global Modifier",
        description: "The Satellite has a 1 time use ability to detect all dead bodies.",
        abilities: [{ name: "Detect Dead Bodies", icon: 'TownOfUs.Resources.BroadcastButton.png', description: "Detects all dead bodies once per game." }],
        icon: 'Satellite',
        types: ["Active", "Detection"],
        options: [
            { name: "Satellite", description: "The percentage probability of the Satellite appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Broadcast Duration", description: "The duration of the broadcast arrows", type: "Time", "default": "10s", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Shy", team: "Global Modifier",
        description: "The Shy becomes transparent when standing still for a short duration.",
        abilities: [{ name: "Go Invisible", icon: 'TownOfUs.Resources.ModifierIcons.Shy.png', description: "Becomes transparent when standing still for a short duration." }],
        icon: 'Shy',
        types: ["Passive", "Utility"],
        options: [
            { name: "Shy", description: "The percentage probability of the Shy appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Transparency Delay", description: "The delay until the Shy starts turning transparent", type: "Time", "default": "5s", range: "N/A" },
            { name: "Turn Transparent Duration", description: "The duration of the Shy turning transparent", type: "Time", "default": "5s", range: "N/A" },
            { name: "Final Opacity", description: "The final opacity level of the Shy", type: "Percentage", "default": "20%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Sixth Sense", team: "Global Modifier",
        description: "The Sixth Sense is a Crewmate who can see who interacts with them.",
        abilities: [{ name: "Know who interacts w/ you", icon: 'TownOfUs.Resources.ModifierIcons.SixthSense.png', description: "Knows who interacts with them." }],
        icon: 'SixthSense',
        types: ["Passive", "Detection"],
        options: [
            { name: "Sixth Sense", description: "The percentage probability of the Sixth Sense appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Sleuth", team: "Global Modifier",
        description: "The Sleuth is a Crewmate who gains knowledge from reporting dead bodies. During meetings the Sleuth can see the roles of all players in which they've reported.",
        abilities: [{ name: "Know Bodies's Role", icon: 'TownOfUs.Resources.ModifierIcons.Sleuth.png', description: "Gains knowledge and sees roles of reported players." }],
        icon: 'Sleuth',
        types: ["Passive", "Detection"],
        options: [
            { name: "Sleuth", description: "The percentage probability of the Sleuth appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Tiebreaker", team: "Global Modifier",
        description: "If any vote is a draw, the Tiebreaker's vote will go through. If they voted another player, they will get voted out.",
        abilities: [{ name: "Break Tie Vote", icon: 'TownOfUs.Resources.ModifierIcons.Tiebreaker.png', description: "Breaks tie votes, making their vote count in a draw." }],
        icon: 'Tiebreaker',
        types: ["Active", "Utility"],
        options: [
            { name: "Tiebreaker", description: "The percentage probability of the Tiebreaker appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    // Crewmate Alliance Modifiers
    {
        category: "Modifier", name: "Egotist", team: "Crewmate Alliance modifier",
        description: "As the Egotist, you can only win if Crewmates lose, but you can still win even in death. If no Crewmates remain after a meeting ends, you will leave in victory, but the game will continue. Egotist Snitch and Mayor also reveal themselves as evil to Neutrals and Impostors alike, and they do not get punished when killing Crewmates.",
        abilities: [{ name: "Betray", icon: 'TownOfUs.Resources.ModifierIcons.Egotist.png', description: "Wins if Crewmates lose, even in death. Reveals as evil." }],
        icon: 'Egotist',
        types: ["Passive", "Win Condition", "Information"],
        options: [
            { name: "Egotist", description: "The percentage probability of the Egotist appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    // Impostor Modifiers
    {
        category: "Modifier", name: "Disperser", team: "Impostor Modifier",
        description: "The Disperser is an Impostor who has a 1 time use ability to send all players to a random vent. This includes miner vents. Does not appear on Airship or Submerged.",
        abilities: [{ name: "Disperse Players", icon: 'TownOfUs.Resources.DisperseButton.png', description: "Sends all players to a random vent (1-time use)." }],
        icon: 'Disperser',
        types: ["Active", "Sabotage"],
        options: [
            { name: "Disperser", description: "The percentage probability of the Disperser appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Double Shot", team: "Impostor Modifier",
        description: "Double Shot is an Impostor who gets an extra life when assassinating. Once they use their life they are indicated with a red flash and can no longer guess the person who they guessed wrong for the remainder of that meeting.",
        abilities: [{ name: "Guess twice", icon: 'TownOfUs.Resources.Guess.png', description: "Gets an extra life when assassinating." }],
        icon: 'DoubleShot',
        types: ["Passive", "Kill", "Defense"],
        options: [
            { name: "Double Shot", description: "The percentage probability of Double Shot appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Saboteur", team: "Impostor Modifier",
        description: "The Saboteur is an Impostor with a passive sabotage cooldown reduction.",
        abilities: [{ name: "Reduce Sabotage Cooldown", icon: 'TownOfUs.Resources.ModifierIcons.Saboteur.png', description: "Passively reduces sabotage cooldowns." }],
        icon: 'Saboteur',
        types: ["Passive", "Sabotage"],
        options: [
            { name: "Saboteur", description: "The percentage probability of the Saboteur appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Reduced Sabotage Bonus", description: "The amount of time removed from the Saboteur's sabotage cooldowns", type: "Time", "default": "10s", range: "N/A" }
        ]
    },
    {
        category: "Modifier", name: "Underdog", team: "Impostor Modifier",
        description: "The Underdog is an Impostor with a prolonged kill cooldown. When they are the only remaining Impostor, they will have their kill cooldown shortened.",
        abilities: [{ name: "Less Kill Cooldown Solo", icon: 'TownOfUs.Resources.ModifierIcons.Underdog.png', description: "Has prolonged kill cooldown, shortened when solo Impostor." }],
        icon: 'Underdog',
        types: ["Passive", "Kill", "Buff"],
        options: [
            { name: "Underdog", description: "The percentage probability of the Underdog appearing", type: "Percentage", "default": "0%", range: "N/A" },
            { name: "Kill Cooldown Bonus", description: "The amount of time added or removed from the Underdog's Kill Cooldown", type: "Time", "default": "5s", range: "N/A" },
            { name: "Increased Kill Cooldown", description: "Whether the Underdog's Kill Cooldown is Increased when 2+ Imps are alive", type: "Toggle", "default": "True", range: "N/A" }
        ]
    },
    // Impostor Postmortem Modifiers
    {
        category: "Modifier", name: "Telepath", team: "Impostor Modifier",
        description: "Know when your teammate kills (maybe where depending on settings), and depending on other settings, know when and/or where they die.",
        abilities: [{ name: "Teammate Info", icon: 'TownOfUs.Resources.ModifierIcons.Telepath.png', description: "Knows when and where teammates kill or die." }],
        icon: 'Telepath',
        types: ["Passive", "Postmortem", "Information"],
        options: [
            { name: "Telepath", description: "The percentage probability of the Telepath appearing", type: "Percentage", "default": "0%", range: "N/A" }
        ]
    }
];


// This object will map role/modifier names to their colors for text highlighting
const entityNamesAndColors = [];
const allValidEntityNamesSet = new Set();

// Populate allValidEntityNamesSet and entityNamesAndColors after allEntitiesData is defined
allEntitiesData.forEach(e => {
    allValidEntityNamesSet.add(e.name);
    if (e.name.startsWith("The ")) {
        allValidEntityNamesSet.add(e.name.substring(4));
    }
    // Add specific cases for robustness
    if (e.name === "Double Shot") allValidEntityNamesSet.add("Double Shot");
    if (e.name === "Button Barry") allValidEntityNamesSet.add("Button Barry");

    const color = e.category === 'Role' ? roleColors[e.name] : modifierColors[e.name];
    if (color) {
        entityNamesAndColors.push({ name: e.name, color: color });
    }
});

const entityNamesForColorizing = entityNamesAndColors.filter(entity => {
    const isGenericTeamName = ["Crewmate", "Impostor", "Neutral"].includes(entity.name);
    return !isGenericTeamName;
});

entityNamesForColorizing.sort((a, b) => b.name.length - a.name.length);

function colorizeRoleNamesInText(text) {
    if (text === null || text === undefined) return '';
    let coloredText = text;
    for (const entity of entityNamesForColorizing) {
        const escapedName = entity.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedName}\\b`, 'gi');
        coloredText = coloredText.replace(regex, (match) => {
            if (match.includes('<span style=')) {
                return match;
            }
            return `<span style="color: ${entity.color}; font-family: 'Amatic SC', cursive; font-weight: 700;">${match}</span>`;
        });
    }
    return coloredText;
}

/**
 * Generates the URL for a role icon.
 * Assumes role icons are named like 'Aurial.png' and located in 'img/roles/'.
 * @param {string} iconName - The base name of the role icon (e.g., 'Aurial').
 * @returns {string} The full URL to the role icon.
 */
function getRoleImageUrl(iconName) {
    // Make sure your role images are in the 'img/roles/' folder and named like 'Aurial.png'
    return `Media/TownOfUs.Resources.RoleIcons.${iconName}.png`;
}

/**
 * Generates the URL for a modifier icon.
 * Assumes modifier icons are named like 'Telepath.png' and located in 'img/modifiers/'.
 * @param {string} iconName - The base name of the modifier icon (e.g., 'Telepath').
 * @returns {string} The full URL to the modifier icon.
 */
function getModifierImageUrl(iconName) {
    // Make sure your modifier images are in the 'img/modifiers/' folder and named like 'Telepath.png'
    return `Media/TownOfUs.Resources.ModifierIcons.${iconName}.png`;
}

function getAbilityImageUrl(abilitiesIconName) {
    return `Media/${abilitiesIconName}`; // Assuming Ability Icons are like this
}


// --- Main Script Execution - Ensures DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    // Get elements for the Role Wiki
    const roleWikiCardGrid = document.getElementById('card-grid');
    const searchInput = document.getElementById('search-input');
    const combinedFilterSelect = document.getElementById('combined-filter-select');

    // Get modal elements
    const detailModalOverlay = document.getElementById('detail-modal-overlay');
    const modalCloseButton = document.getElementById('modal-close-button');
    const detailModalContent = document.getElementById('detail-modal-content'); // Changed from modalContent
    const modalIcon = document.getElementById('modal-icon');
    const modalName = document.getElementById('modal-name');
    const modalTeam = document.getElementById('modal-team');
    const modalDescription = document.getElementById('modal-description');
    const modalAbilityTableContainer = document.getElementById('modal-ability-table-container');
    const modalAbilityTableBody = document.getElementById('modal-ability-table-body');

    // NEW: Get the table container and tbody elements for Game Options
    const modalSettingsSection = document.getElementById('modal-settings-section'); // The H3 title
    const modalOptionsTableContainer = document.getElementById('modal-options-table-container');
    const modalOptionsTableBody = document.getElementById('modal-options-table-body');
    // Get player roles elements
    const playerRolesList = document.getElementById('playerRolesList');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const saveRolesBtn = document.getElementById('saveRolesBtn');
    const clearRolesBtn = document.getElementById('clearRolesBtn');

    // Get general notes elements
    const generalNotesTextarea = document.getElementById('generalNotesTextarea');
    const saveGeneralNotesBtn = document.getElementById('saveGeneralNotesBtn');

    // Get tab elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');


     // --- Functions for Detail Modal ---

/**
 * Populates the detail modal with data for a given entity (role or modifier)
 * and displays the modal.
 * @param {object} entity - The entity object containing name, description, team, abilities, options, etc.
 */
function populateDetailModal(entity) {
    // Ensure all necessary elements are found before proceeding
    const detailModalOverlay = document.getElementById('detail-modal-overlay');
    const detailModalContent = document.getElementById('detail-modal-content');
    const modalName = document.getElementById('modal-name');
    const modalTeam = document.getElementById('modal-team');
    const modalIcon = document.getElementById('modal-icon');
    const modalDescription = document.getElementById('modal-description');
    const modalAbilityTableContainer = document.getElementById('modal-ability-table-container');
    const modalAbilityTableBody = document.getElementById('modal-ability-table-body');
    const modalSettingsSection = document.getElementById('modal-settings-section'); // The H3 title for Options
    const modalOptionsTableContainer = document.getElementById('modal-options-table-container'); // Container for options table
    const modalOptionsTableBody = document.getElementById('modal-options-table-body'); // The tbody for options
    const abilitiesSectionTitle = document.getElementById('abilitiesSectionTitle'); // <--- ADD THIS LINE

    if (!entity || !detailModalOverlay || !detailModalContent || !modalName || !modalTeam || !modalIcon || !modalDescription || !modalAbilityTableContainer || !modalAbilityTableBody || !modalSettingsSection || !modalOptionsTableContainer || !modalOptionsTableBody) {
        console.error("One or more required modal elements not found or entity data is missing.");
        return; // Exit if essential elements are missing or entity data is bad
    }
const dynamicHeaderColor = roleColors[entity.name] || teamColorStyle;

    // Apply color to section titles
    if (abilitiesSectionTitle) {
        abilitiesSectionTitle.style.color = dynamicHeaderColor;
    }
    if (modalSettingsSection) { // This element is already captured as modalSettingsSection
        modalSettingsSection.style.color = dynamicHeaderColor;
    }

    // Apply color to Abilities table headers
    if (modalAbilityTableContainer) {
        const abilityHeaders = modalAbilityTableContainer.querySelectorAll('th');
        abilityHeaders.forEach(th => {
            th.style.color = dynamicHeaderColor;
        });
    }

    // Apply color to Options table headers
    if (modalOptionsTableContainer) {
        const optionHeaders = modalOptionsTableContainer.querySelectorAll('th');
        optionHeaders.forEach(th => {
            th.style.color = dynamicHeaderColor;
        });
    }

    // Determine unique color for the entity (Role or Modifier) based on its name
    const uniqueColor = roleColors[entity.name] || modifierColors[entity.name] || '#7e22ce'; // Default purple
    modalAbilityTableContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    // Set Role Name and Color (Amatic SC font)
    modalName.textContent = entity.name;
    modalName.style.color = uniqueColor;
    modalName.style.fontSize = '8vh';
    // Ensure the Amatic SC font class is on the HTML element.
    // We add it here in JS too for robustness, though it's better on HTML directly for static parts.
    if (!modalName.classList.contains('font-[Amatic_SC]')) {
        modalName.classList.add('font-[Amatic_SC]');
    }

    // Set Team and Style
    const teamStyle = teamColors[entity.team] || { dotColor: '#00FFFF', boxBg: 'rgba(0, 255, 255, 0.2)', boxShadow: '0 0 8px #00ffff' };
    modalTeam.innerHTML = `
        <span class="team-display-box" style="
            background-color: ${teamStyle.boxBg};
            box-shadow: ${teamStyle.boxShadow};
            color: ${teamStyle.dotColor};
            border: 1px solid ${teamStyle.dotColor};
        ">
            TEAM: ${entity.team.toUpperCase()}
        </span>
    `;

    // Set Icon and Glow
    const mainIconPath = entity.category === 'Role' ? getRoleImageUrl(entity.icon) : getModifierImageUrl(entity.icon);
    modalIcon.src = mainIconPath;
    modalIcon.alt = `${entity.name} Icon`;
    modalIcon.style.filter = `drop-shadow(0 0 10px ${uniqueColor})`;

    // Set Description (colorized)
    modalDescription.innerHTML = typeof colorizeRoleNamesInText === 'function' ? colorizeRoleNamesInText(entity.description) : entity.description;
    modalDescription.style.borderLeftColor = uniqueColor;


    // --- Abilities Section (using a table, handling multiple abilities) ---
     // ... (inside populateDetailModal function in script.js)

// --- Abilities Section (using a table) ---
modalAbilityTableBody.innerHTML = ''; // Clear previous content
// Use the new 'abilities' array directly
const abilities = Array.isArray(entity.abilities) ? entity.abilities : [];

if (abilities.length > 0) {
    modalAbilityTableContainer.style.display = 'block'; // Show the table container

    abilities.forEach(ability => { // Loop directly over each ability object
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-800');

        // Icon Cell
        const iconCell = document.createElement('td');
        iconCell.classList.add('py-2', 'px-1', 'md:px-2', 'align-top');
        const abilityIconImg = document.createElement('img');
        // Use ability.icon (which should be the full path like 'TownOfUs.Resources.CrewButtons.InspectButton.png')
        abilityIconImg.src = getAbilityImageUrl(ability.icon); // Assuming ability.icon is already a full path
        abilityIconImg.alt = `${ability.name} Icon`;
        abilityIconImg.classList.add('w-16', 'h-16', 'object-contain', 'flex-shrink-0');
        // If you had a glow effect, re-add it here based on uniqueColor
        // abilityIconImg.style.filter = `drop-shadow(0 0 6px ${uniqueColor})`;
        abilityIconImg.onerror = function() { this.onerror=null; this.src='placeholder.png'; }; // Fallback image on error
        iconCell.appendChild(abilityIconImg);
        row.appendChild(iconCell);
        // Ability Name Cell
        const nameCell = document.createElement('td');
        nameCell.classList.add('py-2', 'px-1', 'md:px-2', 'text-lg', 'font-semibold', 'align-top', 'font-[Amatic_SC]');
        // Use ability.name
        nameCell.textContent = ability.name;
        nameCell.style.color = uniqueColor; // Apply unique color to ability name
        row.appendChild(nameCell);

        // Ability Description Cell
        const descriptionCell = document.createElement('td');
        descriptionCell.classList.add('py-2', 'px-1', 'md:px-2', 'text-sm', 'text-gray-400', 'align-top');
        // Use ability.description
        descriptionCell.textContent = ability.description;
        row.appendChild(descriptionCell);

        modalAbilityTableBody.appendChild(row);
    });
} else {
    modalAbilityTableContainer.style.display = 'none'; // Hide container if no ability data
}

// ... (rest of your populateDetailModal function)
modalOptionsTableContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    // --- Options Section (using a table) ---
    modalOptionsTableBody.innerHTML = ''; // Clear previous content
    if (entity.options && entity.options.length > 0) {
        modalSettingsSection.style.display = 'block'; // Show options title
        modalOptionsTableContainer.style.display = 'block'; // Show options table container

        entity.options.sort((a, b) => a.name.localeCompare(b.name)).forEach(option => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-gray-800');

            // Option Name: Apply Amatic SC font
            const nameCell = document.createElement('td');
            nameCell.classList.add('py-2', 'px-1', 'md:px-2', 'font-semibold', 'text-gray-300', 'align-top');
            nameCell.classList.add('font-[Amatic_SC]'); // Apply Amatic SC font to option names
            nameCell.textContent = option.name;
            row.appendChild(nameCell);

            // Default Value
            const defaultCell = document.createElement('td');
            defaultCell.classList.add('py-2', 'px-1', 'md:px-2', 'text-gray-400', 'align-top');
            defaultCell.textContent = option.default;
            row.appendChild(defaultCell);

            // Type
            const typeCell = document.createElement('td');
            typeCell.classList.add('py-2', 'px-1', 'md:px-2', 'text-gray-400', 'align-top');
            typeCell.textContent = `(${option.type})`;
            row.appendChild(typeCell);

            // Range
            const rangeCell = document.createElement('td');
            rangeCell.classList.add('py-2', 'px-1', 'md:px-2', 'text-gray-400', 'align-top');
            rangeCell.textContent = option.range && option.range !== 'N/A' ? `[${option.range}]` : '';
            row.appendChild(rangeCell);

            modalOptionsTableBody.appendChild(row);
        });
    } else {
        modalSettingsSection.style.display = 'none';
        modalOptionsTableContainer.style.display = 'none';
    }

    // Apply dynamic styles to the modal content box itself
    detailModalContent.style.boxShadow = `0 0 20px ${uniqueColor + '60'}`;
    detailModalContent.style.border = `2px solid ${uniqueColor}`;

    // Set CSS variables for the scrollbar colors
    detailModalContent.style.setProperty('--modal-scrollbar-thumb-color', uniqueColor);
    detailModalContent.style.setProperty('--modal-scrollbar-track-color', `${uniqueColor}20`); // 20% opacity of uniqueColor

    // Show the modal using 'active' class and prevent body scroll
    detailModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the detail modal and restores body scrolling.
 */
function closeDetailModal() {
    const detailModalOverlay = document.getElementById('detail-modal-overlay');
    if (detailModalOverlay) {
        detailModalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scrolling
    }
}


    // --- Event Listeners for Detail Modal ---

    // Close button click
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeDetailModal);
    }

    // Close when clicking outside the modal content (on the overlay itself)
    if (detailModalOverlay) {
        detailModalOverlay.addEventListener('click', (event) => {
            if (event.target === detailModalOverlay) {
                closeDetailModal();
            }
        });
    }

    
    /**
     * Creates and returns a new player entry DOM element.
     * @param {string} playerName - Initial player name.
     * @param {string} role - Initial role.
     * @returns {HTMLElement} The created player entry div.
     */
    function createPlayerEntry(playerName = '', role = '') {
        const playerEntryDiv = document.createElement('div');
        playerEntryDiv.className = 'player-entry';

        const uniqueColorInitial = roleColors[role] || modifierColors[role] || '#7e22ce';

        const initialImageUrl = (allEntitiesData.find(e => e.name === role) || {}).icon
            ? (allEntitiesData.find(e => e.name === role).category === 'Role' ? getRoleImageUrl(role) : getModifierImageUrl(role))
            : 'placeholder.png';

        playerEntryDiv.innerHTML = `
            <input type="text" placeholder="Player Name" value="${playerName}" class="player-name-input">
            <input type="text" placeholder="Role (e.g., Impostor)" value="${role}" class="role-input" style="color: ${uniqueColorInitial};">
            <img class="role-icon-small" src="${initialImageUrl}" alt="${role || 'Unknown Role'} Icon" onerror="this.onerror=null;this.src='placeholder.png';">
            <button class="remove-player-btn">Remove</button>
        `;

        const playerNameInput = playerEntryDiv.querySelector('.player-name-input');
        const roleInput = playerEntryDiv.querySelector('.role-input');
        const roleIconImg = playerEntryDiv.querySelector('.role-icon-small');
        const removeBtn = playerEntryDiv.querySelector('.remove-player-btn');

        if (playerNameInput && roleInput) {
        playerNameInput.addEventListener('input', () => {
            // Check if the input value contains " is " (case-insensitive)
            if (playerNameInput.value.toLowerCase().includes(' is ')) {
                roleInput.focus(); // Shift focus to the role dropdown
                // Optional: Remove " is " from the textbox after focusing, or keep it.
                 playerNameInput.value = playerNameInput.value.replace(/ is /gi, '').trim();
            }
        });
    }

        const updatePlayerRoleIconAndStyles = async () => {
            const rawRoleName = roleInput.value.trim();
            let entityForDisplay = null;

            entityForDisplay = allEntitiesData.find(entity =>
                entity.name.toLowerCase() === rawRoleName.toLowerCase()
            );

            if (!entityForDisplay && rawRoleName) {
                entityForDisplay = allEntitiesData.find(entity =>
                    entity.icon && entity.icon.toLowerCase() === rawRoleName.toLowerCase().replace(/\s/g, '')
                );
            }

            let newUniqueColor = '#7e22ce'; // Default
            let newIconFilename = 'placeholder.png';

            if (entityForDisplay) {
                newUniqueColor = roleColors[entityForDisplay.name] || modifierColors[entityForDisplay.name] || teamColors[entityForDisplay.team].dotColor || newUniqueColor;

                if (entityForDisplay.category === 'Role') {
                    newIconFilename = getRoleImageUrl(entityForDisplay.icon);
                } else if (entityForDisplay.category === 'Modifier') {
                    newIconFilename = getModifierImageUrl(entityForDisplay.icon);
                }
            }

            roleIconImg.src = newIconFilename;
            roleIconImg.alt = `${entityForDisplay?.name || rawRoleName || 'Unknown Role'} Icon`;

            roleIconImg.style.dropShadow = `0 0 10px ${newUniqueColor}, 0 0 25px ${newUniqueColor}66`;
            roleIconImg.style.transition = 'box-shadow 0.3s ease-in-out';

            roleInput.style.color = newUniqueColor;
            roleInput.style.borderBottomColor = newUniqueColor;

            playerEntryDiv.style.borderColor = newUniqueColor;
            playerEntryDiv.style.backgroundColor = `${newUniqueColor}10`;
            playerEntryDiv.style.filter = `drop-shadow(0 0 6px ${newUniqueColor})`;

            playerEntryDiv.onmouseenter = () => {
                playerEntryDiv.style.boxShadow = `0 0 30px ${newUniqueColor}AA, 0 0 40px ${newUniqueColor}88`;
                playerEntryDiv.style.transform = 'translateY(-3px)';
                playerEntryDiv.style.transition = 'box-shadow 0.2s ease-out, transform 0.2s ease-out';
            };
            playerEntryDiv.onmouseleave = () => {
                playerEntryDiv.style.boxShadow = `0 0 20px ${newUniqueColor}80`;
                playerEntryDiv.style.transform = 'translateY(0)';
            };

            if (!entityForDisplay) {
                roleIconImg.style.boxShadow = '';
                playerEntryDiv.style.backgroundColor = '';
                playerEntryDiv.style.borderColor = '';
                playerEntryDiv.style.boxShadow = '';
                playerEntryDiv.onmouseenter = null;
                playerEntryDiv.onmouseleave = null;
                roleInput.style.color = '';
                roleInput.style.borderBottomColor = '';
            }
        };

        roleInput.addEventListener('input', () => {
            updatePlayerRoleIconAndStyles(); 
            savePlayerRoles();
        });

        playerNameInput.addEventListener('input', savePlayerRoles);

        if(removeBtn) {
        removeBtn.addEventListener('click', () => {
    playerEntryDiv.remove();
    });
    }
    // Add remove button functionality

        updatePlayerRoleIconAndStyles(); // Call immediately on creation
        return playerEntryDiv;
    }

    /**
     * Saves all current player role entries to localStorage.
     */
    function savePlayerRoles() {
        const playerEntries = [];
        document.querySelectorAll('#playerRolesList .player-entry').forEach(entry => {
            const playerName = entry.querySelector('.player-name-input').value;
            const role = entry.querySelector('.role-input').value;
            playerEntries.push({
                playerName,
                role
            });
        });
        localStorage.setItem('amongUsCompanionRoles', JSON.stringify(playerEntries));
    }

    /**
     * Loads player role entries from localStorage and populates the list.
     */
    function loadPlayerRoles() {
        if (!playerRolesList) return; // Guard against missing element
        playerRolesList.innerHTML = '';
        const savedRoles = localStorage.getItem('amongUsCompanionRoles');
        if (savedRoles) {
            try {
                const roles = JSON.parse(savedRoles);
                if (roles.length > 0) {
                    roles.forEach(player => {
                        playerRolesList.appendChild(createPlayerEntry(player.playerName, player.role));
                    });
                } else {
                    playerRolesList.appendChild(createPlayerEntry());
                }
            } catch (e) {
                console.error("Error parsing saved roles:", e);
                localStorage.removeItem('amongUsCompanionRoles');
                playerRolesList.appendChild(createPlayerEntry());
            }
        } else {
            playerRolesList.appendChild(createPlayerEntry());
        }
    }

    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            playerRolesList.appendChild(createPlayerEntry());
            playerRolesList.lastElementChild.querySelector('.player-name-input')?.focus(); // Safe focus
            savePlayerRoles();
        });
    }

    


  // Clear Roles functionality
  document.getElementById('clearRolesBtn').addEventListener('click', () => {
    document.getElementById('playerRolesList').innerHTML = '';
  });

    // --- General Notes Tab Logic ---
    function saveGeneralNotes() {
        if (generalNotesTextarea) {
            localStorage.setItem('amongUsCompanionGeneralNotes', generalNotesTextarea.value);
        }
    }

    function loadGeneralNotes() {
        if (generalNotesTextarea) {
            generalNotesTextarea.value = localStorage.getItem('amongUsCompanionGeneralNotes') || '';
        }
    }

    if (saveGeneralNotesBtn) {
        saveGeneralNotesBtn.addEventListener('click', async () => {
            saveGeneralNotes();
            await showMessageBox('General notes saved locally!');
        });
    }

    // --- Tab Switching Logic ---
    function showTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        const targetButton = document.querySelector(`[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(`${tabId}-tab`);

        if (targetButton) targetButton.classList.add('active');
        if (targetContent) targetContent.classList.add('active');

        if (tabId === 'wiki') {
            renderCards();
        } else if (tabId === 'roles') {
            loadPlayerRoles();
        } else if (tabId === 'notes') {
            loadGeneralNotes();
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            showTab(button.dataset.tab);
        });
    });

    // Function to create a role/modifier card
   // Function to create a role/modifier card
    function createCard(entity) {
    const card = document.createElement('div');
    // Apply responsive grid layout for cards and styling
    card.className = `role-card bg-gray-700 rounded-lg p-4 shadow-lg transition-transform transform hover:scale-105 cursor-pointer relative overflow-hidden`;

    // Define uniqueColor at the beginning of createCard
    const uniqueColor = roleColors[entity.name] || modifierColors[entity.name] || '#7e22ce';
    const glowColor = uniqueColor;

    // Apply dynamic styling for border and shadow
    card.style.boxShadow = `0 0 15px ${glowColor}`;
    card.style.setProperty('--card-scrollbar-thumb-color', uniqueColor);
    card.style.setProperty('--card-scrollbar-track-color', 'rgba(31, 31, 31, 0.5)');

    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = `0 0 20px ${uniqueColor + '90'}`;
    });
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = `0 0 15px ${glowColor}`;
    });

    const teamKey = entity.team.split(' ')[0]; // Extract primary team for color
    const teamStyle = teamColors[teamKey] || teamColors[entity.team] || { dotColor: 'cyan', boxBg: 'rgba(0, 255, 255, 0.2)', boxShadow: '0 0 8px #00ffff' };

    // Use getAssetImagePath for the main icon too for consistency
    const mainIconPath = entity.category === 'Role' ? getRoleImageUrl(entity.icon) : getModifierImageUrl(entity.icon);
    const coloredDescription = colorizeRoleNamesInText(entity.description); // Apply colorization

    // Card HTML structure
    card.innerHTML = `
        <div class="role-card-header flex items-center mb-3">
          <img src="${mainIconPath}" alt="${getModifierImageUrl(entity.icon)}" class="w-16 h-16 object-contain mr-4 "
                   onerror="this.onerror=null;this.src='placeholder.png';"
                   style="filter: drop-shadow(0 0 6px ${uniqueColor});">
          <div class="text-container flex flex-col items-start">
            <h2 class="text-2xl font-bold font-[Amatic_SC]" style="color: ${uniqueColor};">${entity.name.toUpperCase()}</h2>
            <span class="team-display-box text-xs font-semibold px-2 py-1 rounded-full mt-1" style="
                background-color: ${teamStyle.boxBg};
                box-shadow: ${teamStyle.boxShadow};
                color: ${teamStyle.dotColor};
                border: 1px solid ${teamStyle.dotColor};
            ">
                TEAM: ${entity.team.toUpperCase()}
            </span>
          </div>
        </div>

       <div class="description-abilities-settings border-t border-gray-600 pt-3 mt-3">
            <p class="description-text text-gray-300 text-sm leading-relaxed mb-4 border-l-4 pl-3" style="border-color: ${uniqueColor};">
                ${coloredDescription}
            </p>

            <div class="abilities-section">
                <h3 class="text-cyan-400 text-base font-semibold mb-2 text-left">Abilities:</h3>
                <div class="
                    flex flex-col /* Stacks each ability item on a new line */
                    gap-2 mt-2 p-2 
                    
                ">
                ${
                    // Check if entity.abilities exists and is an array, then map over it
                    (Array.isArray(entity.abilities) && entity.abilities.length > 0)
                    ? entity.abilities.map(ability => `
                        <div class="
                            flex flex-row items-center /* Icon and text on same line, vertically centered */
                            
                            p-1 rounded-md 
                             border-2 border-transparent 
                            transform transition-all duration-200 
                            hover:scale-105 hover:bg-gray-700 hover:shadow-lg
                        " style="
                            box-shadow: 0 0 5px rgba(0,0,0,0.5);
                            ;
                        ">
                            <img src="${getAbilityImageUrl (ability.icon)}" alt="${ability.name} Icon" 
                                class="w-7 h-7 object-contain mr-1.5 drop-shadow-md" 
                                onerror="this.onerror=null;this.src='assets/placeholder_image.png';" 
                                style="filter: drop-shadow(0 0 3px ${uniqueColor});">
                            <span id="ability-name" class="text-base font-semibold text-gray-200 leading-tight text-center flex-grow font:1rem"> 
    ${ability.name}
</span>
                        </div>
                    `).join('')
                    : `<p class="text-center text-gray-400 italic text-sm py-4">No specific abilities listed.</p>`
                }
                </div>
            </div>
        </div>
    `;
    card.addEventListener('click', () => {
        populateDetailModal(entity); // Pass the 'entity' object related to this card
    });
    return card;
}


// Make sure roleColors, modifierColors, teamColors, and colorizeRoleNamesInText are defined
// (they seem to be present in your existing script.js)


    // Function to render/filter cards
    function renderCards() {
        if (!roleWikiCardGrid || !searchInput || !combinedFilterSelect) {
            console.error("Missing critical role wiki elements for rendering cards.");
            return;
        }

        const searchTerm = searchInput.value.toLowerCase();
        const selectedFilter = combinedFilterSelect.value;

        const filteredEntities = allEntitiesData.filter(entity => {
            const matchesSearch = searchTerm === '' ||
                entity.name.toLowerCase().includes(searchTerm) ||
                entity.description.toLowerCase().includes(searchTerm) ||
                (entity.ability && entity.ability.toLowerCase().includes(searchTerm)) || // Guard against null/undefined ability
                entity.team.toLowerCase().includes(searchTerm) ||
                (entity.types && entity.types.some(type => type.toLowerCase().includes(searchTerm))) || // Guard against null/undefined types
                (entity.options && entity.options.some(opt =>
                    opt.name.toLowerCase().includes(searchTerm) ||
                    opt.description.toLowerCase().includes(searchTerm)
                ));

            let matchesFilter = true;
            if (selectedFilter !== "All") {
                if (["Crewmate", "Neutral", "Impostor", "Alliance"].includes(selectedFilter)) {
                    matchesFilter = entity.team.includes(selectedFilter);
                } else if (["Crewmate Modifier", "Global Modifier", "Impostor Modifier", "Crewmate Alliance modifier"].includes(selectedFilter)) {
                    matchesFilter = entity.team === selectedFilter;
                } else {
                    matchesFilter = entity.types && entity.types.includes(selectedFilter); // Guard against null/undefined types
                }
            }
            return matchesSearch && matchesFilter;
        });

        roleWikiCardGrid.innerHTML = '';
        if (filteredEntities.length === 0) {
            roleWikiCardGrid.innerHTML = '<p class="col-span-full text-center text-lg text-gray-400 font-[Amatic_SC]">No roles or modifiers found matching your criteria.</p>';
        } else {
            filteredEntities.forEach(entity => {
                roleWikiCardGrid.appendChild(createCard(entity));
            });
        }
    }

    // Initial render based on default active tab (Wiki)
    showTab('wiki');

    // Event listeners for search and filter (Role Wiki)
    if (searchInput) {
        searchInput.addEventListener('input', renderCards);
    }
    if (combinedFilterSelect) {
        combinedFilterSelect.addEventListener('change', renderCards);
    }
}); // End DOMContentLoaded
