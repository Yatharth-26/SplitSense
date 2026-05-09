# SplitSense

SplitSense is a React-based expense splitting website for groups. Users can create groups, add shared expenses, calculate balances, record settlements, and view a simple Shame Wall leaderboard based on pending amounts.

The project is built as a frontend-only app, so it is easy to run, understand, and explain. All data is stored in the browser using `localStorage`.

## Features

- **Dashboard**
  Shows total spending, number of groups, number of expenses, settlements, and category-wise spending.

- **Group Management**
  Users can create a group, choose an emoji, and add multiple members.

- **Expense Management**
  Users can add an expense with description, amount, category, payer, and selected members for splitting.

- **Equal Split Calculation**
  The app divides an expense equally among the selected members.

- **Balance Calculation**
  Each member's balance is calculated using expenses and settlements.
  Positive balance means the person should receive money.
  Negative balance means the person owes money.

- **Settlement Suggestions**
  The app shows who should pay whom to settle pending balances.

- **Settle Up**
  Users can confirm a settlement, and it gets added to the settlement history.

- **Shame Wall**
  A simple leaderboard that sorts members by how much they currently owe.
  This does not use AI or any external API.

- **Toast Notifications**
  Small messages appear when a group, expense, or settlement is added.

- **Light and Dark Mode**
  The website supports both themes using CSS variables and React state.

- **Local Data Persistence**
  Groups, expenses, settlements, and theme preference are saved in `localStorage`.

## Tech Stack

- **React 18**
  Used for building reusable UI components.

- **JavaScript**
  Used for state handling, calculations, array methods, functions, and app logic.

- **JSX**
  Used to write component UI inside React files.

- **CSS**
  Used for styling, dark/light mode, cards, modals, tabs, buttons, and responsive layout.

- **CSS Variables**
  Used for theme colors and switching between light and dark mode.

- **Vite**
  Used as the development and build tool.

- **npm**
  Used for installing dependencies and running scripts.

- **localStorage**
  Used for storing app data in the browser.

## Concepts Used

- React components
- Props
- `useState`
- `useEffect`
- `useMemo`
- Conditional rendering
- Controlled components
- Arrays and objects
- `map`, `filter`, `reduce`, `sort`, and `find`
- Spread operator
- Functions and callback functions
- Modular file structure
- CSS classes and CSS variables

## File Structure

```text
SplitSense/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── components/
    │   ├── AddExpenseModal.jsx
    │   ├── AddGroupModal.jsx
    │   ├── Dashboard.jsx
    │   ├── GroupView.jsx
    │   ├── Navbar.jsx
    │   └── ShameWall.jsx
    ├── data/
    │   └── demoData.js
    └── utils/
        └── helpers.js
```

## Main Files

- `src/App.jsx`
  Main component. Stores app state, handles navigation, modals, toast notifications, localStorage, and theme switching.

- `src/components/Navbar.jsx`
  Top navigation bar with tabs, group menu, add buttons, and light/dark mode toggle.

- `src/components/Dashboard.jsx`
  Shows dashboard cards, group list, user balance summary, and category-wise spending.

- `src/components/GroupView.jsx`
  Shows selected group details, member balances, settlement suggestions, expenses, and settlement modal.

- `src/components/AddExpenseModal.jsx`
  Controlled form for adding a new expense.

- `src/components/AddGroupModal.jsx`
  Controlled form for creating a new group and adding members.

- `src/components/ShameWall.jsx`
  Sorts members by pending amount and displays a simple leaderboard.

- `src/utils/helpers.js`
  Contains reusable functions for calculating balances, generating debts, formatting currency, formatting dates, and calculating totals.

- `src/data/demoData.js`
  Contains initial demo groups, expenses, and settlements.

- `src/index.css`
  Contains all major styling, including dark mode, light mode, cards, tabs, buttons, modals, forms, and responsive design.

## How to Run

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Important Notes

- This is a frontend only project.
- There is no backend.
- There is no login/authentication system.
- There is no external API.
- There is no AI or personality engine.
- Data is stored only in the user's browser through `localStorage`.

## Team Members

- Yuvraj Singh
- Yatharth Soni
- Tirthdev
