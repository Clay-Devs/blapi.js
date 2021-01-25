# CLay Bot List API | cblapi

Official module for interacting with the claybotlist API

## Installation
```sh
npm install cblapi
```

## Example

```js
const CBL = require('cblapi')
const Discord = require('discord.js')
const client = new Discord.Client()
const cbl = new CBL('CBL Token', client)


// Events

cbl.on('posted', () => {
    console.log('Succesfully posted!')
})

cbl.on('error', err => {
    console.error(`Oops! ${err}`)
})

```

## Documentation

~~being worked on~~