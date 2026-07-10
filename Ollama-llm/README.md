# Ollama LLM Docker Notes

This directory documents the local Ollama Docker setup used for running an interactive LLM chat.

 A container named `ollama-chat` was created on port `11435` while reusing the existing `ollama` Docker volume, so previously downloaded models remain available.

## Current Working Container

Use this container for chat:

```bash
docker exec -it ollama-chat ollama run llama3.2:1b
```

Alternative installed model:

```bash
docker exec -it ollama-chat ollama run llama2:latest
```

Exit an Ollama chat session with:

```text
/bye
```

or press `Ctrl+D`.

## Installed Models

The following models were found in the shared Ollama volume:

```text
llama2:latest
llama3.2:1b
```

## Container Details

Original container:

```text
Name: ollama
Image: ollama/ollama
Command: /bin/ollama serve
Network mode: host
Volume: ollama:/root/.ollama
Problem: exits with "listen tcp 0.0.0.0:11434: bind: address already in use"
```

Replacement container:

```text
Name: ollama-chat
Image: ollama/ollama
Port mapping: 0.0.0.0:11435->11434/tcp
Volume: ollama:/root/.ollama
```

## Commands Used

These are the commands used while diagnosing and setting up interactive chat from this directory.

### Workspace Inspection

```bash
pwd
rg --files
ls -la
```

### Docker Container Discovery

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

### Starting the Original Container

```bash
docker start ollama
```

This failed because the container exits immediately due to a port conflict on `11434`.

### Inspecting the Original Container

```bash
docker logs --tail 120 ollama
docker logs --tail 40 ollama
docker inspect ollama --format '{{json .HostConfig.PortBindings}} {{json .Config.Cmd}} {{json .Config.Entrypoint}}'
docker inspect ollama --format 'NetworkMode={{.HostConfig.NetworkMode}} Name={{.Name}} Image={{.Config.Image}} State={{.State.Status}} Exit={{.State.ExitCode}} Error={{.State.Error}}'
docker inspect ollama --format '{{json .Mounts}} {{json .Config.Env}}'
```

Key finding:

```text
Error: listen tcp 0.0.0.0:11434: bind: address already in use
```

### Port and Host Checks

```bash
ss -ltnp
fuser -v 11434/tcp
curl -s http://127.0.0.1:11434/api/tags
curl -v --max-time 2 http://127.0.0.1:11434/api/tags
pgrep -a ollama
```

### Creating the Replacement Container

```bash
docker run -d --name ollama-chat -p 11435:11434 -v ollama:/root/.ollama ollama/ollama
```

This starts a new Ollama container using the existing `ollama` model volume and avoids the host port `11434` conflict by mapping the service to host port `11435`.

### Verifying the Replacement Container

```bash
docker ps --filter name=ollama-chat --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker exec ollama-chat ollama list
```

### Model Smoke Test

```bash
docker exec ollama-chat ollama run llama3.2:1b 'Reply with only: ready'
```

This loaded the model, but generation was very slow on CPU and the command appeared to sit at Ollama's spinner for a long time.

### Process Inspection Inside the Container

```bash
docker exec ollama-chat ps -ef
docker exec ollama-chat kill 73
```

The kill command was attempted for a stale smoke-test process, but the process had already exited:

```text
kill: (73): No such process
```

## Useful Commands Going Forward

List available models:

```bash
docker exec ollama-chat ollama list
```

Start interactive chat:

```bash
docker exec -it ollama-chat ollama run llama3.2:1b
```

Check container status:

```bash
docker ps --filter name=ollama-chat --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

View logs:

```bash
docker logs --tail 100 ollama-chat
```

Stop the replacement container:

```bash
docker stop ollama-chat
```

Start it again:

```bash
docker start ollama-chat
```

Use the HTTP API on the remapped host port:

```bash
curl http://127.0.0.1:11435/api/tags
```

