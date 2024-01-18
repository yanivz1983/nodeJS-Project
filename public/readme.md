# Users and Cards API

Welcome to the Users and Cards API! This API provides endpoints to manage and retrieve information about both users and cards.

## Getting Started

These instructions will help you set up and run the Users and Cards API on your local machine.

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## User Types

The Users and Cards API supports three types of users, each with distinct roles and capabilities:

### 1. Regular User

- **Endpoint Access:**

  - `/users`
  - `/users/:id` (Read-only access)

- **Actions:**
  - Retrieve a list of all users.
  - Retrieve details for a specific user by providing their ID.

### 2. Business User

- **Endpoint Access:**

  - `/users`
  - `/users/:id`
  - `/cards`
  - `/cards/:id`

- **Actions:**
  - All actions available to regular users.
  - Create, update, and delete users.
  - Retrieve a list of all cards.
  - Retrieve details for a specific card by providing its ID.
  - Create, update, and delete cards.

### 3. Administrator

- **Endpoint Access:**

  - All endpoints

- **Actions:**
  - All actions available to regular and business users.
  - Full CRUD operations on both users and cards.
  - Configuration and management of the API.

This classification ensures that users have access only to the functionalities relevant to their roles, promoting a secure and organized usage of the API.

### Installing Dependencies

```bash
npm install
Running the API

npm start
The API will be available at http://localhost:8081 (or another port if specified).

API Endpoints
Users
Get All Users

GET /users
Retrieve a list of all users.

Get User by ID

GET /users/:id
Retrieve details for a specific user by providing their ID.

Create a New User

POST /users
Create a new user by providing the necessary details in the request body.

Update User

PUT /users/:id
Update details for a specific user by providing their ID and the updated information in the request body.

Delete User

DELETE /users/:id
Delete a specific user by providing their ID.

### Cards
Get All Cards

GET /cards
Retrieve a list of all cards.

Get Card by ID

GET /cards/:id
Retrieve details for a specific card by providing its ID.

Create a New Card

POST /cards
Create a new card by providing the necessary details in the request body.

Update Card

PUT /cards/:id
Update details for a specific card by providing its ID and the updated information in the request body.

Delete Card

DELETE /cards/:id
Delete a specific card by providing its ID.

Configuration
The API can be configured using environment variables. Create a .env file in the root directory and specify the required configuration variables. For example:


PORT=8081
DB_CONNECTION_STRING=mongodb://127.0.0.1:27017/biz_cards_dev
Dependencies
Express.ts: Web framework
MongoDB: Database driver
Other dependencies (see package.json)




This combined README provides information on how to set up, run, and utilize the Users and Cards API, offering a comprehensive guide for developers and users alike.





```
