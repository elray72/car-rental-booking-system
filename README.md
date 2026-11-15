## Sunshine Cars Booking System

Car Rental Booking System for Sunshine Cars. Written in JavaScript on React, Express API and MongoDB.

| Config             | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| Website url:       | [http://3.27.4.65:5001/](http://3.27.4.65:5001/)      |
| AWS Instance Id:   | i-01ee5572f701b71df                                   |

---

### Supporting references:

| Tool                            | Url                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project mgmt (JIRA)             | [https://raycorp-qut.atlassian.net/jira/software/projects/CR/boards/2/timeline](https://raycorp-qut.atlassian.net/jira/software/projects/CR/boards/2/timeline)                                                                                                                                                          |
| Figma                           | [Car-Rental-Booking-System](https://www.figma.com/design/KRkjJrorSidIh7SJbr90Dh/Car-Rental-Booking-System)                                                                                                                                                                                            |
| Requirements diagram            | [crbs-requirements.drawio](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=crbs-requirements.drawio&dark=auto#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Felray72%2Fcar-rental-booking-system%2Fmain%2Fdocs%2Fassets%2Fcrbs-requirements.drawio) |
| Requirements diagram source     | [docs/assets/crbs-requirements.drawio](docs/assets/crbs-requirements.drawio)                                                                                                                                                                                                                          |
| Booking sequence diagram        | [crbs-sequence.drawio](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=crbs-sequence.drawio&dark=auto#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Felray72%2Fcar-rental-booking-system%2Fmain%2Fdocs%2Fassets%2Fcrbs-sequence.drawio)             |
| Booking sequence diagram source | [docs/assets/crbs-sequence.drawio](docs/assets/crbs-sequence.drawio)                                                                                                                                                                                                                                  |

---

### Getting started

1. Install dependencies from the repo root directory.

```
npm run install-all
```

2. Create the backend `.env` file

```
cp backend/.env.example backend/.env
```

3. Set the correct environment variables in your `backend/.env`

```
MONGO_URI=<YOUR_MONGODB_CONNECTION_STRING>

JWT_SECRET=<RANDOM_STRING>

PORT=5001

// JWT_SECRET:
// Generate with `openssl rand -base64 32`
// More info: [docs/config.md](docs/config.md)
```

4. Start the API (backend) and the React App (frontend). In the root directory:

```
npm start
```

- App loads on [http://localhost:3000](http://localhost:3000)
- API loads on [http://localhost:5001](http://localhost:5001)

#### Other commands

| Command            | What it does                                          |
| ------------------ | ----------------------------------------------------- |
| `npm test`         | Run backend test suites, then the frontend test suite |
| `npm run lint`     | Run `prettier` and `eslint` on frontend and backend   |
| `npm run lint:fix` | Format and auto-fix lint issues                       |

---

### Running online

During this phase, there is a limitation where only approved IP addresses can access the url at: [http://3.27.4.65:5001/](http://3.27.4.65:5001/). To set this up, do the following in AWS:

1. Log into AWS using [https://d-97671c4bd0.awsapps.com/start/#/](https://d-97671c4bd0.awsapps.com/start/#/)
2. Navigate to the instance details at `EC2` -> `Instances` -> `i-01ee5572f701b71df` or
   - [https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#InstanceDetails:instanceId=i-01ee5572f701b71df](https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#InstanceDetails:instanceId=i-01ee5572f701b71df)
3. Scroll to the bottom and click the `Security` tab.
4. Find `sg-09db074a975e0828f` and click that or
   - [https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#SecurityGroup:securityGroupId=sg-09db074a975e0828f](https://ap-southeast-2.console.aws.amazon.com/ec2/home?region=ap-southeast-2#SecurityGroup:securityGroupId=sg-09db074a975e0828f)
5. Click `Edit inbound rules` - this project is related to `Ray-CRBS` in the description.
6. Add the following config (by clicking `Add rule`)
   - Type: `Custom TCP`
   - Port range: `5001`
   - Source type: `My IP`
7. Click `Save rules`. Yous should be able to access  [http://3.27.4.65:5001/](http://3.27.4.65:5001/)

---

### Deployment - via MacOS

Assumptions - this guide assumes that you have set up your MongoDB instance, your EC2 instance with Ubuntu and `.pem` key and is not covered in this document. It is assumed you already have your What is covered is the connection to the server via SSH on Macs, server setup, code install and running the application.

#### Instance details

| Property            | Value                 |
| ------------------- | --------------------- |
| Instance id         | `i-01ee5572f701b71df` |
| Public IPv4 address | `3.27.4.65`           |
| Port                | `5001`                |

#### Pem key setup

1. Navigate to the location you stored your `.pem` file, for example `git/deploy/car-rental-key.pem`
2. Lock down the pem key, SSH won't work without this step.

```sh
chmod 400 car-rental-key.pem
```

#### 1. Server connection and setup

1. Open up AWS and go to your instance details
2. Open up your terminal window and/or ens~~u~~re you are in your pem key folder `git/deploy`
3. SSH into your Ubuntu box

```sh
ssh -i car-rental-key.pem ubuntu@3.27.4.65
```

4. Update your Ubuntu instance to latest

```sh
sudo apt update
sudo apt upgrade -y
```

5. Check your git and node versions - expect git to be installed, but not node

```sh
git -v
node -v
```

6. Install node, and when done check for node and npm versions

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# When complete, run
node -v
npm -v
```

#### 2. Git personal access token set up - required for private repos

If you have a private git repo, you will need to set up a Personal access token and use those credentials when you pull. Else skip to 3.

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens) and then generate a new token. Copy and save this generated token.
2. Set up git with your git credentials

```
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global credential.helper store
```

#### 3. Git code setup

1. Navigate to the root `~` and clone your git repository

```sh
git clone https://github.com/elray72/car-rental-booking-system.git

# Navigate into the git directory
cd car-rental-booking-system
```

2. If asked for password

```sh
# Username: your github username
# Password: your personal access token you copied
```

```sh
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global credential.helper store
```

3. Create your env file and enter your MongoDb configuration

```sh
nano backend/.env
```

4. Paste your local `.env` folder into the nano terminal

```
MONGO_URI=<YOUR MONGODB CONNECTION STRING>
JWT_SECRET=<YOUR JWT SECRET>
PORT=5001
```

5. Save this and quit nano - `Ctrl+X`, `Y`, `Enter`

#### 4. Installing your app

1. Navigate to your solution directory and install your npm packages

```sh
npm run install-all
```

2. Build the frontend

```sh
npm run build --prefix frontend

# If you get an insufficient memory error, increase max size and turn off GENERATE_SOURCEMAP
NODE_OPTIONS=--max-old-space-size=1536 GENERATE_SOURCEMAP=false npm run build --prefix frontend
```

#### 4. Running your app

1. Install the PM2 process manager - this is required on Macs to ensure the app keeps running after you shut down your terminal

```sh
sudo npm install -g pm2
```

2. Run pm2 on your backend server

```sh
cd ~/car-rental-booking-system/backend

NODE_ENV=production pm2 start server.js --name sunshine-cars

pm2 save
pm2 status
```

Expect the following output of `pm2 status`:

```sh
# pm2 status
┌────┬──────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name             │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼──────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 0  │ sunshine-cars    │ fork     │ 0    │ online    │ 0%       │ 89.6mb   │
└────┴──────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

3. Check the status of your backend service

```sh
curl -s http://127.0.0.1:5001/api/health

# Expect:
# {"status":"ok","database":"connected","uptime":4347.431915644}
```

4. Test accesing your wesbite on [http://3.27.4.65:5001/](http://3.27.4.65:5001/)

### Deployment - Updating your app

To update your code to the latest git version, ssh bac

Terminal:

```sh
ssh -i car-rental-key.pem ubuntu@3.27.4.65
```

SSH:

```sh
cd ~/car-rental-booking-system

git pull

pnpm run install-all

npm run build --prefix frontend
```

---

### Known limitations:

1. SSL and domain name has not yet been implemented. Due to restrictions on AWS server, you must add your IP in the security group in AWS. Instructions above [Running online]
2. Password reset or changing your password has not yet been implemented
3. Image assets have not yet been implemented for the Cars. Currently they only have image placeholders.
4. Booking administration features have not yet been added:
   - Admin booking list - list of all customer bookings by upcoming date
   - Admin booking search - ability to find customers by name
   - Ability to change customers booking details
5. Tests - tests have been purposely omitted tro be done in Sprint 3, exceptions are:
   - Login and registration flow
6. Deployments are manual - CI/CD pipeline has not yet been implemented
7. Non public pages are only very mildly styled - they will be updated at a later date.
