import React from 'react'
import OrderDetailForm from './OrderDetailForm'

const WareHouse = ({title, data}) => {
  const { listProvince, record } = data
  return (
    <div>
      <OrderDetailForm title={title} listProvince={listProvince} data={record}/>
    </div>
  )
}

export default WareHouse
