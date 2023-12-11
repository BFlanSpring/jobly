# Express Jobly

Express Jobly is a web application that serves as a job board platform. It allows users to sign up, log in, and apply for jobs listed on the platform. Admin users have additional privileges such as adding new companies and managing job postings.

## Features

- **User Authentication:** Users can sign up, log in, and access their accounts securely.
- **Job Listings:** Display job listings with details like title, salary, and company information.
- **Apply for Jobs:** Users can apply for jobs listed on the platform.
- **Admin Privileges:** Admin users can add new companies and manage job postings.
- **Search and Filtering:** Users can search for jobs based on criteria like job title, salary, and company name.

## Technologies Used

- **Express.js:** Backend web framework for Node.js.
- **PostgreSQL:** Database management system.
- **bcrypt:** Library for hashing passwords.
- **JSON Web Tokens (JWT):** Used for secure authentication.
- **Jest:** Testing framework for JavaScript.
- **JSON Schema:** For validation of request data.
- **NVM:** Node Version Manager for managing Node.js versions.
- **Dotenv:** For managing environment variables.

## Setup Instructions

1. Clone this repository.
2. Install Node.js (if not already installed).
3. Use the correct Node.js version (check `.tool-versions` file for the required version).
4. Install dependencies: `npm install`.
5. Set up the database and seed initial data: `psql jobly < jobly-seed.sql`.
6. Start the server: `npm start`.
7. Access the application in your browser at `http://localhost:3001`.

## API Endpoints

- **GET /jobs:** Retrieve a list of all jobs.
- **POST /users/:username/jobs/:id:** Apply for a job.
- **POST /login:** Log in as an existing user.
- **POST /register:** Create a new user account.
- **GET /companies:** Retrieve a list of all companies.
- **POST /companies:** Add a new company.
- **PATCH /companies/:handle:** Update company information.
- **DELETE /companies/:handle:** Delete a company.
- **GET /companies/:handle:** Retrieve information about a specific company.


## License

This project is not licensed and if to be used as an open source by all!
