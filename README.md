# bulk-insert
This is allow one to import spreadsheet (excel, xlsx) file into. 
Currently env is maintain : database variables were hard coded. This is for testing purpose only.


# Usage
## Requirements
Install the following
- PostgresSQL version 12 and set it up
- NodeJs version: 14.15.4
## Dependencies
- install the app dependencies: `npm install`

- setup your database parameters:
  - create a new file and name it: `.env`

  - copy the content of `.env.example` into `.env` file, the copied data are env variables

  - setup this variable where necessary to match your database credentials.
    - DBPORT may not be need on local.
    - DBNAME and other credentials should already exist before hand to be update before the running migration 
- install knexjs migration CLI globally: `npm install knex -g`

- run migration : `knex migrate:latest` this run the migrations files

- start express server: 
  - `npm run dev` it will start on port `4000` or some other port if one is set in .env file
  - Note that you should have finish setting up env before starting the server, if for any reason you change something on the .env file , you may need to stop the server, even if it was ran with nodemon.

# routes
- local machine main url: `localhost:4000`
- basePath: `/api/v1`
- Example the address to create a user is: host:port/basePath/users => `localhost:4000/api/v1/users`
## Resource
- Users
  - `create user`: `/users`
    - `method`: POST
    - `data`: `{email: 'validemail@email.com', password: 'password'}`
    - `response`: `the data plus some additional properties`
  - list all users `/users`
    - `method`: GET

  - `create many` users' profiles: `/api/v1/users/create-many` in the future this end point will be moved to `/user-profiles` route.
    - `method`: POST
    - `data`: an excel file : having some defined headers in the following order but horizontally (i.e row wise). Their names must NOT be same as the one below but must contain data that fall under the said heading. Example an email address should not be found under last name on your excel sheet:
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
    - should be sent as form-data: whose input element name is _file: example `< input type="file" name="_file" />` 
    - if sending from POSTMAN:
       - make sure method is post
       - under body select `form-data`
       - then put key as `_file` and change key type from text to file.
       - then click on `choose file or select file`to attach the said excel file
       - then send. Check the image below
       <img src="https://github.com/ezehlivinus/bulk-insert/blob/main/insert-sample.PNG" />
       - if you can't see the image above, check this link: https://github.com/ezehlivinus/bulk-insert/blob/main/insert-sample.PNG
    - `response`: this includes either validationError, data that was inserted, and/or those that was not inserted, along with other properties.
  - list all user profiles `/user-profiles`
  - `method`: GET

