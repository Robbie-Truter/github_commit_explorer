# GitHub Commit Explorer

A simple web application to explore public GitHub repositories and their commit history for a given user.

## Features

- Search for GitHub users and view their public repositories.
- Click on a repository to view its commits.
- View detailed information for each commit, including files changed, additions, deletions, and diffs.

## Setup

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd github_commit_explorer
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

This will start the application, usually accessible at `http://localhost:5173/` (or another port if 5173 is in use).

## Technologies Used

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for navigation
- [Axios](https://axios-http.com/) for API requests

Due to time constraints, not all desired features could be implemented. Potential future enhancements include:

- **Enhanced Error Handling** – Provide clearer error messages and more specific feedback for different failure scenarios.
- **Testing with Vitest** – Add unit and integration tests to ensure code reliability.
- **Component Separation** – Split commits and commit details into dedicated components, each with its own Pinia store, loading state, and error handling.
- **Commit Sorting** – Implement sorting for commits to improve readability and user experience.
