import React, { useState, useCallback, useEffect } from 'react';
import { Col, Form, message, Row, Table } from 'antd';
import FormSelectInfiniteProduct from 'components/form/SelectInfinite/FormSelectInfiniteProduct';
import FormSelect from 'components/form/FormSelect';
import FormInputNumber from 'components/form/FormInputNumber';
import BtnSubmit from 'components/CustomButton/BtnSubmit';
import FormSelectInfiniteProvider from 'components/form/SelectInfinite/FormSelectInfiniteProvider';
import FormInfiniteStock from 'components/form/SelectInfinite/FormInfiniteStock';
import FormHidden from 'components/form/FormHidden';
import RequestUtils from 'utils/RequestUtils';
import WarehouseService from 'services/WarehouseService';
import { arrayNotEmpty } from 'utils/dataUtils';

const SKU_DETAIL_ID_PREFIX = 'skuDetailId_';
const ModalNhapKho = ({ 
  product, 
  onSave 
}) => {
  
  const [ form ] = Form.useForm();

  const [ inStocks, setInStocks ] = useState([]);
  const [ skus, setSkus ] = useState([]);
  const [ mProduct, setProduct ] = useState(product || {});
  const [ mStock, setStock ] = useState({});
  const [ skuDetail, setSkuDetail ] = useState([]);

  useEffect(() => {
    (async() => {
      if (!mProduct?.id) {
        return;
      }
      const { embedded } = await WarehouseService.fetch({ productId: mProduct.id });
      setInStocks(embedded);
    })();
  }, [mProduct]);

  const onFinish = useCallback(async (values) => {
 
    const genDetail = (datas) => datas.map((id) => ({ 
      id,
      text: skuDetail.find(detail => detail.id === id)?.value || '' 
    }));

    const mSkuDetails = Object.entries(values).filter(([key]) => key.startsWith(SKU_DETAIL_ID_PREFIX))
    .map(([key, values]) => {
      const text = key.replace(SKU_DETAIL_ID_PREFIX, '');
      return { text, values: genDetail(values) };
    });

    let mValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => !key.startsWith(SKU_DETAIL_ID_PREFIX))
    );

    const { skuId } = mValues;
    const skuName = mProduct?.skus.find(sku => sku.id === skuId)?.name || '';
    let model = {
      ...mValues,
      stockName: mStock?.name || '',
      skuName
    };
    const { message: msg, data  } = await RequestUtils.Post('/warehouse/created', { model, mSkuDetails });
    message.success(msg || 'Thêm mới thành công');
    onSave(data);
  }, [onSave, skuDetail, mStock, mProduct]);

  const onChangeGetSelectedItem = (value, nProduct) => {
    setSkus(nProduct?.skus || []);
    setProduct(nProduct);
    form.setFieldsValue({ skuId: undefined });
  };

  const onChangeGetSelectedSku = (value, item) => {
    setSkuDetail(item?.skuDetail || []);
    const values = form.getFieldsValue();
    for(const key in values) {
      if (key.startsWith(SKU_DETAIL_ID_PREFIX)) {
        form.setFieldsValue({ [key]: undefined });
      }
    }
  };

  const onChangeGetStockItem = (value, stock) => {
    setStock(stock);
  };

  const memoSkuDetail = React.useMemo(() => {
    const groupedData  = skuDetail.reduce((oKey, item) => {
      if (!oKey[item.name]) {
        oKey[item.name] = [];
      }
      oKey[item.name].push(item);
      return oKey;
    }, {});

    const numberOfKeys = Object.keys(groupedData).length;
    return Object.keys(groupedData).map((groupName) => (
      <Col key={groupName} span={numberOfKeys <= 1 ? 24 : 12}>
        <FormSelect
          mode='multiple'
          name={`${SKU_DETAIL_ID_PREFIX}${groupName}`}
          valueProp='id'
          titleProp='value'
          label={`Chọn ${groupName}`}
          placeholder={`Chọn ${groupName}`}
          resourceData={groupedData[groupName]}
          required
        />
      </Col>
    ))
  }, [skuDetail]);

  const onChangeSelected = (item) => {
    const { skuInfo, ...params } = item;
    form.setFieldsValue(params);

    /* Lấy SKU trong sản phẩm để lọc detail */
    const { skus } = mProduct;
    setSkuDetail(skus?.find(i => i.id === item.skuId)?.skuDetail ?? []);

    /* Fill vào form */
    for(let sku of skuInfo) {
      let key = `${SKU_DETAIL_ID_PREFIX}${sku.text}`
      form.setFieldsValue({ [key]: sku?.values?.map(i => i.id) ?? [] });
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24}>
          <FormHidden name="id" />
        </Col>
        <Col span={12}>
          <FormSelectInfiniteProduct
            label='Chọn sản phẩm'
            placeholder='Chọn sản phẩm'
            name='productId'
            required
            onChangeGetSelectedItem={onChangeGetSelectedItem}
          />
        </Col>
        <Col span={12}>
          <FormSelect
            label='SKU'
            name='skuId'
            valueProp='id'
            titleProp='name'
            placeholder='Nhập tên SKU'
            required
            resourceData={skus}
            onChangeGetSelectedItem={onChangeGetSelectedSku}
          />
        </Col>
        { memoSkuDetail }
        <Col span={12}>
          <FormInputNumber
            label='Số lượng'
            name='quantity'
            required
            placeholder={'Nhập số lượng'}
            style={{ width: '100%' }}
            min={1}
            messageRequire='Số lượng không được để trống'
          />
        </Col>
        <Col span={12}>
          <FormSelectInfiniteProvider 
            label='Nhà cung cấp'
            name='providerId'
            placeholder='Chọn nhà cung cấp'
            required
            messageRequire='Nhà cung cấp không được để trống'
          />
        </Col>
        <Col span={24}>
          <FormInfiniteStock 
            onChangeGetSelectedItem={onChangeGetStockItem}
            label='Kho hàng'
            name='stockId'
            placeholder='Chọn kho hàng'
            required
            messageRequire='Kho hàng không được để trống'
          />
        </Col>
        {/* Lịch sử nhập kho */}
        <Col span={24}>
          <InStockTable 
            data={inStocks} 
            onChangeSelected={onChangeSelected} 
          />
        </Col>
        <Col span={24}>
          <BtnSubmit marginTop={10} text='Hoàn thành' />
        </Col>
      </Row>
    </Form>
  )
};

