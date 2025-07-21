import { Select } from 'antd';
import i18next from 'i18next';

const { Option } = Select;
function ServiceSelect({ serviceId, setServiceId }) {

  const locations = [
    {name: 'Cơ hội', 'link': '/sale/co-hoi'},
    {name: 'Đơn hàng', 'link': '/sale/order'},
    {name: 'Sản phẩm', 'link': '/sale/co-hoi'},
    {name: 'Khách hàng', 'link': '/product'},
  ];
  
  const onChangeLocation = (e) => {
    setServiceId(e);
  };

  return (
    <Select
      value={serviceId}
      className="border-none w-160 h-40"
      onChange={onChangeLocation}
      placeholder={i18next.t('services.all')}
    >
      { locations?.map((item, idx) => (
        <Option key={String(idx)} value={item?.id}>
          {item?.name}
        </Option>
      ))}
    </Select>
  );
}

export default ServiceSelect;
