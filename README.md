# SplitSense 💸

> *Because someone in your friend group never pays back — and we all know who it is.*

Ever been in that situation where the bill arrives, everyone goes quiet, and somehow the same person "forgets" to pay — again? Yeah. We built SplitSense for exactly that.

SplitSense is a bill-splitting app that doesn't just track who owes what — it watches *how* people pay. Too slow? Too inconsistent? Always conveniently offline when money is mentioned? The app notices. And it calls you out.

---

## What is SplitSense?

At its core, SplitSense is a shared expense tracker for friend groups. Add a bill, split it however you want, and mark it settled when someone pays up. Standard stuff.

But here's where it gets interesting — SplitSense analyses everyone's payment behaviour over time and assigns each person a **Debt Personality**. Are you *The Saint* who always pays first? Or are you *The Ghost* who disappears the moment a bill is raised? The app knows. And the **Shame Wall** makes sure everyone else does too.

---

## Features

- **Add & split expenses** — split equally, by custom amounts, or by percentage
- **Live balance tracker** — always know exactly who owes what
- **Settle Up** — mark a debt as paid and log when it happened
- **Debt Personality Engine** — a custom algorithm that scores each person's payment behaviour and gives them a personality
- **The Shame Wall** — a leaderboard that ranks your group from most to least responsible. It's funny until you're at the bottom
- **Auto Roast** — a generated one-liner that roasts the worst payer using their actual stats
- **Member Profiles** — see anyone's full payment history, personality breakdown, and how much they've improved (or haven't)
- **Group Stats** — spending by category, monthly trends, biggest expense ever
- **Dark / Light mode** — because some of us do our finances at 2am
- **No login, no backend** — everything is saved locally, just open and go

---

## Debt Personalities

Every member gets scored across 4 things — how fast they pay, how consistent they are, how generous they are, and how often they ghost. Based on that, they get one of these:

| Personality | Emoji | What it means |
|---|---|---|
| The Saint | 👑 | Always pays first. The group would fall apart without them |
| The Chronic Delayer | 🐢 | Not broke, just perpetually "about to send it" |
| The Penny Pincher | 🧮 | Pays exactly their share. Splits the delivery fee too |
| The Ghost | 👻 | Last seen online before the bill was raised |
| The Gambler | 🎲 | Paid in 2 minutes last week, hasn't paid in 3 weeks this time |
| The Overdue King | 😇 | Holds the group record for highest outstanding balance |

---

## Tech Stack

We kept it simple and focused on doing the fundamentals well.

- **React 18** — component-based UI
- **React Router v6** — multi-page navigation
- **React Context API** — shared state across pages
- **Chart.js** — spending charts and monthly trends
- **localStorage** — all data persists without any backend
- **Vite** — fast dev environment
- **CSS Variables** — theming and dark/light mode

No paid APIs. No backend. Just clean frontend work.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/splitsense.git

cd splitsense

npm install

npm run dev
```

Open `http://localhost:5173` and you're good to go.

---

## HOF Usage

Higher-Order Functions are used throughout the app for filtering, sorting, and rendering data:

```js
// filter — only show unsettled expenses
expenses.filter(e => !e.settled)

// map — render each expense as a card
expenses.map(e => <ExpenseRow key={e.id} data={e} />)

// sort — rank members on the Shame Wall
members.sort((a, b) => b.ghostScore - a.ghostScore)

// reduce — calculate total owed by a person
expenses.reduce((sum, e) => sum + e.amountOwed, 0)

// find — fetch a specific member's profile
members.find(m => m.id === selectedMemberId)
```

---

## Screenshots

*(coming soon — we'll add these once the UI is done)*

---

## Future Ideas

There's a lot more we'd want to build if this were a real product —

- UPI integration so you can settle debts directly in the app
- Push notifications to remind chronic delayers
- A proper backend with accounts so groups actually persist across devices
- Receipt scanning — upload a photo of a bill and auto-read the amount
- A shareable group link so friends can join without any setup

---

## Team

Built by —

- Yatharth Soni
- Yuvraj Singh
- Tirthdev Gera

---

<p align="center">Made with 💸, frustration, and a group chat full of IOUs</p>
