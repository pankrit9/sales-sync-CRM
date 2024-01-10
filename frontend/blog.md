# setup for aws ec2

- connect to the instance using: `ssh -i salesSync_crm_ec2_docker.pem ec2-user@54.178.82.245`

# setting up the backend

`pip install -r requirements.txt`

# setup guide for frontend

package manager: yarn

# Docker setup

## docker compose

- right click the docker-compose.yml file and click on Compose Up

## frontend individually

- To build the Docker image, you'll need to navigate to your frontend directory and then run: `docker build -t fronted .`
- To run the Docker image, you can use: `docker run -p 3000:3000 frontend`

## to run backend individually

- to build the Docker image, `docker build -t backend .`
- to stop the current runnning docker: `docker stop <container_id>`
- to run the Docker image: `docker run -d -p 6969:6969 backend`

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

# Data base -
- https://cloud.mongodb.com/v2/647d8a0849a87e48ad0f0375#/metrics/replicaSet/647d9c00405af343abbe9edc/explorer/CRM/Clients/find

### CRM.Accounts - 
    {"\_id":{"$oid":"659d01bc62a1eed298fac308"},"email":"zac.simunovic.manager@gmail.com","first_name":"Zac","last_name":"Simunovic","password":"$2b$12$Bp.07E1Z.W7N/SudnkrO4uJT62LXez9FHwvzrtuZwc1aJchrgYbky","role":"manager","company":"HackWatcher","revenue":{"$numberDouble":"4176623.0"},"tasks_n":{"$numberInt":"0"},"full_name":"Zac Simunovic","code":"300"}

    \_id "24"
    email "zac.simunovic.staff@gmail.com"
    first_name "Zacheriah"
    last_name "Simunovic"
    password "$2b$12$x9Sal9Dw5CCkN4nUqfE9SOgn677UKZ3tdWF5Cn2svHQxdHlSbthe."
    role "staff"
    company "HackWatcher"
    revenue 995154
    tasks_n -122
    full_name "Zacheriah Simunovic"
    manager "23"
    code "300"
    task_completed 4

    {"\_id":"31","email":"alex.burfoot.manager@gmail.com","first_name":"Alex","last_name":"Burfoot","password":"$2b$12$BgDBh5WCyrpP0pBm6oSPjuQGWnqgPDD28/qO86bTuQWwXPRGIaIp2","role":"manager","company":"HackWatcher","revenue":{"$numberInt":"500000"},"tasks_n":{"$numberInt":"0"},"code":"300","full_name":"Alex Burfoot"}

