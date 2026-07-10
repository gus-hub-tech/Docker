Questions and Answers
Q1: Is it possible to build a server side application with Node.js and a frontend with React using containers and would be setup like multi containers?
A:
Yes, you can build a server-side Node.js application and a React frontend, each running in its own container. This is a common multi-container setup, typically managed with Docker Compose. Each service (backend and frontend) is defined in the Compose file, allowing you to orchestrate them together.

Q2: Where does the database fit in this scenario?
A:
The database is usually run as a separate container alongside your frontend and backend containers. The Node.js backend connects to the database container, and the React frontend communicates with the backend. All three components (frontend, backend, database) are defined as services in the Compose file.

Q3: So frontend, backend and database should all be defined in one compose file?
A:
Yes, all services (frontend, backend, database) should be defined in a single Compose file. This centralizes configuration and allows Docker Compose to manage startup, networking, and dependencies between containers.

Sources:

https://docs.docker.com/guides/docker-compose/
https://docs.docker.com/compose/intro/compose-application-model/
https://docs.docker.com/reference/compose-file/services/
Was this helpful?

Helpful

Not quite

Copy
