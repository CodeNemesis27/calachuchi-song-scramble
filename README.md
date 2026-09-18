# Song Scramble 🎶✝️

A hymn word-order game for two church groups. One shared screen keeps
score across rounds; each team races on its own phone to tap a scrambled
line of a hymn back into the correct order.

- **No backend server required** — a plain static site (HTML/CSS/JS).
- Real-time sync between devices runs on **PieSocket** (same approach as
  the Bible Buzzer game), so it deploys to Vercel as-is.

## How it plays

1. Each team huddles around **one phone**. Someone taps for the group.
2. The host screen shows a room code + QR. Teams join with the code and
   a team name (e.g. "Team Judah").
3. Once the host starts the round, each team's phone shows the same
   scrambled line, broken into individual word tiles.
4. Tap the words **in the correct order**. A correct tap turns that word
   green and moves it into the sentence being built at the top.
5. A wrong tap resets that team's board — all tapped words go back into
   the scramble, and they start again from the first word. (Only that
   team resets — the other team's progress is untouched.)
6. First team to rebuild the full line correctly wins the round — there's
   no timer, so a round stays open until someone solves it. (If a line
   stumps both teams, the host can tap **Skip to Next Song** to move on
   without awarding points.) The host screen reveals the hymn title
   either way, so it stays educational regardless of the outcome.
7. The game runs through a fixed difficulty ladder: a **Trial** round
   first (free practice, worth 0 points), then **Easy** (1 point),
   **Normal** (3 points), and **Hard** (5 points) rounds in that order.
   Both the host screen and each team's phone show the current tier and
   its point value (e.g. "Hard 2/5 · 5 pts").
8. After all rounds, the host screen shows the final total score and
   winner.

## 1. Get a free PieSocket key (2 minutes)

If you already set one up for Bible Buzzer, you can reuse the same key —
this game just uses a different channel name so the two won't collide.
Otherwise:

1. Go to **[piesocket.com](https://www.piesocket.com/pricing)** and sign up
   for the free plan.
2. Create an API key, copy your **API Key** and **Cluster ID**.
3. Open `shared.js` and paste them in:

   ```js
   const PIESOCKET_CONFIG = {
     apiKey: "YOUR_PIESOCKET_API_KEY",
     clusterId: "YOUR_CLUSTER_ID",
   };
   ```

## 2. Try it locally (optional)

```bash
npx serve .
```

Open the host page on your laptop and the team page on your phone (same
Wi-Fi) — or just use two browser tabs to test the flow yourself.

## 3. Deploy to Vercel

**Easiest way:** go to [vercel.com/new](https://vercel.com/new), drag and
drop this folder (or connect the repo). Framework preset: **Other** — no
build command or output directory needed, it's static files.

**Or with the CLI:**
```bash
npm i -g vercel
cd song-scramble
vercel
```

## 4. Play

1. Host opens `https://your-game.vercel.app/host.html` on the shared
   screen — shows the room code + QR.
2. Each team opens `https://your-game.vercel.app/player.html` (or scans
   the QR, which fills the code in automatically), types a team name,
   and taps **Join Game**.
3. Host taps **Start Game** once both teams show up in the lobby.
4. Each round stays open until a team finishes it. The host screen shows
   both teams' sentences filling in live, word by word, plus an activity
   feed ("Team B slipped up and had to restart!").
5. After all 15 rounds (1 trial + 4 easy + 5 normal + 5 hard), tap
   **Play Again** on the host screen to reset scores and go again with
   the same room code.

## Customizing the songs

Open `shared.js` and edit the `SONGS` array. Each entry has:
- `level` — "Trial", "Easy", "Normal", or "Hard" (just a label — the game
  plays through the array in the order you list, it doesn't reorder by
  level name)
- `points` — how many points a win in that round is worth
- `line` — the sentence that gets scrambled
- `title` — the hymn title, revealed after the round

```js
{ level: "Easy", points: 1, line: "To God be the glory Great things he hath done", title: "To God Be the Glory" },
```

Add, remove, or reorder rounds freely — the difficulty ladder is just
whatever order you put them in. All 15 starter lines are hymns from the
1700s–1800s (or 1923, which is public domain in the US as of 2019), so
they're safe to use freely. One well-known exception was deliberately
left out: **"How Great Thou Art"** — the widely-sung English lyrics
(translated by Stuart K. Hine in 1949) are still under active copyright,
so that one isn't included here. Feel free to add it yourself if your
church's licensing covers it, or swap in another public-domain hymn from
your own hymnal the same way.

You can also change, in `shared.js`:
- `NEXT_ROUND_DELAY_MS` — how long the reveal stays up before the next
  round loads (default 5000ms).

## Known limitations (kept simple on purpose)

- If the host screen is refreshed mid-game, the room code changes and
  teams will need to rejoin — keep the host tab open for the whole game.
- Built for one phone per team. If a team opens the game on two phones
  at once, each phone runs its own independent puzzle rather than
  sharing progress — pick one phone per team to avoid confusion.
- No persistent database — scores reset if everyone closes their tabs.

## Customizing the look

The color palette, fonts, and decorative bits (torn paper edges, washi
tape, the little botanical accent) are all defined as CSS variables and
a handful of reusable classes near the top of `style.css` — `--bg-kraft`,
`--paper`, `--accent`, etc. Change the hex values there to retheme
everything at once.