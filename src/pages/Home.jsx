import React, { useState, useEffect, useRef } from 'react';
import './Home.scss';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.min.css'


import iconWin from '../assets/images/home/icon-windows.svg'
import iconMac from '../assets/images/home/icon-mac.svg'
import Grid from '../components/Grid'
import classnames from 'classnames'
import play from '../assets/images/home/play.png'
import playCircle from '../assets/images/home/play-circle.png'
import bg1 from '../assets/images/home/bg1.png'
import bg2 from '../assets/images/home/bg2.png'
import bg3 from '../assets/images/home/bg3.png'
import about1 from '../assets/images/home/about1.png'
import about2 from '../assets/images/home/about2.png'
import about3 from '../assets/images/home/about3.png'
import features from '../assets/images/home/features.png'
import news1 from '../assets/images/home/news1.png'
import news2 from '../assets/images/home/news2.png'
import news3 from '../assets/images/home/news3.png'
import news4 from '../assets/images/home/news4.png'
import characters1 from '../assets/images/home/characters1.png'
import characters2 from '../assets/images/home/characters2.png'
import characters3 from '../assets/images/home/characters3.png'
import charactersActive from '../assets/images/home/characters-active.png'
import man1 from '../assets/images/home/man1.png'
import man2 from '../assets/images/home/man2.png'
import man3 from '../assets/images/home/man3.png'
import aboutVideo from '../assets/about.mp4'
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Header from '../components/layouts/Header'
import Footer from '../components/layouts/Footer'
import {post} from '../http'
import notification from '../components/notification'
import {Input, Button} from 'antd'
import {useTranslation} from 'react-i18next'
import { NavLink } from 'react-router-dom';
import roadmap from '../lib/roadmap';

