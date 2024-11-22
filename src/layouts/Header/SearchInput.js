import { Input } from 'antd';
import { stringify } from 'query-string';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { SearchInputStyles } from './styles';

const { Search } = Input;
function SearchInput() {

  const { t } = useTranslation();
  let navigate = useNavigate();

  const searchRef = useRef();
  const [ searchValue, setSearchValue]  = useState();

  const handleSearch = (value) => {
    const q = value?.trim();
    navigate({
      pathname: '/searchs/', ...(q && { search: stringify({ q }) })
    });
  };

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
        placeholder={t('input.searchHeader.placeholder')}
        onBlur={onBlur}
        onFocus={onFocus}
        onSearch={handleSearch}
        value={searchValue}
        onChange={onChangeSearchInput}
      />
    </SearchInputStyles>
  );
}

export default SearchInput;
