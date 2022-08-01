import './Pagination.scss'
import {useState} from 'react'
import { useEffect } from 'react'
export default function (
    {
        total,
        limit,
        currentpage,
        pageChange
    }
) {
    let [page, setPage] = useState(currentpage)
    useEffect(()=>{
        pageChange(page)
    },[page])
    return (
        <div className='flex flex-center m-l-20 show-p'>
        <div className='pagination normal flex flex-center flex-around'>
           <div className="arrow flex flex-center flex-middle flex-1 pointer" onClick={_=> {setPage(page <=1?1:page-1)}}>
                <img src={require('../../assets/images/base/arrow-left.svg').default} alt="" />
           </div>
            <div className="fz-16 cf">
                {page}
            </div>
            <div className="arrow flex flex-center flex-middle flex-1 pointer" onClick={_=> {setPage(page >=Math.ceil(total/limit)?Math.ceil(total/limit):page+1)}}>
                <img src={require('../../assets/images/base/arrow-right.svg').default} alt="" />
            </div>
        </div>
        <span className='fz-16 c56 m-l-20'>
          Total Page {Math.ceil(total/limit)}
        </span>
        </div>
    )
}