# Personal Budget API Server
This repository contains a simple API server built using Express.js to handle the backend operations for the Personal Budget Management applications. The server communicates with a MongoDB database to store and manage financial data.
The API server provides endpoints for CRUD operations, allowing the frontend applications (available here: [clients' repo](https://github.com/julitagajewska/be-budget-management)) to retrieve, create, update, and delete data related to personal budgets.

## Table of Contents
- [Installation](#installation)
- [Endpoints](#endpoints)

## Installation
To install and run the server locally, follow these steps:
1. Clone the repository
   ```
   git clone https://github.com/julitagajewska/be-server.git
   ```
3. Navigate to the project directory
   ```
   cd be-server
   ```
5. Install the dependencies
   ```
   npm i
   ```
7. Create .env file with a MongoDB database url (inside project directory)
   ```
   echo -e 'DATABASE_URL=*database url goes here*\nPORT=8080' > .env
   ```
9. Run the server
   ```
   npm run dev
   ```
   
## Endpoints
Here is a list of the available endpoints:

1. **Authentication** (/auth)
   - Handles user authentication, including login, registration, and password changes.
     
2. **Users** (/users)
   - Handles fetching, creating, editing and deleting users
     
3. **Accounts** (/accounts)
   - Provides CRUD operations for user accounts, which could represent bank accounts, credit cards, or other financial accounts
     
4. **Categories** (/categories)
   - Manages transactions, accounts and goals categories, allowing users to organize their financial data by category
     
5. **Transactions** (/transactions)
   - Handles CRUD operations for transactions, including recording incomes and expenses tied to specific accounts and categories
     
6. 🚧 **Goals** (/goals) (wip)
    - Manages user-defined financial goals, such as saving for a specific purpose
      
7. 🚧 **Budgets** (/budgets) (wip)
    - Provides functionality for creating and managing budgets. Users can define budget limits, track spending against those limits, and adjust budgets over time.
      
8. 🚧 **Tracked Categories** (/trackedCategories) (wip)
    - Allows users to specify which categories should be tracked for budgeting purposes
