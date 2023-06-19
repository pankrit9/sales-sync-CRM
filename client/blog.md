# setup guide for frontend
package manager: yarn

#### mac setup
- `brew install yarn`
- check yarn version: `yarn --version`
- create react app: `yarn create react-app .`
- To add more packages: `yarn add <package>`

#### running the client
- after git pull
- run to install the dependencies locally `yarn install`, node_modules will appear in the repo
- run the app: `yarn start` in the client dir

# File flow and information (Notes)

## libraries/packages imported/used

-
-

### state/index.js
- logic for the entire application (states) -> for redux
- states:
    - mode: light or dark
    - user: logged in or out
- InitialState
    - initially the state that is stored in the global state data is accessible from anywhere in the application
- Reducers: functions that involve modifying the above global states

### scenes/loginPage/Form.jsx
- register and login functionality handling
- useState("login") : to confirm the page - whether login or register.

### scenes/loginPage/index.jsx
- HTML handling (layout) for the login page
- 

### api.js
- easy backend url

### App.js
- handles all the routes and their placements
    - the overall layout of the application
- the main file of react

### scenes/loginPage/index.jsx
- renders the root components of the application including the app.js 
