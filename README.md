# User Management Dashboard

A full-featured React.js CRUD application for managing users via the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) mock REST API.

---

## Features

| Category        | Details |
|----------------|---------|
| **View**        | Paginated table of users with ID, First Name, Last Name, Email, Department |
| **Add**         | Modal form with client-side validation; POSTs to `/users` |
| **Edit**        | Pre-filled form modal; PUTs to `/users/:id` |
| **Delete**      | Confirmation modal; DELETEs to `/users/:id` |
| **Search**      | Global search across all fields |
| **Filter**      | Popup filter by First Name, Last Name, Email, Department |
| **Sort**        | Click any column header to sort asc/desc |
| **Pagination**  | Page controls + per-page selector (10 / 25 / 50 / 100) |
| **Error handling** | API failures shown as toast notifications; form validation errors inline |
| **Responsive**  | Fully mobile-friendly, columns collapse on small screens |

---

## Tech Stack

- **React 18** – UI framework
- **Vite** – Build tool and dev server
- **Axios** – HTTP client with interceptors for error normalization
- **Lucide React** – Icon library
- **Plain CSS** (no CSS-in-JS, no Tailwind) – External `global.css` with CSS custom properties

---

## Project Structure

```
src/
├── components/
│   ├── DeleteConfirmModal.jsx   # Confirm before deleting
│   ├── FilterPopup.jsx          # Field-by-field filter dropdown
│   ├── Pagination.jsx           # Page controls + per-page selector
│   ├── Toast.jsx                # Toast notification system
│   ├── UserFormModal.jsx        # Add / Edit modal with validation
│   └── UsersTable.jsx           # Sortable data table
├── hooks/
│   └── useUsers.js              # API state management hook
├── services/
│   └── api.js                   # Axios instance + API methods
├── styles/
│   └── global.css               # All styles (no inline CSS)
├── utils/
│   └── validation.js            # Client-side form validation
├── App.jsx                      # Root component, orchestrates state
└── main.jsx                     # Entry point
```

---

## Setup & Run

### Prerequisites

- Node.js >= 18
- npm >= 9

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/shiva8273/User_Management_Dashboard.git
cd User_Management_Dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
npm run build     # Outputs to /dist
npm run preview   # Serve the production build locally
```

---

## Implemented Functionalities

### User Management

* Display all users
* Add new user
* Edit user details
* Delete user

### Search

Search is performed in real time using:

* First Name
* Last Name
* Email
* Department

### Filter

Users can be filtered using:

* First Name
* Last Name
* Email
* Department

### Sorting

Sorting is available for:

* First Name
* Last Name
* Email
* Department

Both Ascending and Descending order are supported.

### Pagination

Available page sizes:

* 10
* 25
* 50
* 100

### Form Validation

The application validates:

* First Name
* Last Name
* Email format
* Department
* Unique Email

## Future Enhancements

* Authentication and Authorization
* Role-Based Access Control
* Dark Mode
* Export Users to Excel/PDF
* Import Users using CSV
* Server-side Pagination
* Server-side Search
* User Profile Images
* Dashboard Statistics
* Unit Testing
* API Integration with a real backend

## Assumptions

1. **Mock data expansion** – JSONPlaceholder's `/users` endpoint returns only 10 users. To demonstrate pagination and filtering meaningfully, the hook simulates 50 users by duplicating the 10 base users with modified names and random departments.
2. **Simulated mutations** – JSONPlaceholder's POST/PUT/DELETE endpoints return success responses but do not persist data. Local state is updated optimistically on each operation.
3. **Departments** – JSONPlaceholder does not include a `department` field. Departments are assigned during data expansion from a fixed list: Engineering, Design, Marketing, Sales, HR, Finance, Product, Operations.
4. **No routing** – The app is single-page with modal-based CRUD. No React Router is needed.

---

## Challenges & Future Improvements

### Challenges Faced

- **JSONPlaceholder limitations** – The API only returns 10 users and doesn't persist mutations. Working around this required simulating a larger dataset and updating local state to mirror "real" API behavior.
- **Balancing filter + search + pagination** – Ensuring the three work together (filtered count drives pagination, page resets when search/filter changes) required careful `useMemo` structuring.

### Given More Time, I Would…

- **Real backend** – Replace JSONPlaceholder with a real Django REST Framework backend (already have experience from KitchenConnects/School Management System projects).
- **Column visibility toggle** – Allow users to show/hide columns.
- **Bulk actions** – Select multiple users and delete/export them.
- **Infinite scroll** – Offer as an alternative to pagination.
- **Unit tests** – Add Vitest + React Testing Library for the hook and components.
- **Dark mode** – CSS custom properties are already structured for easy theming.
- **Export to CSV** – Let admins download the filtered user list.
