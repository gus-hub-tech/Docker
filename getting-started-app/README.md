# Getting started with Docker

This repository is a sample application for users following the getting started guide at https://docs.docker.com/get-started/.


## Start the app

1. Open a terminal in the project folder:
   ```bash
   cd /home/gus/Docker/getting-started-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   ```text
   http://127.0.0.1:3000/
   ```

## Run with Docker

If you prefer to run the app in a container, use:

```bash
docker build -t getting-started-app .
docker run -p 3000:3000 gustavdhub/getting-started
```
## Create volume
```bash
docker volume create todo-db
```
##  Mount volume
```bash
docker run -dp 127.0.0.1:3000:3000 --mount type=volume,src=todo-db,target=/etc/todos gustavdhub/getting-started
```
### Links
```bash
