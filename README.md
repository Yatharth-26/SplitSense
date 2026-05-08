# SplitSense

SplitSense is a simple React expense splitter app. It lets users create groups, add shared expenses, view balances, settle pending amounts, and see a simple Shame Wall based on who currently owes the most.

## Features

- Create groups and add members
- Add expenses with category, payer, and split members
- Calculate balances for each member
- Show settlement suggestions
- Mark settlements as paid
- Dashboard with total spending and category summary
- Shame Wall leaderboard based only on pending balances
- Toast notifications
- Light and dark mode
- Data saved in `localStorage`

## Tech Stack

- React
- JSX
- CSS variables
- Vite
- npm
- localStorage

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Notes

There is no backend, login system, or external API. The app stores data in the browser using `localStorage`, which keeps the project simple and easy to explain.
