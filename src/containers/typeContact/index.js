import React, { useState } from 'react'
import FormLayout from './FormLayout'
import RestEditModal from 'components/RestLayout/RestEditModal'
import RequestUtils from 'utils/RequestUtils'
import { InAppEvent } from 'utils/FuseUtils'
import { HASH_MODAL_CLOSE } from 'configs'
import { f5List } from 'utils/dataUtils'

const TypeContact = ({data, closeModal}) => {
  const [ record, setRecord] = useState({});

  const onSubmit = async (dataCreate) => {
    const params = {
      bid: dataCreate?.bid,
      pId: 1,
      name: dataCreate.name,
      content: dataCreate?.description,
    };
    if(Object.keys(data).length > 0) {
      params.id = data.id;
    }
    const datas = await RequestUtils.Post('/context/create', params)
    if(datas.errorCode === 200) {
      f5List('context/fetch');
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

export default TypeContact
