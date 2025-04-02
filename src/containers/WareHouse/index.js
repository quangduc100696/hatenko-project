import React from 'react'
import OrderDetailForm from './OrderDetailForm'

const WareHouse = ({title, data}) => {
  return (
    <div>
      <OrderDetailForm title={title} data={data}/>
    </div>
  )
}

export default WareHouse
