import React, { useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { f5List } from 'utils/dataUtils';
import LeadForm from './LeadForm';
import { HASH_MODAL_CLOSE } from 'configs';

const NewLead = ({ closeModal, data }) => {

  const [ record, setRecord] = useState(data);
  const onSubmit = async (values) => {
    const newData = await RequestUtils.Post("/data/create", values);
    const isSuccess = newData?.errorCode === 200;
    if (isSuccess) {
      f5List('data/lists');
      InAppEvent.normalSuccess("Cập nhật thành công");
      InAppEvent.emit(HASH_MODAL_CLOSE);
    }
  }

  return (
    <RestEditModal
      isMergeRecordOnSubmit={true}
      updateRecord={(values) => setRecord(curvals => ({ ...curvals, ...values }))}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <LeadForm />
    </RestEditModal>
  )
}

export default NewLead;