import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import { SelectOutlined, EditTwoTone } from '@ant-design/icons';
import RestList from 'components/RestLayout/RestList';
import LeadFilter, { statusData } from './LeadFilter';
import useGetList from "hooks/useGetList";
import { Button, Form, Select, Tag, Tooltip } from 'antd';
import { arrayEmpty, dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import { getColorStatusLead, getSource, getStatusLead, STATUS_LEAD } from 'configs/constant';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import RequestUtils from 'utils/RequestUtils';
import { cloneDeep, map } from 'lodash';
import ModaleStyles from './style';
import FormSelect from 'components/form/FormSelect';
import useGetMe from 'hooks/useGetMe';

const roleUserSale = "ROLE_SALE";
const roleUserAdmin = "ROLE_ADMIN";
const roleUser = "ROLE_USER"
const LeadPage = () => {
  debugger
  const { user: profile } = useGetMe();
  const [form] = Form.useForm();
  const [title] = useState("Danh sách Lead");
  const [listSale, setListSale] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState({});
  const [listService, setListService] = useState([])

  const newRoleUser = profile?.userProfiles?.map(item => item?.type);
  const hasAdminRole = newRoleUser.some(role => role === roleUserAdmin);
  const hasSaleRole = newRoleUser.some(role => role === roleUserSale);
  const hasUserRole = newRoleUser.some(role => role === roleUser);
  const shouldHideLeadLinks = (hasSaleRole || hasUserRole) && !hasAdminRole;

  useEffect(() => {
    (async () => {
      const { data } = await RequestUtils.Get('/service/list');
      setListService(data);
    })()
  }, [])

  useEffect(() => {
    form.setFieldsValue({ saleId: detailRecord?.saleId })
  }, [form, detailRecord])

  const onEdit = (item, text) => {
    let title = text === 'base' ? 'Tạo cơ hội' : 'Sửa lead mới # ' + item.id;
    let hash = '#draw/lead.edit';
    let data = cloneDeep(item);
    InAppEvent.emit(HASH_MODAL, { hash, title, data });
  }

  const onHandleUpdateState = async (v, data) => {
    const newData = {
      ...data,
      status: v
    }
    const result = await RequestUtils.Post(`/data/update?leadId=${data?.id}`, newData);
    if (result?.errorCode === 200) {
      InAppEvent.normalSuccess("Cập nhập thành công");
    } else {
      InAppEvent.normalError("Cập nhập thất bại");
    }
  }

  const CUSTOM_ACTION = [
    {
      title: "Create",
      dataIndex: 'staff',
      width: 150
    },
    {
      title: "Dịch vụ",
      ataIndex: 'serviceId',
      width: 200,
      ellipsis: true,
      render: (item) => {
        const nameService = listService.find(f => f.id === item?.serviceId)
        return (
          <div>
            <Tag color="orange">{nameService?.name || 'N/A'} </Tag>
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
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {!!shouldHideLeadLinks ? (
              <Select
                style={{ width: 170 }}
                defaultValue={getStatusLead(item?.status)}
                onChange={(v) => onHandleUpdateState(v, item)}
                disabled={STATUS_LEAD.THANH_CO_HOI === item?.status ? true : false}
              >
                {map(statusData, (data, index) => (
                  <Select.Option
                    key={String(index)}
                    value={data?.id}
                  >
                    {data?.name}
                  </Select.Option>
                ))}
              </Select>

            ) : <Tag color={getColorStatusLead(item?.status)}>{getStatusLead(item?.status)}</Tag>}
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
      title: "Tạo cơ hội",
      width: 120,
      fixed: 'right',
      render: (record) => (
        <div style={{ display: 'flex', gap: 10 }}>
          {record?.saleId && (
            <div>
              <Button color="danger" variant="dashed" onClick={() => onEdit(record, 'base')} size='small'>Tạo cơ hội</Button>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Thao tác",
      width: 100,
      fixed: 'right',
      ellipsis: true,
      render: (record) => (
        <div>
          <div style={{ display: 'flex', gap: 20 }}>
            {/* <Button
              color="primary"
              size='small'
              variant="dashed"
              style={{ width: '100px' }}
              onClick={() => {
                setIsOpen(true);
                setDetailRecord(record)
              }}
            >
              {record?.saleId ? 'Chuyển sale' : 'Tạo sale'}
            </Button> */}
            <Tooltip style={{ cursor: 'pointer' }} title={record?.saleId ? 'Chuyển sale' : 'Tạo sale'}>
              <EditTwoTone style={{ color: '#1677ff', fontSize: 20 }} onClick={() => {
                setIsOpen(true);
                setDetailRecord(record)
              }} />
            </Tooltip>
            <Tooltip style={{ cursor: 'pointer' }} title={'Detail'}>
              <SelectOutlined style={{ color: '#1677ff', fontSize: 20 }} onClick={() => onEdit(record, 'detail')} />
            </Tooltip>
          </div>
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
