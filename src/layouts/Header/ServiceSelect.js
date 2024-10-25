import { Select } from 'antd';
import i18next from 'i18next';
import useAccessLocations from 'hooks/useAccessLocations';
import useLocationId from 'hooks/useLocationId';

const { Option } = Select;

function ServiceSelect() {

  const { locationId, setLocationId } = useLocationId();
  const { isAll = true, locations = [] } = useAccessLocations();

  const onChangeLocation = (e) => {
    setLocationId(e);
  };

  return (
    <Select
      value={locationId || (isAll ? '' : locations[0]?.id)}
      className="border-none w-160"
      onChange={onChangeLocation}
    >
      { isAll ? <Option value="">{i18next.t('locations.all')}</Option> : null}
      { locations?.map((item, idx) => (
        <Option key={String(idx)} value={item?.id}>
          {item?.name}
        </Option>
      ))}
    </Select>
  );
}

export default ServiceSelect;
