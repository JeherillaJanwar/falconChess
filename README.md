# <p align="center">falconChess</p>

> **Note**
> STAR, FORK, FOLLOW SELF_HOSTING guide and ENJOY!!!

<hr />

> **Warning**
> This source code is under BSD 3-Clause License

<hr />

<p align="center">Play chess for FREE using falconChess</p>
<p>PLAY with a friend or with <a href="https://stockfishchess.org/">Stockfish</a> using falconChess</p>
<br />

<details open>
<summary>Quick start</summary>

<br/>

Install [NodeJs](https://nodejs.org/en/blog/release/v16.15.1/).

```bash
# Copy .env.template to .env and edit it
$ cp .env.template .env
```

```bash
# Install NodeJS 16.X and npm
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ npm install -g npm@latest
```

---

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
Open `localhost:8080` and enjoy chess
</details>

<details>
<summary>Self hosting (NGROK, PM2)</summary>

<br/>

To self-hosting falconChess, just follow [these steps](JeherillaJanwar/falconChess/docs/self_hosting.md).

</details>

<details open>
<summary>Support</summary>

<br/>

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/ishaan328069)

</details>

<details>
<summary>License</summary>

<br/>

```bash
BSD 3-Clause License

Copyright (c) 2023, Ishaan S.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

</details>

---
