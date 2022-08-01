import { t } from 'i18next'
import './Search.scss'
export default function ({onChange}) {
   return (
       <div className='flex search flex-center normal p-l-20 p-r-20 flex-1'>
           <input type="text" className='fz-16 flex-1 cf' placeholder={t("Search item ...")} onChange={onChange}/>
           <img className='icon' src={require('../../assets/images/base/search.svg').default} alt="" />
       </div>
   )
}