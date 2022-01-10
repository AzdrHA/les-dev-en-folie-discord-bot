import {BitFieldResolvable, Client, GuildMember, IntentsString} from 'discord.js';
import {AppOptions} from '../../interfaces/IApp';
import {defaultWhiteLink} from '../../constants';
import messageCreate from '../../events/Message/Message';
import {WhiteLinkManagerClass} from '../../manager/WhiteLinkManager/WhiteLinkManager';
import {guildMemberAdd} from '../../events/Guild/guildMemberAdd';

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
    this.on('messageCreate', (message) => messageCreate(message, this, this.prefixes));
    this.on('guildMemberAdd', (member) => guildMemberAdd(member));
  }

  private onReady = () => {
    console.log(`Logged in as ${this.user.tag}!`);
    WhiteLinkManagerClass.saveData(defaultWhiteLink);

    this.user.setStatus('idle');
    if (this.development) {
      this.user.setPresence({
        activities: [{
          name: 'update',
          type: 'PLAYING',
        }],
      });
    }
  }
}

export default App;
