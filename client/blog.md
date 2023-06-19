# setup guide for frontend
package manager: yarn
#### mac install

- `brew install yarn`
- check yarn version: `yarn --version`
- create react app: `yarn create react-app .`
- To add more packages: `yarn add <package>`
- running the app: `yarn start`

# File flow and information (Notes)

## libraries/packages imported/used

- yup";    // validation library

### state/index.js
- Initial state
    - initially the state that is stored in the global state data is accessible from anywhere in the application
- Reducers: functions that involve modifying the above global states

### scenes/loginPage/Form.jsx
- to navigate when they register
