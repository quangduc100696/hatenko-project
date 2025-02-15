import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter, { statusData } from './LeadFilter';
import useGetList from "hooks/useGetList";
import { Button, Form, Tag } from 'antd';
import { arrayEmpty, dateFormatOnSubmit } from 'utils/dataUtils';
import { getColorStatusLead, getSource, getStatusLead, getStatusService } from 'configs/constant';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { cloneDeep } from 'lodash';
import ModaleStyles from './style';
import FormSelect from 'components/form/FormSelect';
import useGetMe from 'hooks/useGetMe';

const roleUserSale = "ROLE_SALE"; 
const roleUserAdmin = "ROLE_ADMIN";
const roleUser = "ROLE_USER"
const LeadPage = () => {

  const { user: profile } = useGetMe();
  const [form] = Form.useForm();
  const [title] = useState("Danh sách Lead");
  const [ listSale, setListSale ] = useState([]);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ detailRecord, setDetailRecord ] = useState({});

  const newRoleUser = profile?.userProfiles?.map(item => item?.type);
  const hasAdminRole = newRoleUser.some(role => role === roleUserAdmin);
  const hasSaleRole = newRoleUser.some(role => role === roleUserSale);
  const hasUserRole = newRoleUser.some(role => role === roleUser);
  const shouldHideLeadLinks = (hasSaleRole || hasUserRole) && !hasAdminRole;

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/user/list-sale');
      if (data) {
        setListSale(data);
      }
    })()
  }, [])

  useEffect(() => {
    form.setFieldsValue({saleId: detailRecord?.saleId})
  },[form, detailRecord])

  const onEdit = (item) => {
    let title = 'Sửa lead mới # ' + item.id;
    let hash = '#draw/lead.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const CUSTOM_ACTION = [
    {
      title: "Create",
      dataIndex: 'staff',
      width: 100
    },
    {
      title: "Dịch vụ",
      ataIndex: 'serviceId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {!shouldHideLeadLinks ? (
              <FormSelect
                name="status"
                label="Trạng thái"
                valueProp="id"
                titleProp='name'
                resourceData={statusData || []}
                placeholder='Lọc theo trạng thái'
            />
            ) : <Tag color="orange">{getStatusService(item?.serviceId)}</Tag>}
          </div>
        )
      }
    },
    {
      title: "Ngày",
      ataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {dateFormatOnSubmit(item?.inTime)}
          </div>
        )
      }
    },
    {
      title: "Nguồn",
      ataIndex: 'source',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {getSource(item?.source)}
          </div>
        )
      }
    },
    {
      title: "Khách hàng",
      ataIndex: 'customerName',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerName}
          </div>
        )
      }
    },
    {
      title: "Số đ/t",
      ataIndex: 'customerMobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.customerMobile}
          </div>
        )
      }
    },
    {
      title: "Trạng thái",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
             <Tag color={getColorStatusLead(item?.status)}>{getStatusLead(item?.status)}</Tag>
          </div>
        )
      }
    },
    {
      title: "Sale",
      ataIndex: 'saleId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const newSale = listSale.find(v => v?.id === item?.saleId);
        return (
          <div>
            {newSale?.fullName || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 200,
      fixed: 'right',
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            color="primary"
            size='small'
            variant="dashed"
            style={{width: '60%'}}
            onClick={() => {
              setIsOpen(true);
              setDetailRecord(record)
            }}
          >
            {record?.saleId ? 'Chuyển sale' : 'Tạo sale'}
          </Button>
          <Button color="danger" variant="dashed" onClick={() => onEdit(record)} size='small'>Detail</Button>
        </div>
      )
    }
  ];

  const onData = useCallback((values) => {
    if (arrayEmpty(values.embedded)) {
      return values;
    }
    return values;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => InAppEvent.emit(HASH_MODAL, {
    hash: '#draw/lead.edit',
    title: 'Tạo mới Lead',
    data: {}
  });

  const onHandleSubmitSaleLead = async (value) => {
    const data = await RequestUtils.Post(`/data/re-assign?dataId=${detailRecord?.id}&saleId=${value?.saleId}`, '');
    if(data?.errorCode === 200) {
      InAppEvent.normalSuccess("Tạo sale chăm sóc lead thành công");
      /* nếu tạo ok thì tắt popup */
      setIsOpen(false);
    } else {
      InAppEvent.normalError("Tạo thất bại");
    }
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <CustomBreadcrumb
        data={[{ title: 'Trang chủ' }, { title: title }]}
      />
      <RestList
        xScroll={1200}
        onData={onData}
        initialFilter={{ limit: 10, page: 1 }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'data/lists'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />

      <ModaleStyles title={
        <div style={{ color: '#fff' }}>
          Chọn sale chăm sóc lead
        </div>
      } open={isOpen} footer={false} onCancel={() => setIsOpen(false)}>
        <div style={{ padding: 15 }}>
          <Form
            name="basic"
            layout='vertical'
            form={form}
            onFinish={onHandleSubmitSaleLead}
          >
            <FormSelect
              required={true}
              label="Chọn sale"
              name="saleId"
              placeholder="Sale phụ trách"
              resourceData={listSale || []}
              valueProp="id"
              titleProp="fullName"
            />
            <Form.Item style={{display: 'flex', justifyContent: 'end'}}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </ModaleStyles>

    </div>
  )
}

export default LeadPage
