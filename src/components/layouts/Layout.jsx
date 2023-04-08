import './Layout.scss'
import React from "react";
import { useLocation } from 'react-router-dom'
function Layout(props) {
  
  let {pathname} = useLocation()
  return (<>
   {
     props.children
   }
  </>)
}

export default Layout;
