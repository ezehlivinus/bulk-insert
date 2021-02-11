# bulk-insert
This is allow one to import spreadsheet (excel, xlsx) file into. 
Currently env is maintain : database variables were hard coded. This is for testing purpose only.

# Usage
- install dependencies: `npm install`
- setup your database as required in `knexfile.js`
- run migration : `knex migrate:latest --env production`
- start server: `npm run dev` it will start on port `2021`

# routes
- create users: `api/v1/users`
  - method: POST
  - data: `{email: 'validemail@email.com', password: 'password'}`
- create many users: `/api/v1/users/create-many`
  - method: POST
  - data: an excel file having some defined headers in the following order but horizontally (row wise). Their names must NOT be same as the one below but must contain data fall under the said heading. an email address should not found under last name:
    ```
    headers = [
      'first_name',
      'last_name',
      'other_names',
      'display_name',
      'gender',
      'email',
      'phoneNumber',
      'address',
      'birth_date'
    ];
    ```

currently `knex unhandledPromiseRejection` are not being handled.