### CRM.Clients -
    {"_id":{"$numberInt":"2"},"client":"Telstra Mercury","lifetime_value":{"$numberInt":"0"},"pending_value":{"$numberInt":"0"},"tasks":"","staff":"","email":"testemailnumber2l@gmail.com","lead_source":"Advertisement","client_position":"CEO","mobile_number":"0477 000 442","address":"123 Hell Road","last_sale":{"$date":{"$numberLong":"1689032041011"}},"tasks_records":[{"product_name":"test","completed_date":{"$date":{"$numberLong":"1689714220450"}},"qty":"5","staff":"Jose"}]}

    {"_id":{"$numberInt":"3"},"client":"John Smith","lifetime_value":{"$numberInt":"0"},"pending_value":{"$numberInt":"0"},"staff":"","email":"johnsmith@gmail.com","lead_source":"LinkedIn","client_position":"CFO","mobile_number":"0465 542 7412","address":"10 Warner Street Milsons Point","tasks":"[]","tasks_records":[{"product_name":"Mac","completed_date":{"$date":{"$numberLong":"1689705546587"}},"qty":"5","staff":"Jose"},{"product_name":"Mac","completed_date":{"$date":{"$numberLong":"1689705610042"}},"qty":"5","staff":"Jose"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689707535838"}},"qty":"2","staff":"Jose"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689766034620"}},"qty":"50","staff":"Zacheriah"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689774198427"}},"qty":"5","staff":"Zacheriah"},{"product_name":"Mugs","completed_date":{"$date":{"$numberLong":"1689777225244"}},"qty":"50","staff":"Zacheriah"}]}

    {"_id":{"$numberInt":"4"},"client":"Sarah Jones","lifetime_value":{"$numberInt":"0"},"pending_value":{"$numberInt":"0"},"tasks":"","staff":"","email":"sarahjones@gmail.com","lead_source":"Google","client_position":"COO","mobile_number":"0412 521 7454","address":"30 Joe Street","tasks_records":[{"product_name":"test","completed_date":{"$date":{"$numberLong":"1689714215915"}},"qty":"5","staff":"Jose"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689766894217"}},"qty":"42","staff":"Zacheriah"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689768869909"}},"qty":"4","staff":"Zacheriah"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1690928387599"}},"qty":"25","staff":"Zacheriah Simunovic"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1690972833836"}},"qty":"25","staff":"Imy Thackrey"}]}

    {"_id":{"$numberInt":"5"},"client":"james chavez","lifetime_value":{"$numberInt":"0"},"pending_value":{"$numberInt":"0"},"tasks":"","staff":"","email":"jimmysss@meriton.com.auss","lead_source":"Google","client_position":"ceo","mobile_number":"041781133382","address":"1609","last_sale":"","creation_date":{"$date":{"$numberLong":"1689101570944"}},"tasks_records":[{"product_name":"Mac","completed_date":{"$date":{"$numberLong":"1689714253222"}},"qty":"1","staff":"Jose"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689766642906"}},"qty":"31","staff":"Zacheriah"},{"product_name":"Laptops","completed_date":{"$date":{"$numberLong":"1689768238508"}},"qty":"1","staff":"Zacheriah"}]}

### CRM.Companies
    {"_id":{"$numberInt":"1"},"name":"Bedsolutions","code":"bedalex","admin":"Alex Burwood","creation_date":{"$date":{"$numberLong":"1689816748144"}}}

    {"_id":{"$numberInt":"2"},"name":"Construction Co","code":"25","admin":"Malakai Simunovic","creation_date":{"$date":{"$numberLong":"1689874670695"}}}

    {"_id":{"$numberInt":"3"},"name":"IPB","code":"500","admin":"Trish Hynd","creation_date":{"$date":{"$numberLong":"1690795732089"}}}

    {"_id":{"$numberInt":"4"},"name":"NewCo","code":"200","admin":"Pankrit Jindal","creation_date":{"$date":{"$numberLong":"1690922808095"}}}

### CRM.Growth
    {"_id":{"$oid":"64c9156f830fd6b04e37009f"},"metric":"n_clients","value":{"$numberInt":"2"},"entry_date":{"$date":{"$numberLong":"1702780024439"}},"rate":{"$numberDouble":"0.0"},"uId":"24"}

    {"_id":{"$oid":"64c9156f830fd6b04e3700a0"},"metric":"ltv","value":{"$numberDouble":"63333.333333333336"},"entry_date":{"$date":{"$numberLong":"1702780028245"}},"rate":{"$numberDouble":"0.0"},"uId":"24"}

    {"_id":{"$oid":"64c9156f830fd6b04e3700a1"},"metric":"win_rate","value":{"$numberDouble":"0.6666666666666666"},"entry_date":{"$date":{"$numberLong":"1702780022675"}},"rate":{"$numberDouble":"0.0"},"uId":"24"}

    {"_id":{"$oid":"64c916480e944fb84cfc392b"},"metric":"n_tasks","value":{"$numberInt":"1"},"entry_date":{"$date":{"$numberLong":"1702780026975"}},"rate":{"$numberDouble":"0.0"},"uId":"24"}

### CRM.Members
    {"_id":{"$oid":"647ee3ac6ec27fe74148f2c9"},"name":"alex","age":{"$numberInt":"21"},"email":"random@420.com","phone":{"$numberInt":"478343111"}}

    {"_id":{"$oid":"6491b57d1c0ae4efe894a6b7"},"email":"1331123231@qq.com","first_name":"Dai","last_name":"IAD","password":"secure","position":"CEO","company":"Nene chicken"}

    {"_id":{"$oid":"6491b622cc62f07b0189a344"},"email":"1331123231@qq.com","first_name":"othername","last_name":"IAD","password":"secure","position":"CEO","company":"Nene chicken"}

    {"_id":{"$oid":"6491b6adbe661544bd9b5737"},"email":"1331123231@qq.com","first_name":"alejajajaja","last_name":"IAD"}

    {"_id":{"$oid":"6491b6dc53f29257d5d5950b"},"dance_move":"korean"}

    {"_id":{"$oid":"6491baac117a5e34a0a8f5e4"},"email":"55555555@qq.com","first_name":"Dai","last_name":"IAD","password":"secure","position":"CEO","company":"Nene chicken"}

### CRM.Products
    {"_id":"1","name":"coffe2","stock":{"$numberInt":"-4"},"price":"20","manager_assigned":"Zac Simunovic","company":"300","is_electronic":false,"n_sold":{"$numberInt":"53"},"revenue":{"$numberDouble":"2470.0"}}

    {"_id":"3","name":"Coffee PDF","stock":{"$numberInt":"-5"},"price":"100","manager_assigned":"Zac Simunovic","company":"300","is_electronic":true,"n_sold":{"$numberInt":"451"},"revenue":{"$numberDouble":"45100.0"}}

    {"_id":"4","name":"daisy2","stock":{"$numberInt":"1"},"price":"10","manager_assigned":"Zac Simunovic","company":"300","is_electronic":false,"n_sold":{"$numberInt":"4"},"revenue":{"$numberDouble":"40.0"}}

    {"_id":"5","name":"daisy","stock":{"$numberInt":"0"},"price":"1","manager_assigned":"Zac Simunovic","company":"300","is_electronic":false,"n_sold":{"$numberInt":"0"},"revenue":{"$numberInt":"0"}}

### CRM.Sales
    {"_id":{"$numberInt":"1"},"product_id":{"$numberInt":"2"},"quantity_sold":{"$numberInt":"20"},"product_price":{"$numberDouble":"28.0"},"sold_by":"Zacheriah Simunovic","manager_assigned":"Zac Simunovic","date_of_sale":{"$date":{"$numberLong":"1691083263570"}},"client_id":"Nathan Figuerido","revenue":{"$numberDouble":"560.0"},"staff":"To be Implemented","payment_method":"To be Implemented","payment_status":"Paid","deadline":"To be Implemented"}


    {"_id":{"$numberInt":"2"},"product_id":{"$numberInt":"2"},"quantity_sold":{"$numberInt":"23"},"product_price":{"$numberDouble":"28.0"},"sold_by":"Imy Thackrey","manager_assigned":"Zac Simunovic","date_of_sale":{"$date":{"$numberLong":"1691083307975"}},"client_id":"Steven Keys","revenue":{"$numberDouble":"644.0"},"staff":"To be Implemented","payment_method":"To be Implemented","payment_status":"Paid","deadline":"To be Implemented"}

    {"_id":{"$numberInt":"3"},"product_id":{"$numberInt":"1"},"quantity_sold":{"$numberInt":"43"},"product_price":{"$numberDouble":"50.0"},"sold_by":"Zacheriah Simunovic","manager_assigned":"Zac Simunovic","date_of_sale":{"$date":{"$numberLong":"1691083426539"}},"client_id":"Tyler Myroin","revenue":{"$numberDouble":"2150.0"},"staff":"To be Implemented","payment_method":"To be Implemented","payment_status":"Paid","deadline":"To be Implemented"}

### CRM.Tasks
    {"_id":"1","entry_date":{"$date":{"$numberLong":"1691083057834"}},"manager_assigned":"Zac Simunovic","task_description":"Purchasing coffee cups","client_assigned":"Nathan Figuerido","product":"Coffee cups","product_quantity":"20","product_price":{"$numberDouble":"28.0"},"priority":"High Priority","due_date":{"$date":{"$numberLong":"1698624000000"}},"staff_member_assigned":"Zacheriah Simunovic","complete":"Completed","completion_date":{"$date":{"$numberLong":"1691083263393"}}}

    {"_id":"2","entry_date":{"$date":{"$numberLong":"1691083080655"}},"manager_assigned":"Zac Simunovic","task_description":"Purchasing coffee cups","client_assigned":"Steven Keys","product":"Coffee cups","product_quantity":"23","product_price":{"$numberDouble":"28.0"},"priority":"High Priority","due_date":{"$date":{"$numberLong":"1690675200000"}},"staff_member_assigned":"Imy Thackrey","complete":"Completed","completion_date":{"$date":{"$numberLong":"1691083307808"}}}

    {"_id":"3","entry_date":{"$date":{"$numberLong":"1691083365439"}},"manager_assigned":"Zac Simunovic","task_description":"Purchasing coffee beans","client_assigned":"George Jones","product":"5kg bag of Coffee Beans","product_quantity":"52","product_price":{"$numberDouble":"50.0"},"priority":"High Priority","due_date":{"$date":{"$numberLong":"1694044800000"}},"staff_member_assigned":"Ramirez","complete":"Not Started"}

    {"_id":"4","entry_date":{"$date":{"$numberLong":"1691083384107"}},"manager_assigned":"Zac Simunovic","task_description":"Purchasing coffee beans","client_assigned":"Tyler Myroin","product":"5kg bag of Coffee Beans","product_quantity":"43","product_price":{"$numberDouble":"50.0"},"priority":"High Priority","due_date":{"$date":{"$numberLong":"1701302400000"}},"staff_member_assigned":"Zacheriah Simunovic","complete":"Completed","completion_date":{"$date":{"$numberLong":"1691083426372"}}}