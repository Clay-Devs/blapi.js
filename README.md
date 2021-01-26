# Botlist.xyz API | cblapi

Official module for interacting with the botlist.xyz API

## Installation
```sh
npm install blapi.js
```

## Example

```js
const BL = require('blapi.js')
const Discord = require('discord.js')
const client = new Discord.Client()
const bl = new BL('BL Token', client)


// Events

bl.on('posted', () => {
    console.log('Succesfully posted!')
})

bl.on('error', err => {
    console.error(`Oops! ${err}`)
})


// Usage
client.on('ready', () => {
    bl.postStats(client.guilds.cache.size, client.shard.id, client.shard.count)//if using sharding
    bl.postStats(client.guilds.cache.size) // no sharding
})

```

## Documentation

~~being worked on~~

## Changelog

### v1.1.0
  Performance tweaks <br>
### v1.1.0-prebuild  
rebranded all tools
### v1.0.9
  Remove unused code <br>
  Update Vote api <br>
  Simplified the TypeScript files <br>

### v1.0.8 and below
<<<  Not Supported  >>>