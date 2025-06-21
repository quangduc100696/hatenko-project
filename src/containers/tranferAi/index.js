import React, { useEffect, useState } from 'react'
import FormLayout from './FormLayout'
import RestEditModal from 'components/RestLayout/RestEditModal'
import RequestUtils from 'utils/RequestUtils'
import { InAppEvent } from 'utils/FuseUtils'
import { HASH_MODAL_CLOSE } from 'configs'
import { f5List } from 'utils/dataUtils'

const TranferAi = ({data, closeModal}) => {
  const [ record, setRecord] = useState({});

  useEffect(() => {
    (async() => {
      if(data) {
        setRecord(res => ({...res, bid: data?.bid, name: data.name, intro: data?.intro, enpoint: data?.enpoint, description: data?.description, input: data?.input, output: data?.output}))
      }
    })()
  },[data])

  const onSubmit = async (dataCreate) => {
    const params = {
      bid: dataCreate?.bid,
      action: 'lead',
      name: dataCreate.name,
      description: dataCreate?.description,
      intro: dataCreate?.intro,
      enpoint: dataCreate?.enpoint,
      input: dataCreate?.input,
      output: dataCreate?.output,
    };
    if(Object.keys(data).length > 0) {
      params.id = data.id;
    }
    const datas = Object.keys(data).length > 0 ? await RequestUtils.Post('/context-type/update', params) :  await RequestUtils.Post('/context-type/create', params)
    if(datas.errorCode === 200) {
      f5List('context-type/fetch');
      InAppEvent.normalSuccess("Cập nhật thông tin thành công");
      InAppEvent.emit(HASH_MODAL_CLOSE);
    }
  }

  return (
    <div>
      <RestEditModal
        isMergeRecordOnSubmit={false}
        updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
        onSubmit={onSubmit}
        record={record}
        closeModal={closeModal}
      >
        <FormLayout/>
      </RestEditModal>
    </div>
  )
}

export default TranferAi
