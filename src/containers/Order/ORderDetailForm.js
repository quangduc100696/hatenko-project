import { Tag, Form, Row, Col } from "antd";
import { FormContextCustom } from "components/context/FormContextCustom";
import FormAutoCompleteInfinite from "components/form/AutoCompleteInfinite/FormAutoCompleteInfinite";
import FormInput from "components/form/FormInput";
import FormInputNumber from "components/form/FormInputNumber";
import FormSelect from "components/form/FormSelect";
import { DISCOUNT_UNIT_CONST } from "configs/localData";
import ProductSumary from "containers/Product/ProductSumary";
import { useGetAllProductQuery } from "hooks/useData";
import { useContext } from "react";
import { arrayEmpty, arrayNotEmpty, formatMoney } from "utils/dataUtils";
import CustomButton from 'components/CustomButton';
import FormTextArea from "components/form/FormTextArea";
import { ShowPriceStyles } from "./styles";
import { calPriceOff } from "utils/tools";
import FormHidden from "components/form/FormHidden";
import ShowCustomerInfo from "containers/Customer/ShowCustomerInfo";
import { useMount } from "hooks/MyHooks";
import { generateInForm } from "./utils";
import { cloneDeep } from "lodash";
import FormSelectAPI from "components/form/FormSelectAPI";

const ORderDetailForm = () => {
  const { record, updateRecord } = useContext(FormContextCustom);
  const onClickAddNewOrder = async () => {
    if(arrayEmpty(record?.details ?? [])) {
      return;
    }
    let nRecord = cloneDeep(record);
    let details = nRecord.details;
    let detail = cloneDeep(details[details.length - 1]);
    if(detail.code === "New") {
      return;
    }
    detail.id = "";
    detail.code = "New"
    detail.productName = "(Thêm cơ hội)"
    detail.skuId = null;
    detail.quantity = "";
    detail.price = "";
    detail.discount = {
      discountUnit: null,
      discountValue: ""
    }
    detail.note = "";
    detail.name = "";
    detail.status = null;

    details.push(detail);
    let rForm = await generateInForm(nRecord, details.length - 1);
    updateRecord(rForm);
  };

  return <>
    <FormHidden name="id" />
    <FormHidden name="detailCode" />
    <FormHidden name="detailId" />
    <Form.Item 
      noStyle
      shouldUpdate={ (prevValues, curValues) => prevValues.detailCode !== curValues.detailCode }
    >
      {({ getFieldValue }) => (
        <HeadDetail  details={record?.details ?? []} currentCode={getFieldValue('detailCode')} />
      )}
    </Form.Item>
    <Row gutter={16} style={{marginTop: 20}}>  
      <Col md={24} xs={24}>
        <ShowCustomerInfo customer={record?.customer ?? {}} />
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
          filterField="name"
          name="productName"
          valueProp="name"
          searchKey="name"
          required
          placeholder="Tìm kiếm Sản phẩm"
          customGetValueFromEvent={(productName, product) => {
            updateRecord({product, productName});
            return productName;
          }}
        />
      </Col>
      <Col md={12} xs={24}>
        <FormSelect 
          name="skuId"
          label="SKU"
          required
          resourceData={record?.product?.skus ?? []}
          placeholder="Chọn SKU"
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

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) => (
          prevValues.quantity !== curValues.quantity
          || prevValues.discountValue !== curValues.discountValue
          || prevValues.discountUnit !== curValues.discountUnit
          || prevValues.price !== curValues.price
        )}
      >	
        {({ getFieldValue }) => {
          const { skuId, quantity, discountValue, discountUnit, price  } = getFieldValue();
          const total = quantity * price;
          const pOff = calPriceOff({ discountValue, discountUnit, total });
          const totalAFD = total - pOff;
          return (
            <ShowPriceStyles md={24} xs={24}>
              <h3 className="lo-order">Thành tiền: {formatMoney(skuId ? (totalAFD > 0 ? totalAFD : 0) : 0)}</h3>
            </ShowPriceStyles>
          )
        }}
      </Form.Item>
      
      <Col md={24} xs={24}>
        <FormTextArea 
          rows={3}
          name="note"
          label="Ghi chú đơn"
          placeholder="Nhập ghi chú"
        />
      </Col>

      <Col md={12} xs={24}>
        <FormInput 
          required
          name="name" 
          label="Tên đơn"
          placeholder="Nhập tên đơn"
        />
      </Col>
      <Col md={12} xs={24}>
        {/* <FormSelect 
          resourceData={OrderService.allStatus}
          required
          name="status" 
          label="Trạng thái"
          placeholder="Chọn trạng thái"
        /> */}
         <FormSelectAPI
          required
          apiPath='status-order/fetch'
          apiAddNewItem='status-order/save'
          onData={(data) => data ?? []}
          label="Trạng thái"
          name="status"
          placeholder="Chọn trạng thái"
        />
      </Col>

      <Col md={24} xs={24} style={{display: 'flex', justifyContent:'end', marginBottom: 20}}>
        <CustomButton htmlType="submit" />
        <CustomButton 
          disabled={ (record?.id || 0) === 0}
          color="primary" 
          variant="outlined"
          title="Thêm cơ hội mới" 
          style={{marginLeft: 20}} 
          onClick={() => onClickAddNewOrder()}
        />
      </Col>
    </Row>
  </>
}

const HeadDetail = ({ details, currentCode }) => {

  const { form, record, updateRecord } = useContext(FormContextCustom);
  const onClick = async (index) => {
    if(arrayNotEmpty(details)) {
      /* SeT value In Current Form */
      let rForm = await generateInForm(record, index);
      updateRecord(rForm);
    }
  };

  useMount(() => {
    if(record?.id && arrayNotEmpty(details ?? [])) {
      form.setFieldsValue({ detailId: details[0].id });
    }
  });

	return arrayEmpty(details) 
  ? <Tag size="small" style={{ cursor: "pointer" }} color={'#2db7f5'}>{ (details.length + 1) } - Cơ hội mới</Tag>
  : details.map((item, id) => {
    let color = item.code === currentCode ? '#2db7f5' : '#ccc';
    const newName = item.productName;
    return (
      <Tag 
        onClick={()=> onClick(id)}
        key={id} 
        size="small" 
        style={{ textAlign: 'center', cursor: "pointer" }} 
        color={color}
      >
        {item.code} {!newName ? `${id + 1} Cơ hội mới` : <span><br/>{newName}</span>}
      </Tag>
    )
  })
}

export default ORderDetailForm;