# README.md

# Express Users App

This is a Node.js Express web application that allows users to manage a list of users. The application features two main pages:

1. **User List Page**: Displays a list of users with options to add or remove users.
2. **Edit User Page**: Allows users to edit existing user information or create a new user. It includes a "back to list" button to return to the user list.

## Project Structure

```
express-users-app
├── src
│   ├── app.ts
│   ├── controllers
│   │   └── userController.ts
│   ├── models
│   │   └── user.ts
│   ├── routes
│   │   └── userRoutes.ts
│   └── views
│       ├── layouts
│       │   └── main.ejs
│       ├── partials
│       │   ├── header.ejs
│       │   └── footer.ejs
│       ├── users
│       │   ├── list.ejs
│       │   └── edit.ejs
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── main.js
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-users-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   npm start
   ```

## Features

- Add new users
- Remove existing users
- Edit user details
- Responsive design with header and footer

## License

This project is licensed under the MIT License.