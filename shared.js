/* ============================================================
   Bible Buzzer — shared config, question bank, helpers
   ============================================================ */

// 1. Sign up free at https://piesocket.com  →  create an API key
// 2. Paste your API key + Cluster ID below
// 3. That's it — no other server setup needed.
const PIESOCKET_CONFIG = {
  apiKey: "7Av6Y5RGTotqTkKiC5u631G0subC9WP5sA0KlLgR",
  clusterId: "free.blr2",
};

// Each round: `line` is the scrambled sentence, `title` is revealed after the round.
// All of these are public-domain hymn lines (1700s–1800s), safe to reuse freely.
// Add, remove, or edit rounds here — the game just loops through however many you list.
const SONGS = [
  { line: "I sing the₁ goodness of the₂ Lord who filled the₃ Earth with food", title: "I Sing the Mighty Power of God" },
  { line: "Amazing grace how sweet the sound that saved a wretch like me", title: "Amazing Grace" },
  {
    line: "Abide with me fast falls the eventide The darkness deepens Lord with me abide", title: "Abide With Me"
  },
  { line: "Great is Thy faithfulness O God my Father There is no shadow of turning with Thee", title: "Great Is Thy Faithfulness" },
  { line: "Blessed assurance Jesus is mine oh what a foretaste of glory divine", title: "Blessed Assurance" },
  { line: "There shall be showers of blessing This is the promise of love", title: "Showers of Blessing" },
  { line: "Like the stars of the morning His brightness adorning", title: "When He Cometh" },
  { line: "Worthy worthy is the Lamb", title: "Worthy, Worthy Is the Lamb" },
  { line: "Come every soul by sin oppressed There's mercy with the Lord", title: "Only Trust Him" },
  { line: "Give me the Bible holy message shining", title: "Give Me the Bible" },
  { line: "Lift up the trumpet and loud let it ring Jesus is coming again", title: "Jesus Is Coming Again" },
  { line: "Lord Jesus I long to be perfectly whole I want Thee forever to live in my soul", title: "Whiter Than Snow" },
  { line: "Come thou Fount of every blessing Tune my heart to sing thy grace", title: "Come, Thou Fount of Every Blessing" },
  { line: "To God be the glory great things he hath done So loved he the world that he gave us his Son", title: "To God Be the Glory" },
  { line: "In His glory I shall see the King And forever endless praises sing", title: "I Shall See the King" },
  { line: "He leadeth me O blessed thought O words with heavenly comfort fraught", title: "He Leadeth Me" },
];

const NEXT_ROUND_DELAY_MS = 5000;

function generateRoomCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I/O, avoids confusion
  let code = "";
  for (let i = 0; i < 4; i++) code += letters[Math.floor(Math.random() * letters.length)];
  return code;
}

function generatePlayerId() {
  return "t-" + Math.random().toString(36).slice(2, 10);
}

function channelName(roomCode) {
  return "song-scramble-" + roomCode.toUpperCase();
}

function connectPieSocket(roomCode) {
  const piesocket = new PieSocket.default(PIESOCKET_CONFIG);
  return piesocket.subscribe(channelName(roomCode));
}

// Turns a line into tokens carrying their correct position, so duplicate
// words (e.g. "holy holy holy") are still tracked as distinct tiles.
function tokenizeLine(line) {
  return line.split(" ").map((text, index) => ({ id: index, text }));
}

function shuffleTokens(tokens) {
  const arr = tokens.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}