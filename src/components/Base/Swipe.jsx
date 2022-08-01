import { useEffect, useState, useRef} from 'react'
import './Swipe.scss'
export default function ({images, onChange}) {
    console.log(images)
    let [imgs, setImages] = useState(images)
    let wrapper = useRef()
    let [activeIndex, setActiveIndex] = useState(0)
    useEffect(()=>{
        wrapper.current.scrollLeft = activeIndex*90
        onChange(activeIndex)
    }, [activeIndex])
    useEffect(()=> {
        setImages(images)
    }, [images])

    return (
        <div className='flex flex-between flex-center' style={{'userSelect': 'none'}}>
            <div className='tab flex flex-center flex-middle pointer' onClick={()=>{setActiveIndex(activeIndex <=1 ? 0:activeIndex-1)}}>
                <img className='tangle-left' src={require('../../assets/images/base/tangle.svg').default} alt="" />
            </div>
            <div className="flex-1 img-wrap p-l-5 p-r-5" ref={wrapper}>
                <div className="img-content flex flex-center">
                    {
                        imgs.map((item, index)=> {
                            return (
                                <div className={'thumb '+(index == activeIndex ? 'active':'')} key={index} onClick={()=>{setActiveIndex(index)}}>
                                    <img className='thumb-img' src={item} alt="" />
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
            <div className='tab flex flex-center flex-middle pointer' onClick={()=>{setActiveIndex(activeIndex >=imgs.length-1 ? imgs.length-1:activeIndex+1)}}>
                <img  className='tangle-right' src={require('../../assets/images/base/tangle.svg').default} alt="" />
            </div>

        </div>
    )
}