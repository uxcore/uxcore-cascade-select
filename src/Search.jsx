import React from 'react';
import PropTypes from 'prop-types';

const Search = ({
  text,
  disabled,
  placeholder,
  searchOption,
  value,
  onValueChange,
  onSearchResultChange,
  onInputFocus,
  onInputBlur,
}) => (
  <input
    type="text"
    placeholder={placeholder}
    style={{ width: '100%', border: 'none', background: 'transparent' }}
    disabled={disabled}
    value={
      value !== null ? value : text
    }
    onChange={(e) => {
      const keywords = e.target.value;
      // 修复IE11下bug
      if (value === null && text === '' && keywords === '') {
        onValueChange(null);
      } else {
        onValueChange(keywords);
      }
      if (searchOption) {
        searchOption.doSearch(keywords, (searchResult) => {
          onSearchResultChange(searchResult);
        });
      }
    }}
    onFocus={onInputFocus}
    onBlur={onInputBlur}
  />
);

Search.propTypes = {
  value: PropTypes.string,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  searchOption: PropTypes.object,
  onSearchResultChange: PropTypes.func,
  onValueChange: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
};

Search.renderResult = (result, onSelect) => (
  <div
    className=""
    style={{
      background: '#fff',
      border: '1px solid #d9d9d9',
      boxShadow: '0 1px 4px 0 rgba(31,56,88,.15)',
      borderRadius: '3px',
      minWidth: '200px',
    }}
  >
    <ul className="kuma-select2-dropdown-menu">
      {
        result.map(item => (
          <li
            key={item.value}
            className="kuma-select2-dropdown-menu-item"
            onClick={() => onSelect(item)}
            onMouseEnter={(e) => {
              e.target.className += ' kuma-select2-dropdown-menu-item-active';
            }}
            onMouseLeave={(e) => {
              e.target.className = e.target.className.replace(' kuma-select2-dropdown-menu-item-active', '');
            }}
          >
            {item.label}
          </li>
        ))
      }
    </ul>
  </div>
);

export default Search;
