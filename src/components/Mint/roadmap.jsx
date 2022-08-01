import { useState } from 'react'
import minttext from '../../lib/minttext'
import './roadmap.scss'
export default function () {
    let [active, setActive] = useState(0)
    return (
      <div className="road-map">
          <div className="btns">
              <span className={"cf btn-item pointer  fz-16 "+(active ? '':'active')} onClick={_=>setActive(0)}>Intend</span>
              <span className={"cf btn-item pointer  fz-16 "+(active ? 'active':'')} onClick={_=>setActive(1)}>Completed</span>
          </div>
          <div className="road-content">
              {
                  minttext['roadmap'][active ? 'completed': 'intend'].map((item, index) => {
                      return (
                        <div className="road-item flex">
                            <div className="fz-20 fwb cf road-time time-out">
                                {item.title}
                            </div>
                            <div className={"cf flex-1 road-text m-l-10 p-b-30 "+ (index == minttext['roadmap'][active ? 'completed': 'intend'].length -1 ? 'last-one':'')}>
                                    
                                    <div className="fz-16 fwb m-b-10 time-inner">{item.title}</div>
                                    {item.content}
                                    <div className="point flex flex-center flex-middle">
                                        {item.isCurrent ?<div className='heart'></div>:''}
                                    </div>
                                    {
                                    index ==0 ? <div className="first-black"></div>:''
                                    }
                            </div>
                        </div>
                      )
                  })
              }
          </div>
      </div>
    )

}

{/* <p>
<b>2021 Q3</b><br/><br/>
GameFi team building
Game story background written<br/>
Develop the economic models for the in the game ecosystem<br/>
Server-side architecture building<br/><br/>
<b>2021 Q4</b><br/><br/>
Kepler WebSite build<br/>
Multi-chain wallet, account and asset system construction<br/>
NFT Marketplace, Farm, Cross-chain and other application modules build<br/>
Client-side and server-side architecture <br/>
Casting the first batch of in-game NFTs<br/>
Game character art design<br/>
Game scene design and construction<br/><br/>
<b>2022 Q1</b><br/><br/>
Build the DAO, Community and other governance modules<br/>
Static rendering of characters and rendering of different presentation styles <br/>
Development of character attribute functions<br/>
Development of game weapons, equipment, fashion and other items and accessories<br/>
Development of the game's combat system and skills<br/>
Recruitment of volunteers for in-game testing and the start of in-game testing<br/><br/>
<b>2022 Q2</b><br/><br/>
Complete the first batch of NFT sales<br/>
Complete the design and development of NPC and scene related functions<br/>
Completion of the KEPL Token release (Private and Public) and listing on the Dex<br/>
Build PGC (art experts content creation) module <br/>
Lands for sale module built<br/>
Complete the design and development of NPCs and in game scenarios<br/>
Development of the game's homepage interface<br/>
Complete the development of the quest system<br/>
Release of the first public beta version of the game (Windows version)<br/><br/>
<b>2022 Q3</b><br/><br/>
Release the first batches of NFTs for Lands<br/>
Optimisation of Website applications and community governance modules in line with the game's progress<br/>
Complete the development of the first instance zone of the game<br/>
Release of the official Windows V1 version of the game<br/><br/>
<b>2022 Q4</b><br/><br/>
List the KEPL Token on CEXes<br/>
Complete the Development of further instance zones of the game<br/>
Release of the first official MACOS V1 version of the game<br/>
Iterate the game, releasing an updated Windows version<br/>
PGC (art experts creating content) module building<br/>
Release of the official Windows V2 version of the game<br/>
</p> */}