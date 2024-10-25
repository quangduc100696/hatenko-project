import { Form, Input } from 'antd';

const FormHidden = ({name, ...props}) => (
    <Form.Item name={name} {...props} hidden >
        <Input />
    </Form.Item>
)

export default FormHidden;