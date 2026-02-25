import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface SearchSectionProps {
  onSearch: (value: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText, onSearch]);

  return (
    <Search
      placeholder="搜索酒店名称、英文名或地址"
      allowClear
      style={{ width: 320 }}
      onSearch={(value) => {
        setSearchText(value);
        onSearch(value); // Immediate trigger
      }}
      onChange={(e) => setSearchText(e.target.value)}
      value={searchText}
    />
  );
};

export default SearchSection;