const ShowSkuDetail = ({ skuInfo }) => {
  if (!arrayNotEmpty(skuInfo)) {
    return <span />;
  }
  const maxLines = 2;
  const itemsToShow = skuInfo.slice(0, maxLines);
  return <>
    {itemsToShow.map((item) => item.text).join(', ') || ''}
    {skuInfo.length > maxLines && <div>...</div>}
  </>;
};

const InStockTable = ({ data, onChangeSelected }) => {

  const [ selectedRowKey, setSelectedRowKey ] = useState(null);
  const onChangeSelectedRow = (key, item) => {
    setSelectedRowKey(key);
    onChangeSelected(item);
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "skuName",
      key: "skuName"
    },
    {
      title: "Kho hàng",
      dataIndex: "stockName",
      key: "stockName"
    },
    {
      title: "Chi tiết",
      key: "detail",
      render: (_, record) => <ShowSkuDetail skuInfo={record.skuInfo} />
    },
    {
      title: "Chọn",
      dataIndex: "action",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <input
            type="radio"
            checked={selectedRowKey === record.id}
            onChange={() => onChangeSelectedRow(record.id, record)}
          />
        </div>
      )
    }
  ];

  const onRow = (record) => {
    return {
      onClick: () => {
        setSelectedRowKey(record.id);
      }
    }
  };

  return arrayNotEmpty(data) ? (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={false}
      onRow={onRow}
      rowClassName={() => "editable-row"}
      style={{ cursor: "pointer", marginBottom: 20 }}
    />
  ) : null;
};

export default ModalNhapKho;