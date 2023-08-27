# crypto-x-action

## Docker

### 1. Installation

For installing Docker & Docker Compose to your system the following command required:
```bash
sudo apt-apt update 
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Or another way:
```bash
sudo apt-apt update 
curl -fsSL get.docker.com | CHANNEL=stable sh
sudo apt install docker-ce
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

> **Note**:
>
> Because docker could have **"compose"** as plugin - commands below could look at 2 different views:
> It will be `docker compose` or simply `docker-compose`

### 2. Build

1. Firstly you build file related to **env**: `dev` or `prod`
  ```bash
  docker-compose -f ./docker-compose.<envName>.yaml build --progress=plain
  ```

### 3. Start up

- Start up with logging
  ```bash
  docker-compose -f ./docker-compose.<envName>.yaml up
  ```

- Start up containers in the background (preferably)
  ```bash
  docker-compose -f ./docker-compose.<envName>.yaml up -d
  ```

### 4. Configuration

#### `docker-compose.dev.yaml`

1. For each `service` there is **key** `command` where set _start up command_ which **automatically** run the server.
2. But we not always need this and if we **want to disable auto-startup** we should change default `command: -c "<command>"` to `commamd: -s`

### 5. Interaction

1. You can jump into a **container** with interactions by the following the command
  ```bash
  docker exec -it <containerName> bash
  ```

2. If you typed `commamd: -s` in the `docker-compose.dev.yaml` then you need write commands im **container** to start up any server / client:

`NestJS`:
```bash
  npm run start
```

`NextJS`:
```bash
  npm run dev
```

### 6. Logs

1. To get snapshot of logs for the current you can do by this command:
  ```bash
  docker logs --tail=500 <containerName>
  ```

2. Or you could follow logs and see what's happening in real-time
  ```bash
  docker logs --follow <containerName>
  ```