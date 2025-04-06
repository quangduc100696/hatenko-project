import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CustomBreadcrumb from 'components/BreadcrumbCustom';
import RestList from 'components/RestLayout/RestList';
import LeadFilter from './Filter';
import useGetList from "hooks/useGetList";
import { dateFormatOnSubmit, f5List } from 'utils/dataUtils';
import { HASH_MODAL } from 'configs';
import { InAppEvent } from 'utils/FuseUtils';
import useGetMe from 'hooks/useGetMe';
import { Button, Col, Form, Row } from 'antd';
import ModaleStyles from 'pages/lead/style';
import { useForm } from 'antd/es/form/Form';
import FormInput from 'components/form/FormInput';
import RequestUtils from 'utils/RequestUtils';

const ListWareHouse = () => {

  const { user: profile } = useGetMe();
  const [title] = useState("Danh sách kho");
  const [isOpen, setIsOpen] = useState(false);
  const [detailWareHouse, setDetailWareHouse] = useState({});
  const [form] = useForm();

  useEffect(() => {
    if(detailWareHouse) {
      form.setFieldsValue({
        name: detailWareHouse?.name,
        mobile: detailWareHouse?.mobile,
        address: detailWareHouse?.address,
        area: detailWareHouse?.area,
      })
    }
  },[detailWareHouse])
  
  const CUSTOM_ACTION = [
    {
      title: "Tên kho",
      ataIndex: 'status',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.name}
          </div>
        )
      }
    },
    {
      title: "Số điện thoại",
      ataIndex: 'mobile',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.mobile}
          </div>
        )
      }
    },
    {
      title: "Địa chỉ",
      ataIndex: 'address',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.address || 'N/A'}
          </div>
        )
      }
    },
    {
      title: "Khu vực",
      ataIndex: 'area',
      width: 200,
      ellipsis: true,
      render: (item) => {
        return (
          <div>
            {item?.area}
          </div>
        )
      }
    },
    {
      title: "Thao tác",
      width: 120,
      fixed: 'right',
      render: (record) => (
        <div>
          <Button color="primary" variant="dashed" size='small' onClick={() => {
            setDetailWareHouse(record)
            setIsOpen(true)
          }}>
            Update
          </Button>
        </div>
      )
    }
  ];

  const onData = useCallback((values) => {
    const newData = { embedded: values, page: { pageSize: 10, total: 1 } }
    return newData;
  }, []);

  const beforeSubmitFilter = useCallback((values) => {
    dateFormatOnSubmit(values, ['from', 'to']);
    return values;
  }, []);

  const onCreateLead = () => {
    setIsOpen(true);
  }

  const onHandleCreateWareHouse = async (value) => {
    const data = detailWareHouse ? await RequestUtils.Post('/warehouse/update-stock', value) : await RequestUtils.Post('/warehouse/created-stock', value);
    if(data.errorCode) {
      f5List('warehouse/fetch-stock');
      setIsOpen(false);
      InAppEvent.normalSuccess('Tạo kho thành công');
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
        apiPath={'warehouse/fetch-stock'}
        customClickCreate={onCreateLead}
        columns={CUSTOM_ACTION}
      />

      <ModaleStyles title={
        <div style={{ color: '#fff' }}>
          Tạo kho
        </div>
      } open={isOpen} footer={false} onCancel={() => setIsOpen(false)}>
        <div style={{ padding: 15 }}>
          <Form
            name="basic"
            layout='vertical'
            form={form}
            onFinish={onHandleCreateWareHouse}
          >
            <Row gutter={14}>
              <Col xs={24} xl={12}>
                <FormInput
                  maxLength={255}
                  name="name"
                  label="Tên kho"
                  placeholder="Nhập tên kho "
                  required
                />
              </Col>
              <Col xs={24} xl={12}>
                <FormInput
                  maxLength={255}
                  name="mobile"
                  label="Số điện thoại"
                  placeholder="Nhập Số điện thoại "
                  required
                />
              </Col>
              <Col xs={24} xl={12}>
                <FormInput
                  maxLength={255}
                  name="address"
                  label="Địa chỉ"
                  placeholder="Nhập địa chỉ "
                  required
                />
              </Col>
              <Col xs={24} xl={12}>
                <FormInput
                  maxLength={255}
                  name="area"
                  label="Khu vực"
                  placeholder="Nhập khu vực"
                  required
                />
              </Col>
            </Row>
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

export default ListWareHouse

