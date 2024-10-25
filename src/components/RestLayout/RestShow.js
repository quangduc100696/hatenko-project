import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import isEmpty from 'lodash/isEmpty';
import BreadcrumbCustom from 'components/common/BreadcrumbCustom';
import PageTitle from 'components/common/PageTitle';
import { RestShowContext } from 'components/context/RestShowContext';
import { getQueryParamsFromUrl } from 'utils/tools';
import { useLocation } from "react-router-dom";

const RestShow = ({
  useGetOneQuery,
  children,
  title,
  initFilter = {},
  uri,
  onBeforeProcessData = (value) => value,
  extraAction,
  formatBreadcrumb,
  showHeader = true,
}) => {

  const { t } = useTranslation();
  let { search } = useLocation();

  const params = getQueryParamsFromUrl(search);
  const { record, refetch } = useGetOneQuery({ filter: {...params, ...initFilter}, uri, onBeforeProcessData });

  return isEmpty(record) ? (
    <div className="flex-center">
      <Spin />
    </div>
  ) : (
    <RestShowContext.Provider value={{ record: record || {}, refetch }}>
      { formatBreadcrumb && <BreadcrumbCustom data={formatBreadcrumb(record)} /> }

      { showHeader && (
        <PageTitle
          title={t(title)}
          extraAction={extraAction}
        />
      )}

      <div className="rest-show-content">{children}</div>
    </RestShowContext.Provider>
  );
};

export default RestShow;
