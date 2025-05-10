import RestEditModal from 'components/RestLayout/RestEditModal';
import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { validateRegex } from 'utils/validateUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { f5List } from 'utils/dataUtils';
import { HASH_MODAL_CLOSE } from 'configs';

const UserAccount = ({closeModal}) => {
  const [record, setRecord] = useState({});
  const [listProFile, setListProFile] = useState([]);
  useEffect(() => {
    (async() => {
      const listProfile = await RequestUtils.Get('/user/list-role');
      setListProFile(listProfile?.data)   
    })()
  },[])

  const onSubmit = async (dataCreate) => {
    if(!validateRegex.phone.test(dataCreate.phone)) {
      return InAppEvent.normalInfo('Vui lòng nhập đúng số điện thoại định dạng')
    } else if(!validateRegex.email.test(dataCreate.email)) {
      return InAppEvent.normalInfo('Vui lòng nhập đúng Email định dạng')
    }
    const decodeRoleUser = dataCreate?.userProfiles.map(item => {
      const decodeUserProfiles = JSON.parse(item);
      return decodeUserProfiles
    })
    const params = {
			ssoId: dataCreate?.ssoId,
			password: dataCreate?.password,
			layout: dataCreate?.layout,
			fullName: dataCreate?.fullName,
			phone: dataCreate?.phone,
			email: dataCreate?.email,
			status: dataCreate?.status,
      userProfiles: decodeRoleUser
		}
    const data = await RequestUtils.Post('/user/create', params);
    if(data.errorCode === 200) {
      f5List('user/list');
      InAppEvent.emit(HASH_MODAL_CLOSE);
      return InAppEvent.normalSuccess('Tạo tài khoản thành công');
    } else {
      return InAppEvent.normalError('Tạo tài khoản thất bại');
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
        <ProductForm listProFile={listProFile}/>
      </RestEditModal>
    </div>
  )
}

export default UserAccount
