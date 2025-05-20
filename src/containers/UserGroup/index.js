import RestEditModal from 'components/RestLayout/RestEditModal';
import React, { useEffect, useState } from 'react'
import ProductForm from './ProductForm';
import RequestUtils from 'utils/RequestUtils';
import { validateRegex } from 'utils/validateUtils';
import { InAppEvent } from 'utils/FuseUtils';
import { f5List } from 'utils/dataUtils';
import { HASH_MODAL_CLOSE } from 'configs';

const UserAccount = ({ data, closeModal }) => {
  const [record, setRecord] = useState({});
  const [listProFile, setListProFile] = useState([]);
  const { listMember } = data;
  useEffect(() => {
    (async () => {
      const listProfile = await RequestUtils.Get('/user/list-role');
      setListProFile(listProfile?.data)
    })()
  }, [])

  const onSubmit = async (dataCreate) => {
    const params = {
      name: dataCreate?.name,
      leaderName: dataCreate?.leaderName,
      leaderId: dataCreate?.leaderId,
      type: dataCreate?.type,
      status: dataCreate?.type,
      listMember: dataCreate?.listMember
    }
    const paramsUpdate = {
      id: data?.datas?.id,
      name: dataCreate?.name || data?.datas?.name,
      memberNumber: data?.datas?.memberNumber,
      memberList: data?.datas?.memberList,
      leaderName: dataCreate?.leaderName || data?.datas?.leaderName,
      leaderId: dataCreate?.leaderId || data?.datas?.leaderId,
      type: dataCreate?.type || data?.datas?.type,
      inTime: Date.now(),
      status: dataCreate?.status || data?.datas?.status,
      listMember: dataCreate?.listMember || dataCreate?.listMember
    }
    if (data?.datas) {
      const datas = await RequestUtils.Post(`/user-group/update`, paramsUpdate);
      if (datas.errorCode === 200) {
        f5List('user-group/fetch');
        InAppEvent.emit(HASH_MODAL_CLOSE);
        InAppEvent.normalSuccess('Cập tài khoản thành công');
        return
      } else {
        InAppEvent.normalError('Cập tài khoản thất bại');
        return
      }
    } else {
      const datas = await RequestUtils.Post('/user-group/created', params);
      if (datas.errorCode === 200) {
        f5List('user-group/fetch');
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
          name: data?.datas?.name,
          leaderName: data?.datas.leaderName,
          leaderId: data?.datas.leaderId,
          type: data?.datas.type,
          status: data?.datas.status,
          memberNumber: data?.datas.memberNumber,
          listMember: data?.datas?.listMember
        })}
      >
        <ProductForm listProFile={listProFile} data={listMember} />
      </RestEditModal>
    </div>
  )
}

export default UserAccount
