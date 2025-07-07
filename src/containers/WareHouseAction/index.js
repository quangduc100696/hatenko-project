import React from 'react'
import OrderDetaiWareHouselForm from './OrderDetaiWareHouselForm'

const WareHouseAction = ({title, data}) => {
  return (
    <div>
      <OrderDetaiWareHouselForm title={title} data={data}/>
    </div>
  )
}

export default WareHouseAction
