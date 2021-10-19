import {BitFieldResolvable, Client, IntentsString} from 'discord.js';
import {AppOptions} from '../../interfaces/IApp';
import whiteLinkManager from '../../manager/WhiteLinkManager/WhiteLinkManager';
import {defaultWhiteLink} from '../../constants';
import messageCreate from '../../events/Message/Message';

class App extends Client {
  public readonly token: string;
  public readonly development: boolean;
  public readonly prefixes: string[];
  public readonly intents: BitFieldResolvable<IntentsString, number>;

  public constructor(options: AppOptions) {
    super(options);

    this.token = options.token;
    this.development = options.development;
    this.prefixes = options.prefixes;
    this.intents = options.intents;

    this.login(this.token);

    this.on('ready', () => this.onReady());
    this.on('messageCreate', (message) => messageCreate(message, this.prefixes));
  }

  private onReady = () => {
    console.log(`Logged in as ${this.user.tag}!`);
    whiteLinkManager.saveData(defaultWhiteLink);
  }
}

export default App;
