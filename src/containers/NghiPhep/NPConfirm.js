import React, { useCallback, useContext, useMemo, useState } from 'react';
import RestEditModal from 'components/RestLayout/RestEditModal';
import { InAppEvent } from 'utils/FuseUtils';
import { f5List } from 'utils/dataUtils';
import NPReview from './NPReview';
import useGetMe from 'hooks/useGetMe';
import CustomButton from 'components/CustomButton';
import { Popconfirm } from 'antd';
import {
  NGHI_PHEP_STATUS_CONFIRM,
  NGHI_PHEP_STATUS_DONE,
  NGHI_PHEP_STATUS_REJECT,
  NGHI_PHEP_STATUS_WAITING
} from 'configs/constant';
import FormTextArea from 'components/form/FormTextArea';
import RequestUtils from 'utils/RequestUtils';
import { FormContextCustom } from 'components/context/FormContextCustom';

const applyStyleDaKy = (element, text) => {
  let daKy = document.getElementById(element);
  if (daKy) {
    daKy.innerHTML = text;
    let styleDaKy = daKy.style;
    styleDaKy.color = "blue";
    styleDaKy.margin = "0 auto";
    styleDaKy.marginBottom = "15px";
    styleDaKy.lineHeight = "10px";
    styleDaKy.fontSize = "14px";
    styleDaKy.padding = "8px";
    styleDaKy.borderRadius = "3px";
    styleDaKy.border = "1px solid #46819d";
    styleDaKy.width = "100px";
    styleDaKy.textAlign = "center";
  }
}

const BtnCancel = ({
  data,
  showNoteCancel,
  setShowNote
}) => {

  const { isLeader } = useGetMe();
  const { form } = useContext(FormContextCustom);

  const onSubmitCancel = useCallback(() => {
    form.validateFields().then((values) => {
      let nItem = {};
      if (isLeader()) {
        nItem.noteCheck = values.note;
        applyStyleDaKy("daKiemTra", "Cancel");
      }
      if (isLeader()) {
        nItem.noteAppoved = values.note;
        applyStyleDaKy("daKy", "Cancel");
      }
      nItem.status = NGHI_PHEP_STATUS_REJECT;
      const uri = isLeader() ? "/leave-of-absence/check-leave-of" : "/leave-of-absence/appoved-leave-of";
      RequestUtils.Post(uri, { ...data, ...nItem }).then(({ message }) => {
        InAppEvent.normalInfo(message);
      });
      f5List('leave-of-absence/fetch');
    });
    /* eslint-disable-next-line  */
  }, [data, form]);

  if (isLeader()) {
    return data.status === NGHI_PHEP_STATUS_WAITING ? (
      <CustomButton
        onClick={() => {
          if (!showNoteCancel) {
            setShowNote(pre => !pre)
          } else {
            onSubmitCancel();
          }
        }}
        title={showNoteCancel ? 'Canceling' : 'Cancel'}
        type='primary'
      />
    ) : <span />
  } else if (isLeader()) {
    if (data.status === NGHI_PHEP_STATUS_DONE) {
      return <span />
    }
    return data.status !== NGHI_PHEP_STATUS_REJECT ? (
      <CustomButton
        onClick={() => {
          if (!showNoteCancel) {
            setShowNote(pre => !pre)
          } else {
            onSubmitCancel();
          }
        }}
        title={showNoteCancel ? 'Canceling' : 'Cancel'}
        type='primary'
      />
    ) : <span />
  } else {
    return <span />
  }
}

const NPConfirm = ({ closeModal, data }) => {

  const { isLeader } = useGetMe();
  const [showNoteCancel, setShowNote] = useState(false);

  const onSubmitConfirm = useCallback(() => {
    let nItem = {};
    if (isLeader()) {
      nItem.status = NGHI_PHEP_STATUS_CONFIRM;
      applyStyleDaKy("daKiemTra", "Đã kiểm tra");
    }
    if (isLeader()) {
      nItem.status = NGHI_PHEP_STATUS_DONE;
      applyStyleDaKy("daKy", "Đã Ký");
    }
    let domContent = document.getElementById("np-content-html");
    if (domContent) {
      nItem.contentEmail = domContent.innerHTML;
    }
    const uri = isLeader() ? "/leave-of-absence/check-leave-of" : "/leave-of-absence/appoved-leave-of";
    RequestUtils.Post(uri, { ...data, ...nItem }).then(({ message }) => {
      InAppEvent.normalInfo(message);
    });
    f5List('leave-of-absence/fetch');
    closeModal()
    /* eslint-disable-next-line  */
  }, [data]);

  const btnConfirm = useMemo(() => {
    if (isLeader()) {
      return (data.status === NGHI_PHEP_STATUS_WAITING && !showNoteCancel) ? (
        <Popconfirm
          title="Confirm Item"
          description="Are you sure this confirm ?"
          onConfirm={onSubmitConfirm}
          okText="Yes"
          cancelText="No"
        >
          <CustomButton
            htmlType="submit"
            title="Confirm"
            color="danger"
            style={{ marginLeft: 20 }}
            variant="solid"
          />
        </Popconfirm>
      ) : <span />
    }
    /* eslint-disable-next-line  */
  }, [showNoteCancel, data]);

  return <>
    <RestEditModal
      isMergeOnSubmit={false}
      record={data}
      closeModal={closeModal}
    >
      <NPReview show={true} record={data} />
      {showNoteCancel &&
        <FormTextArea
          name="note"
          rows={4}
          required
          label={"Lý do huỷ"}
          placeholder={"Nhập lý do huỷ"}
        />
      }
      <div style={{ display: 'flex', justifyContent: 'end', margin: '30px 30px', alignItems: 'center' }}>
        <BtnCancel
          data={data}
          showNoteCancel={showNoteCancel}
          setShowNote={setShowNote}
        />
        {btnConfirm}
      </div>
    </RestEditModal>
  </>
}

export default NPConfirm;