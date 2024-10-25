import { Input, Select } from 'antd';
import { CUSTOMERS_TAB_KEYS, SEARCHABLE_PATH_ON_HEADER } from 'configs';
import useQueryParamsOnHeader from 'hooks/useQueryParamsOnHeader';
import { stringify } from 'query-string';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from "react-router-dom";
import { getQueryParamsFromUrl, getTabCustomer } from 'utils/tools';
import { SearchInputStyles } from './styles';

const { Search } = Input;
const { Option } = Select;

function SearchInput() {

  const { t } = useTranslation();
  let location = useLocation();
  let navigate = useNavigate();

  const currentTab = getTabCustomer(location.pathname);
  const searchRef = useRef();
  const [ searchValue, setSearchValue]  = useState();

  const { queryParamsOnHeader, setQueryParamsOnHeader } = useQueryParamsOnHeader();
  const typeSearch = queryParamsOnHeader?.type || CUSTOMERS_TAB_KEYS.individuals;

  useEffect(() => {
    if (currentTab && SEARCHABLE_PATH_ON_HEADER.includes(location.pathname)) {
      const searchQuery = getQueryParamsFromUrl(location.search)?.q;
      setSearchValue(searchQuery);
      setQueryParamsOnHeader({ type: currentTab, q: searchQuery,
      });
    } else {
      setQueryParamsOnHeader({
        type: CUSTOMERS_TAB_KEYS.individuals,
      });
    }
    /* eslint-disable-next-line */
  }, []);

  const handleSearch = (value) => {
    if (currentTab !== typeSearch) {
      const q = value?.trim();
      navigate({
        pathname: `/customers/${typeSearch}`,
        ...(q && {
          search: stringify({ q }),
        }),
      });
    }
    setQueryParamsOnHeader({ q: value?.trim(), });
  };

  const handleOnChangeType = (value) => {
    setSearchValue('');
    setQueryParamsOnHeader({ type: value, q: '' });
  };

  const selectBefore = (
    <Select
      value={typeSearch}
      onChange={handleOnChangeType}
      style={{ width: 120, height: 40 }}
    >
      <Option value="individuals">{t('memberTypes.individual')}</Option>
      <Option value="teams">{t('memberTypes.team')}</Option>
    </Select>
  );

  const onFocus = () => {
    searchRef?.current?.classList &&
      searchRef.current.classList.add('search-focused');
  };

  const onBlur = () => {
    searchRef?.current?.classList &&
      searchRef.current.classList.remove('search-focused');
  };

  const onChangeSearchInput = (e) => {
    setSearchValue(e?.target?.value);
  };

  return (
    <SearchInputStyles ref={searchRef}>
      <Search
        placeholder={
          ['teams'].includes(typeSearch) ? t('input.searchHeader.teamPlaceholder') : t('input.searchHeader.placeholder')
        }
        onBlur={onBlur}
        onFocus={onFocus}
        onSearch={handleSearch}
        addonBefore={selectBefore}
        value={searchValue}
        onChange={onChangeSearchInput}
      />
    </SearchInputStyles>
  );
}

export default SearchInput;
