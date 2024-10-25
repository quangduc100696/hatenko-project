import { Button } from "antd";

const BtnSubmit = ({ marginTop = 20, text, ...props}) => 
    <div style={{marginTop: marginTop}}>
        <Button className="btn-next" type="primary" htmlType="submit" {...props}>{text}</Button>
    </div>

export default BtnSubmit;