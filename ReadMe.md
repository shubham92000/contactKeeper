# Title

Full stack web app for storing contacts of users.Users can register and can create , update , delete contacts their personal and professional contacts

---

## Requirements

- Node

## Install

    $ git clone https://github.com/shubham92000/contactKeeper.git
    $ cd contactKeeper
    $ npm install
    $ npm clientinstall

## Configure app

- cd `config`
- Add `default.json` file in this(`config`) folder
- Open the file and add the line
  - { "mongoURI": "your_mongo_db_link",
    "jwtSecret": "secret" }
- save the file

## Running the project

    $ npm run dev

## Build for production

    $ npm run build

---

## Site Images:

![registerPage](./readmeImages/register.png 'registerPage')

![loginPage](./readmeImages/login.png 'loginPage')

![mainPage](./readmeImages/main.png 'mainPage')
