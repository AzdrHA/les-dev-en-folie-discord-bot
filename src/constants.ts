export const defaultWhiteLink: string[] = ['https://www.youtube.com', 'https://developer.mozilla.org', 'https://stackoverflow.com',
  'https://github.com', 'https://gitlab.com', 'https://www.gitkraken.com', 'https://www.docker.com', 'https://reactjs.org',
  'https://fr.reactjs.org', 'https://vuejs.org', 'https://angular.io', 'https://nuxtjs.org', 'https://nextjs.org',
  'https://nestjs.com', 'https://www.wikipedia.org', 'https://fr.wikipedia.org', 'https://www.flaticon.com',
  'https://imgbin.com', 'https://www.figma.com', 'https://app.diagrams.net', 'https://draw.io', 'https://getbootstrap.com',
  'https://get.foundation', 'https://tailwindcss.com', 'https://materializecss.com', 'https://getmdl.io', 'https://bulma.io',
  'http://getskeleton.com', 'https://semantic-ui.com', 'https://purecss.io', 'https://getuikit.com', 'https://www.drupal.org',
  'https://www.drupal.fr', 'https://symfony.com', 'https://getcomposer.org', 'https://sylius.com', 'https://www.php.net',
  'https://www.google.com', 'https://tenor.com', 'https://discord.com',
];

export const discordWhiteList: string[] = ['896803623886028900', '779076217877561402'];

export const regexLink: RegExp = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi;
