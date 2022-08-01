import './Banner.scss'
import { Carousel } from 'antd';
import { useEffect, useRef, useState} from 'react';
import bannerpc from '../../assets/images/market/banner.png'
import bannermini from '../../assets/images/market/banner-mini.png'
import { get } from '../../http';
export default function () {
    const banner = useRef(null)
    // const list = [
    //   {
    //     src: bannerpc,
    //     src_mini: bannermini,
    //     title: 'Destination of the Kepler Galaxy',
    //     desc: '2021-12-30 1:00 PM (UTC) '
    //   },
    //   {
    //     src: bannerpc,
    //     src_mini: bannermini,
    //     title: 'Destination of the Kepler Galaxy',
    //     desc: '2021-12-30 1:00 PM (UTC) '
    //   }
    // ]
    let [list, setList] = useState([])
    useEffect(()=> {
      get('/api/banners', {
        limit: 10,
        skip: 0,
        t: 1
      }).then(res => {
        console.log(res)
         setList(res.data.banners)
      })
    }, [])
    return (
      <div className='banner w100'>
        <Carousel ref={banner} autoplay duration={4000}>
          {
            list.map((item, i) => {
              return (
                <div className='banner-item' key={i}>
                  <img src={item.banner} className="show-p" alt="" />
                  <img src={item.bannerMini}  className="show-m" alt="" />
                  <div className="desc">
                    <div className="title cf">
                      {item.title}
                    </div>
                    <div className="text cf">
                        {item.updatedAt}
                    </div>
                  </div>
                </div>
              )
            })
          }
        </Carousel>
        {/* <img className='point prev' onClick={()=> {banner.current.prev()}} src={require('../../assets/images/base/next.svg').default} alt="" />
        <img className='point next' onClick={()=> {banner.current.next()}} src={require('../../assets/images/base/next.svg').default} alt="" /> */}

      </div>
    )
}