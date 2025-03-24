import { Input } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { SearchInputStyles } from './styles';

const isEmail = (q) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(q);
const isPhoneNumber = (q) => /^\d{9,15}$/.test(q); 
const { Search } = Input;
function SearchInput({serviceId, setServiceId}) {

  const { t } = useTranslation();
  let navigate = useNavigate();
  const searchRef = useRef();
  const [ searchValue, setSearchValue]  = useState();

  const handleSearch = (value) => {
    const q = value?.trim();
    let paramName = "productName"; 
    let paramNamesp = "name";

    if (isEmail(q)) {
      paramName = "customerEmail";
    } else if (isPhoneNumber(q)) {
      paramName = "mobile";
    }

    if (isEmail(q)) {
      paramName = "customerEmail";
    } else if (isPhoneNumber(q)) {
      paramName = "mobile";
    }
  
    if(serviceId === '0') {
      navigate(`/sale/co-hoi?${paramName}=${q}`);
    }
    if(serviceId === '1') {
      navigate(`/sale/order?${paramNamesp}=${q}`);
    }
    if(serviceId === '2') {
      navigate(`/product?${paramNamesp}=${q}`);
    }
    if(serviceId === '3') {
      navigate(`/?${paramNamesp}=${q}`);
    }
    setSearchValue('')
    setServiceId(null)
  }

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
