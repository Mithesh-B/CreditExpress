# Credit Express

Credit Express is a web application for managing loans. It allows registered users to avail loans and administrators to approve loans. Users can fulfill loans on a weekly term, and certain rules apply to the loan fulfillment process.

## Technologies Used

### Frontend
- React
- SCSS (Sass)
- Ant Design (UI framework)
- React Router

### Build Tool
- Vite (Frontend build tool)

### Backend
- Node.js
- Express.js (Web framework)
- MongoDB (Database)
- Bcrypt (Authentication)

## Demo

You can access the live web application here: [Credit Express](https://creditexpress.pages.dev/)

## Features

- **User Authentication**: Authentication is handled on the backend using bcrypt for secure user registration and login.

- **User Dashboard**: Registered users can access their dashboard to apply for loans and track their loan history.

- **Admin Dashboard**: Administrators can approve loan requests. The admin dashboard is accessible only to users with admin privileges.

- **Loan Fulfillment**: Users can fulfill loans on a weekly term, making payments in installments. They are prevented from paying an installment amount lower than the required amount.

- **Loan Eligibility**: Users can apply for a new loan only if their past loan has been paid.

## License
This project is licensed under the MIT License.

## Acknowledgments
Additional libraries and dependencies used in this project are listed in the package.json files of the frontend and backend directories.




