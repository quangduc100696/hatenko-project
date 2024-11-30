import { Tag, Form } from "antd";
import { FormContextCustom } from "components/context/FormContextCustom";
import { useContext } from "react";
import { arrayEmpty } from "utils/dataUtils";

const ORderDetailForm = () => {
  const { record } = useContext(FormContextCustom);
  return <>
    <Form.Item 
      noStyle
      shouldUpdate={ (prevValues, curValues) => prevValues.code !== curValues.code }
    >
      {({ getFieldValue }) => (
        <HeadDetail  details={record?.details ?? []} currentCode={getFieldValue('code')} />
      )}
    </Form.Item>
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