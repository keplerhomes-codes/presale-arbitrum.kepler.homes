import './Faq.scss'
import { useEffect, useState} from 'react'
import { Collapse, Space, Tabs, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import arrow from '../../assets/images/faq/arrow.svg'
import classNames from 'classnames';
import { get } from '../../http';

const { Panel } = Collapse;

const { TabPane } = Tabs;
const faqtext = [
  {
    q: 'What is a Kepler Mystery Box?',
    a: 'The items in the Mystery Box are the Kepler game prop NFTs. There are 5 types of Mystery Boxes that will appear with 5 types of props: Battle Armors, Fashions, Weapons, Pets and Accessories. Different types of mystery boxes are sold at different prices, look different and open different props NFT.'
  },
  {
    q: 'Who can mint the Mystery Box?',
    a: 'Two kinds of users: Whitelist users and Regular users. Whitelisted users have priority and can mint in advance. Regular users can only purchase after whitelisting.'
  },
  {
    q: 'When can I buy the Mystery Box?',
    a: 'The sale will take place in multiple sessions.Stay tuned for our official announcement.'
  },
  {
    q: 'How to open the Mystery Box?',
    a: 'You can open in MYNFT after minting a mystery box and get the NFT immediately.'
  },
  {
    q: 'What can I do with the Kepler NFT?',
    a: 'You can use them as the props in the game, they have many use values in the MMORPG game. You can stake or rent to get earnings. There are also many other values waiting for you to explore!'
  },
  {
    q: 'Is there a Whitelist?',
    a: 'Yes! Secure a spot on our Whitelist to make sure you get a priority and can purchase in advance. Check our Whitelist system here: <a href="https://kepler.homes/nft-whitelist" class="ce">kepler.homes/nft-whitelist.</a>'
  },
  {
    q: 'How much does it cost to mint a Mystery Box?',
    a: 'Minting prices will be announced soon.'
  },
  {
    q: 'Where can I see my Kepler NFT after minting it?',
    a: 'Once you’ve successfully minted a Kepler NFT, you can view it in the Market or by connecting it to your OpenSea wallet .'
  },
  {
    q: 'What blockchain are the Kepler NFTs on?',
    a: 'Ethereum firstly, then other multi-chains.'
  }
]
export default function () {

  return (
    <div className="faq-tab">
      <div className="faq-content">
      <Space direction="vertical" size={20}>
      {
                         faqtext.map((item, index)=>{
                             return (
                              <Collapse key={index} expandIcon={() => <img src={arrow} alt="" className="arrow" />} expandIconPosition="right">
                                <Panel header={item.q}>
                                  <p dangerouslySetInnerHTML={{__html: item.a}}></p>
                                </Panel>
                              </Collapse>
                             )
                         })
                      }
        </Space>
      </div>
    </div>
  )
}