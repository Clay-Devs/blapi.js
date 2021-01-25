const EventEmitter = require('events');
const { Agent } = require('https');
const qs = require('querystring');


const getLib = (lib, client) => {
    try {
        const library = require.cache[require.resolve(lib)]
        return library && client instanceof library.exports.Client
    } catch (error) {
        return false
    }
}

const supportedlib = client => getLib('discord.js', client) || getLib('eris', client)

class CBL extends EventEmitter {
   /**
    * @param {string} token
    * @param {Object} [options]
    * @param {number} [options.statsInterval=1800000]
    * @param {any} [client]
    */
   constructor(token, client, options){
    if(!client) throw new Error(`I'm sorry but at our current state the [client] object is needed`)
       super()
       this.token = token;
       if(supportedlib(options)){
           client = options
           options = {}
       }
       this.options = options || {}

       if(client && supportedlib(client)) {
           if(!this.options.statsInterval) this.options.statsInterval = 1800000
           if(this.options.statsInterval < 700000) throw new TypeError('statsInterval may not be shorter than 700000 ms')

           /**
            * @event posted
            */

            /**
             * @event error
             * @param {error} error
             */

             this.client = client
             this.client.on('ready', () => {
                 this.postStats()
                 .then(() => this.emit('posted'))
                 .catch(e => this.emit('error', e))
               setInterval(() => {
                 this.postStats()
                   .then(() => this.emit('posted'))
                   .catch(e => this.emit('error', e))
               }, this.options.statsInterval)
             })
       } else if (client) {
           console.error(`[Clay Bot List] The Client provided is not supported`)
       }
    }
       /**
        * @param {string} method
        * @param {string} endpoint
        * @param {Object} [data]
        * @private
        * @returns {Promise<Object>}
        */
async _request(method, endpoint, data) {
            return new Promise(async (resolve, reject) => {
                const response = {
                    raw: '',
                    body: null,
                    status: null,
                    headers: null,
                }

                const opt = {
                    hostname: 'https://botlist.derkleineme.repl.co',
                    path: `/api/${endpoint}/`,
                    method,
                    headers: {},
                }
                this.id = this.client.user.id
                opt.headers.id = this.id
                if(this.token) {
                    opt.headers.authorization = this.token;
                } else {
                    console.warn(`[Clay Bot List] No CBL token provided`) // eslint-disable-line no-console
                }

                if(data && method === 'post') opt.headers['content-type'] = 'application/json'
                if(data && method === 'get') opt.path += `?${qs.encode(data)}`;

                const axios = require('axios')

                if(method === 'post'){
                    var r = await axios.post(`${opt.hostname}${opt.path}`, { headers : opt.headers, body: data })
                    .catch(e => reject(e))

                    resolve(200)
                }
                if(method === 'get'){
                    var r = await axios.get(`${opt.hostname}${opt.path}`, { headers : opt.headers })
                    .catch(e => reject(e))

                    resolve(200)
                }
/*
                const req = https.request(opt, res => {
                    response.status = res.statusCode
                    response.headers = res.headers
                    response.ok = res.statusCode >= 200 && res.statusCode < 300
                    response.statusText = res.statusMessage
                    res.on('data', chunk => {
                        response.raw += chunk
                    })
                    res.on('end', () => {
                        response.body = res.headers['content-type'].includes('application/json') ? JSON.parse(response.raw) : response.raw
                        if(response.ok) {
                            resolve(response)
                        } else {
                            var err = new Error(`${res.statusCode} ${res.statusMessage}`)
                            Object.assign(err, response)
                            reject(err)
                        }
                    })
                })

                req.on('error', err => {
                    reject(err)
                })

                if(data && method === "post") req.write(JSON.stringify(data));
                req.end()
                */
            });
        }
   

   /**
    * @param {number|number[]} serverCount
    * @param {number} [shardId]
    * @param {number} [shardCount]
    * @returns {promise<Object>}
    */
   async postStats(serverCount, shardId, shardCount) {
       if(!serverCount && !this.client) throw new Error('postStats requires 1 argument')
       const data = {}
       if(serverCount) {
           data.server_count = serverCount
           data.shard_id = shardId
           data.shard_count = shardCount
       } else {
           data.server_count = this.client.guilds.size || this.client.guilds.cache.size
           if(this.client.shard && this.client.shard.count) {
               if(this.client.shard.ids && this.client.shard.ids.length === 1 && this.client.shard.count > 1) {
                   data.shard_id = this.client.shard.ids[0]
               } else {
                   data.shard_id = this.client.shard.shardId
               }
               data.shard_count = this.client.shard.count
           } else if (this.client.shards && this.client.shards.size !== 1) {
               data.shard_count = this.client.shards.size
           }
       }
       const response = await this._request('post', 'bots/stats', data, true)
       return response.body
   }

   /**
    * @param {string} id
    * @returns {Promise<Object>}
    */

    async getStats(id) {
        if (!id && !this.client) throw new Error('getStats requires id as an argument');
        if (!id) id = this.client.user.id;
        const response = await this._request('get', `bots/${id}/stats`);
        return response.body;
    }

    /**
     * @param {string} id
     * @returns {Promise<Object>}
     */

     async getUser(id){
        if (!id) throw new Error('getUser requires id as argument');
        const response = await this._request('get', `users/${id}`);
        return response.body;
      }

        /**
   
   * @param {Object} query
   * @returns {Promise<Object>}
   */
  async getBots(query) {
    const response = await this._request('get', 'bots', query);
    return response.body;
  }

  /**
   * @returns {Promise<Array>}
   */
  async getVotes() {
    const response = await this._request('get', 'bots/votes', undefined, true);
    return response.body;
  }


  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async hasVoted(id) {
    if (!id) throw new Error('hasVoted requires id as argument');
    const response = await this._request('get', 'bots/check', { userId: id }, true);
    return !!response.body.voted;
  }


}

module.exports = CBL;