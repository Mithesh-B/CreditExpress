# Credit Express

Credit Express is a web application for managing loans. It allows registered users to avail loans and administrators to approve loans. Users can fulfill loans on a weekly term, and certain rules apply to the loan fulfillment process.

![scrnli_9_28_2023_2-53-02 PM](https://github.com/Mithesh-B/CreditExpress/assets/115478939/cac43c2e-4e04-414a-9284-d07758f6e0b1)

![scrnli_9_28_2023_12-20-04 PM](https://github.com/Mithesh-B/CreditExpress/assets/115478939/ff457113-c268-4849-a064-43ec2f6bd7a0)

![scrnli_9_28_2023_2-53-41 PM](https://github.com/Mithesh-B/CreditExpress/assets/115478939/bfe55360-d79c-4474-822e-bafe97a8706b)

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
- JWT (Authorization)
- express-rate-limit

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




