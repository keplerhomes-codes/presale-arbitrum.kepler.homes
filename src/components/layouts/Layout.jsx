import './Layout.scss'
import React from "react";
import Header from './Navbar'
import Footer from './Footer'
import Menu from './Menu'
import { useLocation } from 'react-router-dom'
function Layout(props) {
  
  let {pathname} = useLocation()
  return (<>
   {
     (pathname == '/' 
     || pathname == '/download'
     || pathname == '/nft-whitelist'
     || pathname == '/nft-mint'
     || pathname == '/nft-mint-test'
     || pathname == '/airdrop'
     || pathname == '/airdrop/claim'
     )
      ? props.children:(
       <div className='w100 bkg'>
       <Header/>
       <div className="flex w100 wrap scroll">
          <Menu/>
          <div className="content flex-1 flex flex-column flex-between">
             {props.children}
             <div className="show-m">
                <Footer/>
             </div>
            
          </div>

       </div>
       </div>
     )
   }
  </>)
}

export default Layout;
