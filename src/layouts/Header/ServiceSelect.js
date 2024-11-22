import { Select } from 'antd';
import i18next from 'i18next';
import useServiceId from 'hooks/useServiceId';

const { Option } = Select;
function ServiceSelect() {

  const { serviceId, setServiceId } = useServiceId();
  const isAll = true, locations = [];

  const onChangeLocation = (e) => {
    setServiceId(e);
  };

  return (
    <Select
      value={serviceId}
      className="border-none w-160 h-40"
      onChange={onChangeLocation}
    >
      { isAll ? <Option value="">{i18next.t('services.all')}</Option> : null }
      { locations?.map((item, idx) => (
        <Option key={String(idx)} value={item?.id}>
          {item?.name}
        </Option>
      ))}
    </Select>
  );
}

export default ServiceSelect;
