import React, { useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { arrayNotEmpty, f5List } from 'utils/dataUtils';
import { GATEWAY, HASH_MODAL_CLOSE } from 'configs';
import jwtService from 'utils/jwtService';
import LeadForm from './LeadForm';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const NewLead = ({ closeModal, data }) => {

  const { record: item, listServices, listSale } = data;
  const [ record, setRecord ] = useState(item);

  const onSubmit = async (values) => {
    const { fileUploads, ...body } = values;
    const randomNumbers = Array.from({ length: 10 }, () => getRandomInt(1, 9));
    const sessionId = randomNumbers.join("");

    if(arrayNotEmpty(fileUploads)) {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      for (let i = 0; i < fileUploads.length; i++) {
        formData.append('files[]', fileUploads[i]);
      }
      const uri = RequestUtils.generateUrlGetParams("/data/uploads-files", { sessionId });
      await fetch(String(GATEWAY).concat(uri), { 
        method: 'POST',
        body: formData ,
        headers: { 'Authorization': `Bearer ${jwtService.getAccessToken()}`}
      });
    }

    const { errorCode } = await RequestUtils.Post("/data/create", {
      sessionId,
      ...body
    });
    if (errorCode === 200) {
      f5List('data/lists');
      InAppEvent.normalSuccess("Cập nhật thành công");
      InAppEvent.emit(HASH_MODAL_CLOSE);
    }
  }

  return (
    <RestEditModal
      isMergeRecordOnSubmit={true}
      updateRecord={(values) => {
        setRecord(curvals => ({ ...curvals, ...values }))
      }}
      onSubmit={onSubmit}
      record={record}
      closeModal={closeModal}
    >
      <LeadForm 
        listServices={listServices}
        listSale={listSale}
      />
    </RestEditModal>
  )
}

export default NewLead;