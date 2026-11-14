## Sunshine Cars Booking System

Car Rental Booking System for Sunshine Cars. Written in JavaScript on React, Express API and MongoDB.

---

### Supporting references:

| Tool                            | Url                                                                                                                                                                                                                                                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project mgmt (JIRA)             | [https://raycorp-qut.atlassian.net/jira/software/projects/CR/boards/2/timeline](https://raycorp-qut.atlassian.net/jira/software/projects/CR/boards/2/timeline)                                                                                                                                                          |
| Requirements diagram            | [crbs-requirements.drawio](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=crbs-requirements.drawio&dark=auto#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Felray72%2Fcar-rental-booking-system%2Fmain%2Fdocs%2Fassets%2Fcrbs-requirements.drawio) |
| Requirements diagram source     | [docs/assets/crbs-requirements.drawio](docs/assets/crbs-requirements.drawio)                                                                                                                                                                                                                          |
| Booking sequence diagram        | [crbs-sequence.drawio](https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=crbs-sequence.drawio&dark=auto#Uhttps%3A%2F%2Fraw.githubusercontent.com%2Felray72%2Fcar-rental-booking-system%2Fmain%2Fdocs%2Fassets%2Fcrbs-sequence.drawio)             |
| Booking sequence diagram source | [docs/assets/crbs-sequence.drawio](docs/assets/crbs-sequence.drawio)                                                                                                                                                                                                                                  |
| Figma                           | [Car-Rental-Booking-System](https://www.figma.com/design/KRkjJrorSidIh7SJbr90Dh/Car-Rental-Booking-System)                                                                                                                                                                                            |

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

### Deployment

To do

---

### Starter project:

**GitHub link of the starter project: **[https://github.com/nahaQUT/sampleapp_IFQ636.git](https://github.com/nahaQUT/sampleapp_IFQ636.git)
