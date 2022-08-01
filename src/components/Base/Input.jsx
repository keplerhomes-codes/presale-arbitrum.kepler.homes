import { Input } from "antd";
import './Input.scss'
export default function ({onChange, className, placeholder}) {
    return (
        <Input className={"my-input "+ className} placeholder={placeholder} onChange={onChange}/>
    )
}