import React from "react";
import discord from '../../assets/images/home/discord-light.svg'
import github from '../../assets/images/home/github-light.svg'
import telegram from '../../assets/images/home/telegram-light.svg'
import twitter from '../../assets/images/home/twitter-light.svg'
import medium from '../../assets/images/home/medium-light.svg'
import youtube from '../../assets/images/home/youtube.svg'
import footerLogo from '../../assets/images/home/footer-logo.png'
import './Footer.scss'

function Footer() {
  return (
    <div data-scroll-section className="global-footer">
      <div className="container footer-content">
        <div className="footer-content-left">
          <img className="footer-logo" src={footerLogo} alt="" />
        </div>
        <div className="footer-content-right">
          <div className="footer-link">
            <div className="footer-link-group">
              <div className="footer-link-item cf">Market</div>
              <div className="footer-link-item cf">Tokenomics</div>
              <div className="footer-link-item cf">DAO</div>
              <div className="footer-link-item cf">Bridge</div>
            </div>
            <div className="footer-link-group">
              <div className="footer-link-item cf">User</div>
              <div className="footer-link-item cf">Farm</div>
              <div className="footer-link-item cf">FAQ</div>
              <a className="footer-link-item cf" href="https://docs.kepler.homes/" target="_blank">Docs</a>
            </div>
            <div className="footer-link-group">
              <div className="footer-link-item cf">Download</div>
              <div className="footer-link-item cf">PGC</div>
              <div className="footer-link-item cf">News</div>
              <div className="footer-link-item cf">Claim</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <div className="social-list">
          <a className="social-item" href="https://www.youtube.com/channel/UClN9tsN8atf0QHbRtUlX5aw" target="_blank"><img src={youtube} alt="" /></a>
          <a className="social-item"><img src={github} alt="" /></a>
          <a className="social-item" href="https://medium.com/@KeplerHomes" target="_blank"><img src={medium} alt="" /></a>
          <a className="social-item" href="https://twitter.com/KeplerHomes" target="_blank"><img src={twitter} alt="" /></a>
          <a className="social-item" href="https://discord.gg/keplerhomes" target="_blank"><img src={discord} alt="" /></a>
          <a className="social-item" href="https://t.me/KeplerHomes" target="_blank"><img src={telegram} alt="" /></a>
        </div>
        <div className="copyright cf m-t-20">Kepler © 2022, All rights reserved</div>
      </div>
    </div>
  )
}

export default Footer;
