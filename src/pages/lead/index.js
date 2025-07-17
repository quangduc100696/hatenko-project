import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import { SelectOutlined, EditTwoTone } from '@ant-design/icons';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './LeadFilter';
import useGetList from "hooks/useGetList";
import { Button, Form, Tag, Tooltip } from 'antd';
import { dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { cloneDeep } from 'lodash';
import ModaleStyles from './style';
import FormSelect from 'components/form/FormSelect';
import { NoFooter } from 'components/common/NoFooter';

const LeadPage = () => {

  const [ form ] = Form.useForm();
  const [ title ] = useState("Danh sách Lead");
  const [ listSale ] = useState([]);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ detailRecord, setDetailRecord ] = useState({});
  const [ listService, setListService ] = useState([])

  useEffect(() => {
    RequestUtils.Get('/service/list').then(
      ({data}) => setListService(data)
    );
  },[])

  useEffect(() => {
    form.setFieldsValue({ saleId: detailRecord?.saleId })
  }, [form, detailRecord])

  const onEdit = (item, text) => {
    let title = text === 'base' ? 'Tạo cơ hội' : 'Sửa lead mới # ' + item.id;
    let hash = '#draw/lead.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const CUSTOM_ACTION = [
    {
      title: "Create",
      dataIndex: 'staff',
      width: 150
    },
    {
      title: "Dịch vụ",
      dataIndex: 'serviceId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const nameService = listService.find(f => f.id === item?.serviceId)
        return <Tag color="orange">{nameService?.name || 'N/A'} </Tag>
      }
    },
    {
      title: "Ngày",
      dataIndex: 'inTime',
      width: 200,
      ellipsis: true,
      render: (inTime) => dateFormatOnSubmit(inTime)
    },
    {
      title: "Khách hàng",
      dataIndex: 'customerName',
      width: 200,
      ellipsis: true
    },
    {
      title: "Số đ/t",
      dataIndex: 'customerMobile',
      width: 200,
      ellipsis: true
    },
    {
      title: "Sale",
      dataIndex: 'ssoId',
      width: 200,
      ellipsis: true
    },
    {
      title: "Tạo cơ hội",
      width: 120,
      fixed: 'right',
      render: (record) => (
       <Button 
          color="danger" 
          variant="dashed" onClick={() => onEdit(record, 'base')} 
          size='small'
        >
          Tạo cơ hội
        </Button>
      )
    },
    {
      title: "Thao tác",
      width: 100,
      fixed: 'right',
      ellipsis: true,
      render: (record) => (
        <div style={{ display: 'flex', gap: 20 }}>
          <Tooltip style={{cursor: 'pointer'}} title={record?.saleId ? 'Chuyển sale' : 'Tạo sale'}>
            <EditTwoTone style={{ color: '#1677ff', fontSize: 20 }} onClick={() => {
              setIsOpen(true);
              setDetailRecord(record)
            }}/>
          </Tooltip>
          <Tooltip style={{cursor: 'pointer'}} title={'Detail'}>
            <SelectOutlined style={{ color: '#1677ff', fontSize: 20 }} onClick={() => onEdit(record, 'detail')}/>
          </Tooltip>
        </div>
      )
    }
  ];

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
    if (data?.errorCode === 200) {
      f5List('data/lists');
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
        initialFilter={{ limit: 10, page: 1 }}
        filter={<LeadFilter />}
        beforeSubmitFilter={beforeSubmitFilter}
        useGetAllQuery={useGetList}
        apiPath={'data/lists'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />

      <ModaleStyles 
        title={
          <div style={{ color: '#fff' }}>
            Chọn sale chăm sóc lead
          </div>
        }
        open={isOpen} 
        footer={<NoFooter />} 
        onCancel={() => setIsOpen(false)}
      >
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
            <Form.Item style={{ display: 'flex', justifyContent: 'end', marginTop: 10 }}>
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
