import { useState, useRef, useMemo, useEffect } from "react"

let Tip = (props) => {
    let [show, setShow] = useState(true)
    return (
        <>
            {
                show ? (
                    <div className={"game-tip flex w100 flex-center cf fz-14 "+(props.class)}>
                        <img className="info-icon" src={require('../../../assets/images/user/info.svg').default} alt="" />
                        {
                            props.title
                        }
                        <img className="close-icon pointer" src={require('../../../assets/images/user/close.svg').default} alt="" onClick={() => setShow(false)} />
                    </div>
                ) : ''
            }
        </>

    )
}
export default Tip
