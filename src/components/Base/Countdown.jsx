import './Countdown.scss'
import {useEffect, useState} from 'react'
import useInterval from '@use-it/interval';
export default function ({deadline, timeoutFn}) {
    let [lastTime, setLastTime] = useState(deadline || 2*60*60) // seconds
    
    let [hours, setHours] = useState('00') //hours
    let [minute, setMinute] = useState('00') //minute
    let [seconds, setSeconds] = useState('00') //seconds
    let [onesecond, setOnesecond] = useState(100)
    useEffect(()=> {
        setLastTime(deadline || 2*60*60)
    }, [deadline])

    useInterval(() => {
        var second = lastTime,
        minute = 0,
        hour = 0,
        minute = parseInt(second / 60); //算出一共有多少分钟
        second %= 60; //算出有多少秒
        if (minute > 60) {
            //如果分钟大于60，计算出小时和分钟
            hour = parseInt(minute / 60);
            minute %= 60; //算出有多分钟
        };
        hour = hour < 10 ? "0" + hour : hour;
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        setHours(hour)
        setMinute(minute)
        setSeconds(second)
        if(lastTime > 0 && onesecond == 0) {
            setLastTime(lastTime-1)
            setOnesecond(100)
        } else if(lastTime > 0) {
            setOnesecond(onesecond-1)
        } else {
            timeoutFn()
        }
      }, 10);

    return (
        <div>
            <div className="flex">
                <div className="box ta m-r-6  fz-16">{hours}</div>
                <div className="box ta m-r-6  fz-16">{minute}</div>
                <div className="box ta m-r-6  fz-16">{seconds}</div>
                <div className="box ta m-r-6  fz-16">{onesecond}</div>
            </div>
            <div className="flex">
                <div className="tip ta m-r-6  fz-12">H</div>
                <div className="tip ta m-r-6  fz-12">M</div>
                <div className="tip ta m-r-6  fz-12">S</div>
                <div className="tip ta m-r-6  fz-12">MS</div>
            </div>
            
        </div>
    )
}