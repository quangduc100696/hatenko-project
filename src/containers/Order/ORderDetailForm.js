import { Tag, Form, Row, Col } from "antd";
import { FormContextCustom } from "components/context/FormContextCustom";
import FormAutoCompleteCustomer from "components/form/AutoCompleteInfinite/FormAutoCompleteCustomer";
import FormAutoCompleteInfinite from "components/form/AutoCompleteInfinite/FormAutoCompleteInfinite";
import FormInput from "components/form/FormInput";
import FormInputNumber from "components/form/FormInputNumber";
import FormSelect from "components/form/FormSelect";
import { SUCCESS_CODE } from "configs";
import { DISCOUNT_UNIT_CONST } from "configs/localData";
import ProductSumary from "containers/Product/ProductSumary";
import { useGetAllProductQuery } from "hooks/useData";
import { useCallback, useContext } from "react";
import { arrayEmpty, formatMoney } from "utils/dataUtils";
import RequestUtils from "utils/RequestUtils";
import CustomButton from 'components/CustomButton';
import FormTextArea from "components/form/FormTextArea";
import { ShowPriceStyles } from "./styles";

const ORderDetailForm = () => {
  const { record, updateRecord } = useContext(FormContextCustom);
  const onSelectProduct = useCallback((value) => {
    RequestUtils.Get("/product/find-by-name", { name: value}).then( ({ data, errorCode }) => {
      if(errorCode === SUCCESS_CODE && data?.id) {
        updateRecord({ product: data});
      }
    })
  }, [updateRecord]);

  return <>
    <Form.Item 
      noStyle
      shouldUpdate={ (prevValues, curValues) => prevValues.code !== curValues.code }
    >
      {({ getFieldValue }) => (
        <HeadDetail  details={record?.details ?? []} currentCode={getFieldValue('code')} />
      )}
    </Form.Item>
    <Row gutter={16} style={{marginTop: 20}}>
      <Col md={12} xs={24}>
        <FormInput 
          required
          name="name" 
          label="Tên đơn"
          placeholder="Nhập tên đơn"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormAutoCompleteCustomer 
          required
          label="Khách hàng"
          searchKey="mobile"
          require
          placeholder="Tìm kiếm khách hàng"
        />
      </Col>
      <Col md={24} xs={24}>
        <ProductSumary data={record?.product ?? {}} />
        <div style={{ margin: '20px 0px' }}>
          <p><strong>Thông tin đơn hàng</strong></p>
          <div className="line-dash"></div>
        </div>
      </Col>
      <Col md={12} xs={24}>
        <FormAutoCompleteInfinite 
          useGetAllQuery={useGetAllProductQuery}
          label="Sản phẩm"
          name="productId"
          valueProp="name"
          searchKey="name"
          required
          placeholder="Tìm kiếm Sản phẩm"
          onSelect={onSelectProduct}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInputNumber 
          required
          name="quantity"
          label="Số lượng"
          min="0" 
          placeholder="Nhập Số lượng"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect 
          name="sku"
          label="SKU"
          required
          resourceData={record?.product?.skus ?? []}
          placeholder="Chọn SKU"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInputNumber 
          required
          name="price"
          label="Đơn giá"
          min="0" 
          placeholder="Nhập Đơn giá"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect 
          name="discountUnit"
          titleProp="text"
          valueProp="value"
          resourceData={DISCOUNT_UNIT_CONST}
          label="Giảm giá nếu có"
          placeholder="Chọn hình thức giảm"
        />
      </Col>
      <Col md={12} xs={24}>
        <FormInputNumber 
          label="Giảm giá % / VND"
          min="0" 
          name="discountValue"
          placeholder="Nhập giá trị"
        />
      </Col>
      <ShowPriceStyles md={24} xs={24}>
        <h3 className="lo-order">Thành tiền: {formatMoney(30000000)}</h3>
      </ShowPriceStyles>
      <Col md={24} xs={24}>
        <FormTextArea 
          rows={3}
          name="note"
          label="Ghi chú đơn"
          placeholder="Nhập ghi chú"
        />
      </Col>
      <Col md={24} xs={24} style={{display: 'flex', justifyContent:'end', marginBottom: 20}}>
        <CustomButton htmlType="submit" />
        <CustomButton 
          color="primary" 
          variant="outlined"
          title="Thêm cơ hội mới" 
          style={{marginLeft: 20}} 
        />
      </Col>
    </Row>
  </>
}

const HeadDetail = ({ details, currentCode }) => {
	return arrayEmpty(details) 
  ? <Tag size="small" style={{ cursor: "pointer" }} color={'#2db7f5'}>{ (details.length + 1) } - Cơ hội mới</Tag>
  : details.map((item, id) => {
    let color = item.code === currentCode ? '#2db7f5' : '#ccc';
    const newName = item.productName;
    return (
      <Tag key={id} size="small" style={{ textAlign: 'center', cursor: "pointer" }} color={color}>
        {item.code} {!newName ? '' : <span><br/>{newName}</span>}
      </Tag>
    )
  })
}

export default ORderDetailForm;