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


// Usage
client.on('ready', () => {
    cbl.postStats(client.guilds.cache.size, client.shard.id, client.shard.count)//if using sharding
    cbl.postStats(client.guilds.cache.size) // no sharding
})

```

## Documentation

~~being worked on~~

## Changelog

### v1.0.9
  Remove unused code <br>
  Update Vote api <br>
  Simplified the TypeScript files <br>

### v1.0.8 and below
<<<  Not Supported  >>>