

export default [
    { 
       name: 'Telegram',
       icon : require('../assets/images/white/telegram.svg').default,
       text: <span>Join our official Kepler.homes Telegram <a target="_blank" href="https://t.me/KeplerHomes">Kepler.homes</a> Telegram</span>,
       input: 'telegram',
       value: 'telegram',
       width: 395,
       placeholder: 'Your Telegram account',
       message: 'Please Input Your Correct Telegram Account'
    },
    {
        name: 'Discord',
        icon : require('../assets/images/white/discord.svg').default,
        text: <span>Join our <a href="https://discord.gg/keplerhomes" target="_blank">discord server</a> , What is your full Discord username (including your #number)?</span>,
        width: 395,
        input: 'discord',
        value: 'discord',
        placeholder: 'Your Discord account',
        message: 'Please Input Your Correct Discord Account'
     },
     {
         name: 'Twitter',
         icon : require('../assets/images/white/twitter.svg').default,
         text: <span>Follow the official Kepler.homes Twitter account <a target="_blank" href="https://twitter.com/KeplerHomes">@KeplerHomes</a></span>,
         width: 395,
         input: 'twitter',
         value: 'twitter',
         placeholder: 'Your Twitter account',
         message: 'Please Input Your Correct Twitter Account',
         useCheck: true
      },
      {
          name: 'Like & Retweet',
          value: 'link',
          icon : require('../assets/images/white/retweet.svg').default,
          text: <span>Like & Retweet this Airdrop campaign post pinned on our Twitter and tag 5 friends</span>,
          useCheck: true
       },
   //    {
   //      name: 'Youtube',
   //      icon : require('../assets/images/white/youtube.svg').default,
   //      text: <span>Subscribe to Kepler's YouTube account and leave your YouTube account</span>,
   //       width: 395,
   //      input: 'youtube',
   //      placeholder: 'Your Youtube account',
   //      message: 'Please Input Your Correct Youtube Account'
   //   },
   //   {
   //     name: 'address',
   //     icon : require('../assets/images/white/erc20.svg').default,
   //     width: 500,
   //     input: 'ERC20',
   //     placeholder: 'Please enter the ERC20 wallet address',
   //     message: 'Please bind your ERC20 wallet address'
   //  },
]