export = BL;
import { EventEmitter } from 'events';

declare class BL extends EventEmitter {
  constructor(token: string, options: BL.BLOptions, client?: object);
  constructor(token: string, client?: object);

  public postStats(
    serverCount: number,
    shardId?: number,
    shardCount?: number
  ): Promise<object>;
  public getStats(id: string): Promise<BL.BotStats>;
  public getBot(id: string): Promise<BL.Bot>;
  public getUser(id: string): Promise<BL.User>;
  public getBots(query: BL.BotsQuery): Promise<BL.BotSearchResult>;
  public getVotes(): Promise<BL.Vote[]>;
  public hasVoted(id: string): Promise<boolean>;

  public token?: string;

  private _request(
    method: string,
    endpoint: string,
    data?: object
  ): Promise<object>;

  public on(event: 'posted', listener: () => void): this;
  public on(event: 'error', listener: (error: Error) => void): this;
}


declare namespace BL {
  export type BLOptions = {
    statsInterval?: number;
  };

  export type BotStats = {
    server_count: number;
    shards: number[];
    shard_count: number;
  };

  export type Bot = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    lib: string;
    prefix: string;
    shortdesc: string;
    longdesc?: string;
    tags: string[];
    website?: string;
    support?: string;
    github?: string;
    owners: number[];
    invite?: string;
    date: Date;
    certifiedBot: boolean;
    vanity?: string;
    points: number;
  };

  export type User = {
    id: number;
    username: string;
    discriminator: string;
    avatar?: string;
    defAvatar: string;
    bio?: string;
    banner?: string;
    social: UserSocial;
    color?: string;
    supporter: boolean;
    certifiedDev: boolean;
    mod: boolean;
    webMod: boolean;
    admin: boolean;
  };

  export type UserSocial = {
    youtube?: string;
    reddit?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
  };

  export type BotsQuery = {
    limit?: number;
    offset?: number;
    search: string;
    sort: string;
    fields?: string;
  };

  export type BotSearchResult = {
    results: Bot[];
    limit: number;
    offset: number;
    count: number;
    total: number;
  };

  export type Vote = {
    username: string;
    discriminator: string;
    id: string;
    avatar: string;
  };

  export type VoteEventArgs = {
    bot: string;
    user: string;
    type: string;
    isWeekend: boolean;
    query?: object;
  };

  export type ReadyEventArgs = {
    hostname: string;
    port: number;
    path: string;
  };
}
