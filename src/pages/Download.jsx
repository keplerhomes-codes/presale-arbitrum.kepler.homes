import { Link } from 'react-router-dom'
import './Download.scss'
export default ()=> {
  return (
      <div className='download-container p-b-200 scroll'>
         <Link to="/" className="logo-area p-t-52 p-l-69" style={{display: 'block'}}>
           <img src={require('../assets/images/home/logo.svg').default} alt="" />
         </Link>
         <div className='inner-container'>
           {/* download-btns */}
            <div className="download-area w100 flex flex-last flex-column">
               {/* <img className='area-bg' src={require('../assets/images/download/group.png')} alt="" width={913} height={679}/> */}
               <div className="big-title fz-80 cf">
                 KEPLER Games
               </div>
               <div className="second-title fz-40 cf fwb">
               Windows Client Download
               </div>
               <div className="fz-20 c06 fw400 p-t-20">
                 <span>
                 Version number：4.0.5.1123
                 </span>
                 <span className='m-l-70'>
                 Updated time: 2022.02.09
                 </span>
               </div>
               <div className="btn-areas flex p-t-83">
                  <div className="download-btn m-l-68 pointer"></div>
                  <div className="download-btn m-l-68 pointer"></div>
                  <div className="download-btn m-l-68 pointer"></div>
               </div>
            </div>

          {/* game description */}
          <div className="flex flex-center m-t-100">
            <img src={require('../assets/images/download/single.png')} alt="" width={429} height={676} />
            <div className="desc p-t-33 p-b-33 p-l-52 p-r-52">
              <div className="desc-title cf fz-36 fwb">Game Description</div>
              <div className="desc-text fz-16 c06 m-t-5">
              Your application uses a Amazon CloudFront as a CDN, which will speed 
              up page loads by making downloads faster and allowing for parallel 
              downloading by the client.Your application uses a Amazon CloudFront as 
              a CDN, which will speed <br />
              up page loads by making downloads faster and allowing for parallel 
              downloading by the client.Your application uses a Amazon CloudFront as 
              a CDN, which will speed up page loads by making downloads faster and 
              allowing for parallel downloading by the client.Your application uses a 
              Amazon CloudFront as a CDN, which will speed <br />
              up page loads by making downloads faster and allowing for parallel 
              downloading by the client.
              </div>

            </div>
         
          </div>
          {/* Basic configuration requirements */}
          <div className='table-wrap p-t-50'>
            
          <div className="cf fwb fz-36">Basic configuration requirements</div>
          <table className='cf fz-18 m-t-20 ta table' border="1px solid #fff" style={{width: '989px'}}>
            <thead>
              <tr>
                <td className='fwb' style={{width: '284px'}}>Configuration requirements</td>
                <td className='fwb'>Basic</td>
              </tr>
            </thead>
              
              
            <tbody>
              <tr>
                <td>CPU</td>
                <td>Intel-i5 processor</td>
              </tr>
              <tr>
                <td>RAM</td>
                <td>8GB and above</td>
              </tr>
              <tr>
                <td>Graphics card</td>
                <td>NVIDIA GTX760 or above and similar</td>
              </tr>
              
              <tr>
                <td>Resolution</td>
                <td>Desktop recommended 1920*1080  1600*900 recommended for laptops</td>
              </tr>
              
              <tr>
                <td>System</td>
                <td>Requires Win7 or above 64-bit operating system (32-bit operating system not supported) </td>
              </tr>
            </tbody>
          </table>

          </div>
         </div>
          
      </div>
  )
}