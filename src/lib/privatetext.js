import { fromUnit } from "./util"

    
let pretext = (props) => {
    return {"highlights": [
        <span><span className="fwb">Original IP from the Kepler team.</span> <br/>The story of the Kepler galaxy is very sustainable with more scope for Kepler to follow on top of the RPG basic gameplay.</span>,
        <span><span className="fwb">Well-designed quest and grind paths plus fantastic HD visual graphics. </span> <br/>As positioned itself as an AAA level 3D Sci-Fi MMORPG, Kepler pursues the ultimate immersive game-playing experience.</span>,
        <span><span className="fwb">Dual-currency tokenomics.</span> <br/> By implementing a dual-currency mechanism, Kepler could balance the players’ entertainment needs and play-to-earn needs at a golden section ratio.</span> ,
        <span><span className="fwb">Multi-chains asset transformation. </span> <br/>Players can trade and transfer their game assets with no technical restrictions between EVM chains, such as ETH, and non-EVM chains, such like Aptos.</span> ,
        <span><span className="fwb">Non-stop superior game contents and features.</span>  <br/>Three characters and two maps are supported in the beta version game and more superior features will be added in later versions.</span> 
    ],
    "presale rules": [
        "500K USD will be raised through 10 rounds KEPL token presale activities.",
        "The KEPL token price is $0.0293 in the first round and will get an additional 2% increase in the following nine rounds.",
        "The KEPL purchased in the pre-sale have a default lock-up period of 12 months and will be released in 1/12 monthly batches.Depending on the amount of KEPL bought by the user, veKEPL(1:1) would be deposited into the user's wallet as soon as the purchase is made and the veKEPL token would be burned each month after IDO when the user unlocks the KEPL token. veKEPL tokens are short for voting-escrow KEPL, which gives the user the ability to conduct governance & receive dividends from our marketplace profit. The longer the locking period is, the more dividends will be received for the veKEPL holder. Details of veKEPL can be found in the page.",
        `The minimum pre-sale purchase is $${fromUnit(props.presaleConfig.minBuyAmount)}. Holders whose KEPL asset is over $${fromUnit(props.presaleConfig.refeererMinBuyAmount)} could get a referral bonus by inviting others to participate in the presale.`,
        "The exchange ratio of Arbitrum Token and ETH participating in the Presale is an exchange relationship that estimates the dynamic changes of the Chainlink oracle machine, and is consistent with the minimum and maximum participation amounts equivalent to USDT and USDC."
    ],
    "benefits": [
        "KEPL holders can lock their tokens into the vote escrow contract to receive veKEPL.",
        "Vote-locking allows veKEPL holders to vote in governance, and receive part of earnings of the Kepler NFT marketplace as dividends.",
        "The longer KEPL tokens are locked for, the more dividends received."
    ],
    "faq": [
        {
            "q": "What is KEPL presale?",
            "a": "KEPL presale is a fair token launch for all participants, no matter individuals or institutions. 500K USD will be raised through 10 rounds presale activities. All KEPL tokens are sold on a first come, first serve basis."
        },
        
        {
            "q": "What is veKEPL?",
            "a": <span>
                veKEPL denotes voting-escrow KEPL.It is a non-transferable implementation, used to determine each account’s voting power and earning power. veKEPL is a token that is issued upon the locking of KEPL tokens in the vote escrow smart contract. The amount of veKEPL received in exchange for KEPL tokens is only dependent on the lock amount.
<br/>
For example, user A bought $1000 worth of KEPL token ($1000 would give the user in total $1000/$0.0293 = 34129 KEPL tokens) in the first round of presale and default 12 months as the locking period. 34129 veKEPL tokens and 0 KEPL token will be deposited into the user’s wallet as soon as the purchase is complete. After IDO each month the user can unlock 1/12 of the total KEPL token, which is about 34129/12 = 2849 number of tokens. After 12 months, all KEPL tokens would be unlocked. Everytime the user chooses to claim the unlocked KEPL token, same number of veKEPL tokens would be burned to convert to the KEPL token.
</span>
        },
        
        {
            "q": "What is the difference between KEPL, PreKEPL, and veKEPL?",
            "a": <span>
                KEPL is the governance token and it has the voting power.<br/>
                PreKEPL is the airdrop token which can be swapped to KEPL at an exchange rate in IDO. <br/>
                veKEPL is the token received by locking KEPL in the vote escrow smart contract. It cannot be transferred or exchanged, but it can be used to vote and receive dividends.
            </span>
        },
        
        {
            "q": "Are there any limitations on how many KEPL token I can buy?",
            "a": `In presale, the minimum subscription is $${fromUnit(props.presaleConfig.minBuyAmount)} for a wallet address, and the maximum is $${fromUnit(props.presaleConfig.maxBuyAmount)}.`
        },
        {
            "q": "Am I allowed to participate more than one round?",
            "a": "Of course."
        },
        {
            "q": "Am I must to lock my KEPL tokens?",
            "a": "The KEPL purchased in the pre-sale have a default lock-up period of 12 months and will be released in 1/12 monthly batches.This is for KEPL to have a good performance in the long run."
        },
        {
            "q": "How does dividends are allocated and distributed?",
            "a": "Part of earnings of the Kepler NFT marketplace are allocated as dividends. veKEPL holders will receive the distributed dividends once the marketplace has started turning a profit."
        },
        {
            "q": "What is the referral bonus?",
            "a": <span>All KEPL or veKEPL token holders are recommended to share an invitation link to their friends. <br/>
            Holders whose KEPL asset is over ${fromUnit(props.presaleConfig.refeererMinBuyAmount)} could get 5% of their friend's purchase amount as a referral bonus.
            </span>
        },
        {
            "q": "What are the unlocking rules?",
            "a": "After starting to claim, release once a month. The release quantity is equal to the purchase quantity divided by the locked months"
        }
    ]}}
    export default pretext