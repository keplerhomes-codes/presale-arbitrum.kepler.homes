import './Select.scss'
import { Select } from 'antd';

const { Option } = Select;
export default function ({onChange, className, width, options}) {

const Triggle = (<div className='flex flex-center select-icon'>
  <img src={require('../../assets/images/base/tangle.svg').default} alt="" />
</div>)
function handleChange(value) {
  onChange(value)
}
  return (
    <div className={'flex select flex-center normal flex-1  m-l-20 ' + className}>
      <Select dropdownClassName="select-dropdown" defaultValue={0} bordered={false} style={{ width: width ?? 200 }}
        onChange={handleChange}
        suffixIcon={Triggle}>
          {
            options.map(item => {
              return (
                <Option value={item.value} key={item.value}>{item.label}</Option>
              )
            })
          }
      </Select>
    </div>
  )
}