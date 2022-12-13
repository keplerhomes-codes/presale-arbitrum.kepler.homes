import React from "react";
import discord from '../../assets/images/home/discord-light.svg'
import github from '../../assets/images/home/github-light.svg'
import telegram from '../../assets/images/home/telegram-light.svg'
import twitter from '../../assets/images/home/twitter-light.svg'
import medium from '../../assets/images/home/medium-light.svg'
import youtube from '../../assets/images/home/youtube.svg'
import footerLogo from '../../assets/images/home/footer-logo.png'
import Logo from '../../assets/images/home/logo.svg'
import './Mintfooter.scss'

function Footer() {
  return (
    <div data-scroll-section className="mint-footer m-t-10">
      <div className="footer-content">
      <div className="footer-content-left">
          <img className="footer-logo logo-l" src={Logo} alt="" />
        </div>
      <div className="footer-bottom flex-1">
        <div className="social-list">
          <a className="social-item" href="https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw" target="_blank"><img src={youtube} alt="" /></a>
          <a className="social-item" href="https://github.com/kepler-homes/"><img src={github} alt="" /></a>
          <a className="social-item" href="https://medium.com/@KeplerHomes" target="_blank"><img src={medium} alt="" /></a>
          <a className="social-item" href="https://twitter.com/KeplerHomes" target="_blank"><img src={twitter} alt="" /></a>
          <a className="social-item" href="https://discord.gg/keplerhomes" target="_blank"><img src={discord} alt="" /></a>
          <a className="social-item" href="https://t.me/KeplerHomes" target="_blank"><img src={telegram} alt="" /></a>
        </div>
      </div>
        <div className="footer-content-left">
          <img className="footer-logo logo-w" src={Logo} alt="" />
        </div>
        <div className="footer-content-right  flex-1 flex flex-column flex-end">
            <div className="footer-link-group flex">
              <a className="footer-link-item cf p-r-20" target="_blank" href="https://kepler.homes">Home</a>
              <a className="footer-link-item cf bl p-l-20 p-r-20" target="_blank" href="https://docs.kepler.homes/">Docs</a>
              <a className="footer-link-item cf bl p-l-20" target="_blank" href="https://kepler.homes/faq">FAQ</a>
            </div>
            <div className="copyright cf">Kepler © 2022, All rights reserved</div>
        </div>
      </div>
    </div>
  )
}

export default Footer;
