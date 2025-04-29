import React from "react";
import Select from "react-select";

//  options for sorting
const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "oldest", label: "Oldest" },
  { value: "price_low_high", label: "Price: Low to High" },
  { value: "price_high_low", label: "Price: High to Low" },
  { value: "pages_low_high", label: "Pages: Low to High" },
  { value: "pages_high_low", label: "Pages: High to Low" },
];

// Custom styles
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    marginTop: "10px",
    borderRadius: "20px",
    backgroundColor: "#444",
    border: "none",
    boxShadow: state.isFocused ? "0 0 0 2px #aaa" : "none",
    padding: "4px 10px",
  }),
  input: (base) => ({ ...base, color: "white", caretColor: "white" }),
  menu: (base) => ({ ...base, borderRadius: "0px", zIndex: 100 }),
  menuList: (base) => ({ ...base, maxHeight: "225px" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#ddd"
      : state.isFocused
      ? "#eee"
      : "white",
    color: "#333",
    borderRadius: "10px",
    padding: "10px 15px",
  }),
  singleValue: (base) => ({ ...base, color: "white" }),
};

// FilterDropdown Component
const FilterDropdown = ({
  selectedSortBy,
  onSortByChange,
  selectedGenre,
  onGenreChange,
  selectedAuthor,
  onAuthorChange,
  selectedPublisher,
  onPublisherChange,
  genreOptions = [],
  authorOptions = [],
  publisherOptions = [],
}) => {
  const dropdownConfigs = [
    {
      label: "By Genre",
      options: genreOptions,
      value: selectedGenre,
      onChange: onGenreChange,
    },
    {
      label: "By Author",
      options: authorOptions,
      value: selectedAuthor,
      onChange: onAuthorChange,
    },
    {
      label: "By Publisher",
      options: publisherOptions,
      value: selectedPublisher,
      onChange: onPublisherChange,
    },
    {
      label: "Sort By",
      options: sortOptions,
      value: selectedSortBy,
      onChange: onSortByChange,
    }, 
  ];

  return (
    <div className="filter-dropdown-container">
      {dropdownConfigs.map(({ label, options, value, onChange }, index) => (
        <div className="filter-dropdown" key={index}>
          <label className="filter-label">{label}</label>
          <Select
            options={options}
            value={value}
            onChange={onChange}
            className="filter-select"
            classNamePrefix="react-select"
            styles={customSelectStyles}
          />
        </div>
      ))}
    </div>
  );
};

export default FilterDropdown;
