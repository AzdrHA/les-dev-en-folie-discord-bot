import {ClientOptions} from 'discord.js';

export interface AppOptions extends ClientOptions {
  token: string;
  development: boolean;
  prefixes: string[];
}
