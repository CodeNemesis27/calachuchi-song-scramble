// 1. Sign up free at https://piesocket.com  →  create an API key
// 2. Paste your API key + Cluster ID below
// 3. That's it — no other server setup needed.
const PIESOCKET_CONFIG = {
  apiKey: "7Av6Y5RGTotqTkKiC5u631G0subC9WP5sA0KlLgR",
  clusterId: "free.blr2",
};

const SONGS = [
  { level: "Trial", points: 0, line: "Abide with me fast falls the eventide", title: "Abide with Me" },

  { level: "Easy", points: 1, line: "To God be the glory Great things he hath done", title: "To God Be the Glory" },
  { level: "Easy", points: 1, line: "Trust and obey for there's no other way", title: "Trust and Obey" },
  { level: "Easy", points: 1, line: "Give me the Bible Holy message shining", title: "Give Me the Bible" },
  { level: "Easy", points: 1, line: "I sing the mighty power of God that made the mountains rise", title: "I Sing the Mighty Power of God" },

  { level: "Normal", points: 3, line: "Stand up stand up for Jesus The trumpet call obey", title: "Stand Up! Stand Up for Jesus" },
  { level: "Normal", points: 3, line: "The Lord in Zion reigneth let all the world rejoice", title: "The Lord in Zion Reigneth" },
  { level: "Normal", points: 3, line: "Hark the herald angels sing Glory to the new born King", title: "Hark! The Herald Angels Sing" },
  { level: "Normal", points: 3, line: "There shall be showers of blessing This is the promise of love", title: "Showers of Blessing" },
  { level: "Normal", points: 3, line: "Wake the song of joy and gladness Hither bring your noblest lays", title: "Wake the Song" },

  { level: "Hard", points: 5, line: "Great is Thy faithfulness O God my Father There is no shadow of turning with Thee", title: "Great Is Thy Faithfulness" },
  { level: "Hard", points: 5, line: "Blessed assurance Jesus is mine O what a foretaste of glory divine", title: "Blessed Assurance, Jesus Is Mine" },
  { level: "Hard", points: 5, line: "Lord lift me up and let me stand By faith on heaven's table land", title: "Higher Ground" },
  { level: "Hard", points: 5, line: "Rescue the perishing care for the dying Jesus is merciful Jesus will save", title: "Rescue the Perishing" },
  { level: "Hard", points: 5, line: "All hail the power of Jesus' name Let angels prostrate fall", title: "All Hail the Power of Jesus' Name" },
];

// Builds a "Easy 2/4 · 1 pt" style label for a given round, used by both the
// host and player screens so the room always knows the tier, position within
// it, and what it's worth.
function levelLabel(song) {
  const levelSongs = SONGS.filter(s => s.level === song.level);
  const position = levelSongs.indexOf(song) + 1;
  const pointsText = song.points > 0 ? `${song.points} pt${song.points === 1 ? "" : "s"}` : "practice";
  return `${song.level} ${position}/${levelSongs.length} · ${pointsText}`;
}

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

// Turns a line into tokens with a unique id per tile (so the pool can add/remove
// them individually), even when the same word appears more than once. Matching
// which tile is "correct" is done by comparing word text (see normalizeWord),
// not by id — so any instance of a repeated word is accepted at its turn.
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

// Case-insensitive comparison so a duplicate word (or the same word with
// different capitalization, e.g. a sentence-initial "Holy" vs later "holy")
// is treated as interchangeable when checking a tap against the expected word.
function normalizeWord(text) {
  return text.toLowerCase();
}