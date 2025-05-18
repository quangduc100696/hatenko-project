import RestEditModal from 'components/RestLayout/RestEditModal';
import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { validateRegex } from 'utils/validateUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { f5List } from 'utils/dataUtils';
import { HASH_MODAL_CLOSE } from 'configs';

const UserAccount = ({data, closeModal}) => {
  const [record, setRecord] = useState({});
  const [listProFile, setListProFile] = useState([]);
  useEffect(() => {
    (async() => {
      const listProfile = await RequestUtils.Get('/user/list-role');
      setListProFile(listProfile?.data)   
    })()
  },[])

  const onSubmit = async (dataCreate) => {
    if(!/^\+?[0-9]{9,15}$/.test(dataCreate.phone || data?.phone)) {
      InAppEvent.normalInfo('Vui lòng nhập đúng số điện thoại định dạng');
      return;
    }
    if(!validateRegex.email.test(dataCreate.email || data?.email)) {
      InAppEvent.normalInfo('Vui lòng nhập đúng Email định dạng');
      return;
    }
    const filtered = listProFile.filter(role => dataCreate?.userProfiles.includes(role.id));
    const params = {
			ssoId: dataCreate?.ssoId || data?.ssoId ,
			password: dataCreate?.password,
			layout: dataCreate?.layout || data?.layout,
			fullName: dataCreate?.fullName,
			phone: dataCreate?.phone || data?.fullName,
			email: dataCreate?.email || data?.email,
			status: dataCreate?.status || data?.status,
      userProfiles: filtered || data?.userProfiles
		}
    if(data) {
      const datas = await RequestUtils.Post(`/user/update?id=${data?.id}`, params);
      if(datas.errorCode === 200) {
        f5List('user/list');
        InAppEvent.emit(HASH_MODAL_CLOSE);
        InAppEvent.normalSuccess('Cập tài khoản thành công');
        return
      } else {
        InAppEvent.normalError('Cập tài khoản thất bại');
        return
      }
    } else {
      const datas = await RequestUtils.Post('/user/create', params);
      if(datas.errorCode === 200) {
        f5List('user/list');
        InAppEvent.emit(HASH_MODAL_CLOSE);
        InAppEvent.normalSuccess('Tạo tài khoản thành công');
        return
      } else {
        InAppEvent.normalError('Tạo tài khoản thất bại');
        return
      }
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
        formatDefaultValues={() => ({
          ssoId: data?.ssoId,
          layout: data?.layout,
          fullName: data?.fullName,
          phone: data?.phone,
          email: data?.email,
          status: data?.status,
          userProfiles: data?.userProfiles?.map(f => f.id)
        })}
      >
        <ProductForm listProFile={listProFile} data={data}/>
      </RestEditModal>
    </div>
  )
}

export default UserAccount