function Home() {
  const page = useRef()
  const playDom = useRef()
  const [roadmapIndex, setRoadmapIndex] = useState(0)
  const [jobIndex, setJobIndex] = useState(0)
  const [isPalyShow, setIsPlayShow] = useState(false)
  const [hasBg, setHasBg] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  let { t ,i18n} = useTranslation()

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: page.current,
      smooth: true
    });

    scroll.on('scroll', (args) => {
      setHasBg(args.scroll.y > 0)
      // Get all current elements : args.currentElements
      // console.log(args.currentElements)
      // if(typeof args.currentElements['intro'] === 'object') {
      //   setIsPlayShow(true)
      // } else {
      //   setIsPlayShow(false)
      // }
    });

    var box = document.getElementById("box");
    //绑定鼠标移动事件
    document.onmousemove = function(event){
      /*获取到鼠标的坐标 */
      var left = event.clientX;
      var top = event.clientY;
      //设置div的偏移量
      // playDom.current.style.transform = `translate(${left - 150}px, ${top - 150}px)`;
    };
    
    console.log(window.innerWidth)

    document.querySelector('.about-video').play()


    return () => {

    }
  }, [])

  const jobMap = [
    {
      name: "WARRIOR",
      occupation: "MELEE OCCUPATION",
      desc: "Carrying a large sword, physically strong, good at close combat and pulling each other together, they are the main vanguard of the team. Gutsy is good at using physical attacks to inflict damage on hostile targets. To face Gutsy, you will need to improve your own physical armor to fight against them."
    },
    {
      name: "SHOOTER",
      occupation: "REMOTE OCCUPATION",
      desc: "Armed with a variety of guns and ammunition, with outstanding eyesight and concealment abilities, the gunman has the skill to inflict a fatal blow on an enemy at a critical moment. Gunmen are more adept at using blast attacks to inflict damage on hostile targets. When facing a gunman, you need to increase your blast armor to fight against him."
    },
    {
      name: "INVOKER",
      occupation: "REMOTE OCCUPATION",
      desc: "The Magic Guide uses the back of the conduction core to absorb the surrounding natural energy. They use the conduction cane in different ways to cast a variety of energy attacks. They are especially good at dealing with a variety of unexpected situations, and are usually the brains of the team. Magic guides are good at using energy attacks to cause damage to hostile targets. Facing the magic guide, you need to improve your own energy armor to fight with."
    },
  ]

  const handleRegister = () => {
    setIsLoading(true)
    post('/api/community/subscribe', {
      email,
    }).then(res => {
      setIsLoading(false)
      notification.success({
        message: t('Success'),
      });
    }).catch(err => {
      setIsLoading(false)
      notification.error({
        message: t('Fail'),
      });
    })
  }

  return (
    <div ref={page} data-scroll-container className="Home">
      <Grid />
      <div ref={playDom} className={classnames('play', {"show": isPalyShow})}>
        <img className="play-circle" src={playCircle} />
        <img className="btn-play" src={play} />
      </div>
      <Header hasBg={hasBg} />
      
      <main>
        <div className="intro">
          <div data-scroll-section className="intro-front intro-title layer-front" data-scroll data-scroll-id="intro" >
            <div className="intro-title-main">
              <div>Welcome to</div>
              <div>Kepler Homes</div>
            </div>
            <div className="intro-title-sub">Play, Earn and Trade in the blockchain based NFT Game owned by players.</div>
            {/* <div > */}
              <NavLink to="/download" className="btn-group">
              <div className="btn-for-win"><img src={iconWin} alt="" /><div className="flex flex-column"><div>For Windows</div><div className="comingsoon">Coming soon</div></div></div>
              <div className="btn-for-mac"><img src={iconMac} alt="" /><div className="flex flex-column"><div>For Mac</div><div className="comingsoon">Coming soon</div></div></div>
              </NavLink>
              
            {/* </div> */}
          </div>
          <div className="intro-back layer-back" data-scroll-section>
            <div className="intro-bg__picture" data-scroll data-scroll-speed="-2">
              <img src={bg1} alt="" />
              <div className="intro-bottom"></div>
            </div>
          </div>
          <div data-scroll-section className="intro-scroll layer-front"><span className="intro-scroll__track"></span><span className="intro-scroll__bar"></span><span className="intro-scroll__arrow"></span></div>
        </div>

        <div className="about">
          <div className="about-front layer-front" data-scroll-section>
            <div className="about-item">
              <div className="about-item-left">
                <div className="about-item__picture bracket-wrap">
                  <img src={about1} alt="" />
                  <div className="bracket">
                    <div className="bracket-tl"></div>
                    <div className="bracket-tr"></div>
                    <div className="bracket-br"></div>
                    <div className="bracket-bl"></div>
                  </div>
                </div>
              </div>
              <div className="about-item-right">
                <h3>Project “Adam”</h3>
                <p>In 2113, the Earth's resources are being depleted at a speed visible to the naked eye. The human race has less than a hundred years left to survive on Earth. Escaping from Earth and flying to outer space has become the only hope for human survival. The "Adam Project" was born in this context.</p>
                <p>After the failure of the first Adam Project due to problems with the "atmospheric environment generation equipment" all teams were lost in the second Adam program. In 2170, the third Adam project launched, with the destination of the Kepler Galaxy.</p>
              </div>
            </div>
            <div className="about-item">
              <div className="about-item-left">
                <h3>Titania</h3>
                <p>In the Third Adam Project, Titania, the mothership, leaves for the target planet with the rest of the fleet.</p>
                <p>After six months of travel, the Armada finally approaches its destination: Kepler-22b.</p>
                <p>The advanced units, including Zeus II, would first land on the planet to explore and set up camps. During the landing process, the advance party was disturbed by an ion storm, and the fleet was scattered, each forced to land in a different area.</p>
              </div>
              <div className="about-item-right">
                <div className="about-item__picture bracket-wrap">
                  <img src={about2} alt="" />
                  <div className="bracket">
                    <div className="bracket-tl"></div>
                    <div className="bracket-tr"></div>
                    <div className="bracket-br"></div>
                    <div className="bracket-bl"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-item">
              <div className="about-item-left">
                <div className="about-item__video bracket-wrap">
                  {/* <img src={about3} alt="" /> */}

                  <video className="about-video" playsinline loop autoplay muted src={aboutVideo}></video>
                  <div className="bracket">
                    <div className="bracket-tl"></div>
                    <div className="bracket-tr"></div>
                    <div className="bracket-br"></div>
                    <div className="bracket-bl"></div>
                  </div>
                </div>
              </div>
              <div className="about-item-right">
                <h3>Spring Action</h3>
                <p>The player is a member of the Zeus II fleet. After a forced landing in the wilderness, contact with the mothership Titania is restored. Unfortunately, the signal is unstable and often disconnected.</p>
                <p>Scientists assess that it may be related to the ion storm that the advance team encountered during their landing. The Titanian Fleet senior management immediately developed the "Spring Action" plan.</p>
                <p>The advanced units need to find a way to make the mothership and the rest of the fleet land safely.</p>

                <p className="m-t-50">Destination: The Kepler Galaxy</p>
              </div>
            </div>
          </div>
          <div className="about-back layer-back" data-scroll-section>
            <div className="planet__picture" data-scroll data-scroll-speed="-2">
              <img src={bg2} alt="" />
              <div className="planet-top"></div>
              <div className="planet-bottom"></div>
            </div>
          </div>
          
        </div>

        <div data-scroll-section className="characters">
          <div className="characters-title">CHARACTERS</div>
          <div className="characters-swiper-container">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={window.innerWidth >= 768 ? 60 : 11}
              slidesPerView={3}
              onSlideChange={(swiper) => {
                setJobIndex(swiper.realIndex)
              }}
              onSwiper={(swiper) => console.log(swiper)}
              loop
              centeredSlides={true}
            >
              <SwiperSlide>
                <div className="characters-item">
                  <img className="characters-item-image characters-item-image1" src={characters1} alt="" />
                  <img className="characters-item-active" src={charactersActive} alt="" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
              <div className="characters-item">
                  <img className="characters-item-image characters-item-image2" src={characters2} alt="" />
                  <img className="characters-item-active" src={charactersActive} alt="" />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="characters-item">
                  <img className="characters-item-image characters-item-image3" src={characters3} alt="" />
                  <img className="characters-item-active" src={charactersActive} alt="" />
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        

        <div data-scroll-section className="warrior">
          <div className="warrior-left">
            <img src={man1} alt="" style={{"display": jobIndex === 0 ? "block" : "none"}} />
            <img src={man2} alt="" style={{"display": jobIndex === 1 ? "block" : "none"}} />
            <img src={man3} alt="" style={{"display": jobIndex === 2 ? "block" : "none"}} />
          </div>
          <div className="warrior-right">
            <div className="warrior-right-title">
              <p>{jobMap[jobIndex].name}</p>
              <p>{jobMap[jobIndex].occupation}</p>
            </div>
            <div className="warrior-right-content">{jobMap[jobIndex].desc}</div>
          </div>
        </div>

        <div className="bg-wrapper">
          <div className="layer-front">
            <div data-scroll-section className="features">
              <div className="features-title">FEATURES</div>
              <div className="features-picture">
                <img className="features-picture__image" src={features} alt="" />
              </div>
              <div className="features-circle -circle01">
                <div className="features-circle__line"></div>
              </div>
              <div className="features-circle -circle02">
                <div className="features-circle__line"></div>
              </div>
              <div className="features-circle -circle03">
                <div className="features-circle__line"></div>
              </div>
              <div className="features-item -item01">
                <div className="features-item-title">Cross-chain</div>
                <div className="features-item-desc">The currencies and props in the game will be mapped on four different chains, ETH, BSC, AVAX and SOL. By becoming tokens and NFT assets on different chains; they can be transferred between each chain using cross-chain technology through bridges.</div>
              </div>
              <div className="features-item -item02">
                <div className="features-item-title">Macro World View</div>
                <div className="features-item-desc">Based on universe exploration as a background, the Kepler game will open different styles of maps and gameplay one after another, this will have new game experiences, and sustainability.</div>
              </div>
              <div className="features-item -item03">
                <div className="features-item-title">Sandbox Game</div>
                <div className="features-item-desc">Players can freely choose the direction they want,and can decide the plot and story line,and can participate in the making of the game by submitting their own designs for items or enemies or looks or stories that will be voted to adde to the game.</div>
              </div>
            </div>

            <div data-scroll-section className="roadmap">
              <div className="container roadmap-front">
                <div className="roadmap-title">ROADMAP</div>
                <div className="roadmap-title-sub">This timeline details our funding and development goals.</div>
                <div className="roadmap-timeline">
                  <div className="roadmap-timeline-date-list">
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 0})} onMouseOver={_ => setRoadmapIndex(0)}>2021 Q3</div>
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 1})} onMouseOver={_ => setRoadmapIndex(1)}>2021 Q4</div>
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 2})} onMouseOver={_ => setRoadmapIndex(2)}>2022 Q1</div>
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 3})} onMouseOver={_ => setRoadmapIndex(3)}>2022 Q2</div>
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 4})} onMouseOver={_ => setRoadmapIndex(4)}>2022 Q3</div>
                    <div className={classnames("roadmap-timeline-date-item", {"active": roadmapIndex === 5})} onMouseOver={_ => setRoadmapIndex(5)}>2022 Q4</div>
                  </div>
                  <div className="roadmap-timeline-swiper-container">
                    <Swiper
                      modules={[Navigation]}
                      navigation
                      onSlideChange={(swiper) => {
                        setRoadmapIndex(swiper.realIndex)
                      }}
                      onSwiper={(swiper) => console.log(swiper)}
                      loop
                    >
                      {
                        roadmap.map(item => {
                          return (
                            <SwiperSlide key={item.name}>
                              <div className="roadmap-timeline-date-item">{item.name}</div>
                            </SwiperSlide>
                          )
                        })
                      }
                    </Swiper>
                  </div>
                  <div className="roadmap-timeline-content">
                    {
                       roadmap.map((item, index) => {
                        return (
                          <div key={index} style={{display: roadmapIndex == index ? 'block' : 'none' }}>
                          {item.content}
                        </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>

            <div data-scroll-section className="gallery">
                <div className="gallery__list">
                  <a className="gallery__list-item" href="https://twitter.com/KeplerHomes/status/1492854341551603714" target="_blank">
                    <div className="gallery__list-picture bracket-wrap" data-scroll=""><img className="gallery__list-picture__image" src={news1} alt=""/>
                      <div className="bracket">
                        <div className="bracket-tl"></div>
                        <div className="bracket-tr"></div>
                        <div className="bracket-br"></div>
                        <div className="bracket-bl"></div>
                      </div>
                    </div>
                    <div className="gallery__list-info">
                      <p className="gallery__list-info__text">Welcome to the world of #Kepler</p>
                      <p className="gallery__list-info__date">2022-02-13</p>
                    </div>
                  </a>
                  <a className="gallery__list-item" href="https://twitter.com/KeplerHomes/status/1493141715527421956" target="_blank">
                    <div className="gallery__list-picture bracket-wrap" data-scroll=""><img className="gallery__list-picture__image" src={news2} alt=""/>
                      <div className="bracket">
                        <div className="bracket-tl"></div>
                        <div className="bracket-tr"></div>
                        <div className="bracket-br"></div>
                        <div className="bracket-bl"></div>
                      </div>
                    </div>
                    <div className="gallery__list-info">
                      <p className="gallery__list-info__text">Project “Adam”-01</p>
                      <p className="gallery__list-info__date">2022-02-14</p>
                    </div>
                  </a>
                  <a className="gallery__list-item" href="https://twitter.com/KeplerHomes/status/1493852328750764033" target="_blank">
                    <div className="gallery__list-picture bracket-wrap" data-scroll=""><img className="gallery__list-picture__image" src={news3} alt=""/>
                      <div className="bracket">
                        <div className="bracket-tl"></div>
                        <div className="bracket-tr"></div>
                        <div className="bracket-br"></div>
                        <div className="bracket-bl"></div>
                      </div>
                    </div>
                    <div className="gallery__list-info">
                      <p className="gallery__list-info__text">Project “Adam”-02</p>
                      <p className="gallery__list-info__date">2022-02-16</p>
                    </div>
                  </a>
                  <a className="gallery__list-item" href="https://twitter.com/KeplerHomes/status/1494188916462608385" target="_blank">
                    <div className="gallery__list-picture bracket-wrap" data-scroll=""><img className="gallery__list-picture__image" src={news4} alt=""/>
                      <div className="bracket">
                        <div className="bracket-tl"></div>
                        <div className="bracket-tr"></div>
                        <div className="bracket-br"></div>
                        <div className="bracket-bl"></div>
                      </div>
                    </div>
                    <div className="gallery__list-info">
                      <p className="gallery__list-info__text">KeplerHomes #Gamefi Oasis #1</p>
                      <p className="gallery__list-info__date">2022-02-17</p>
                    </div>
                  </a>
                </div>
            </div>
          </div>

          <div className="bg-back layer-back" data-scroll-section>
            <div className="planet__picture" data-scroll data-scroll-speed="-2">
              <img src={bg3} alt="" />
              <div className="planet-top"></div>
              <div className="planet-bottom"></div>
            </div>
          </div>
        </div>

        <div data-scroll-section className="register-email">
          <div className="register-email-title">
            <div>Are you ready</div>
            <div>to start your mission?</div>
          </div>
          <div className="register-email-input">
            <Input type="text" placeholder="Email Address" onChange={e => setEmail(e.target.value)}/>
            <Button className="btn-register" onClick={_ => handleRegister()}>REGISTER</Button>
          </div>
        </div>
      
      
      </main>
      <Footer />
    </div>
  );
}

export default Home;
