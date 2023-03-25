# falconChess - Self Hosting

## Requirements

- [Node.js](https://nodejs.org/en/) at least 12x, better `19.8.0 LTS`
- NPM
---

Install the requirements (Note: Many of the installation steps require `root` or `sudo` access)

```bash
# Install NodeJS 16.X and npm
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ npm install -g npm@latest
```

---

## Quick start

```bash
# Clone Falcon Chess repo
$ git clone https://github.com/JeherillaJanwar/falconChess.git
# Go to falconChess dir
$ cd falconChess
# Copy .env.template to .env and edit it if needed
$ cp .env.template .env
# Install dependencies
$ npm install
# Start the server
$ npm start
```

Check if is correctly installed: https://your.domain.name:8080

---

## PM2

![pm2](../public/images/pm2.png)

Using [PM2](https://pm2.keymetrics.io) to run it as daemon

```bash
$ npm install -g pm2
$ pm2 start app/src/server.js
$ pm2 save
$ pm2 startup
```


---

# NGROK

![ngrok](../public/images/ngrok.png)

If you want to expose falconChess from your `Local PC` to outside in `HTTPS`, you need to do a thing

Edit the Ngrok part on `.env` file

```bash
# 1. Goto https://ngrok.com
# 2. Get started for free
# 3. Copy YourNgrokAuthToken: https://dashboard.ngrok.com/get-started/your-authtoken

NGROK_ENABLED=true
NGROK_AUTH_TOKEN=YourNgrokAuthToken
```

---

Then, when you run it with `npm start`, you should see in the console log this line:

```bash
server_tunnel: 'https://-----------------.ngrok.io'
```

So open it in your browser, join in the room, share it to whom you want to play chess with.

---

## Support

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ishaan328069)
