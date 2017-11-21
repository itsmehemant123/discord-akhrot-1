# Discord Bot

**[Unmaintained] use my [discord-wheatley](https://github.com/itsmehemant123/discord-wheatley) for pure python bot**
## Setting up
- While in the root directory, run
```sh
npm install
```
- While in the `chatterbot` directory, run
```sh
pip install -r requirements.txt
```

## Running the bot

### Step 1: Setup and run flask
- While in the root directory, run
```sh
export FLASK_APP=chatterbot/server.py
```
- Run the chatterbot server from the root directory with
```sh
flask run
```

### Step 2: Run the discord bot
- Place the `auth.json` in the config file.
- Run the bot with
```sh
npm start
```
