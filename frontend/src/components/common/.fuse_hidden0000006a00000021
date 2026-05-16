import React from 'react';
import Select from 'react-select';

export interface OptionType {
  value: string;
  label: string;
}

interface AutocompleteSelectProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (option: OptionType | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  onInputChange?: (value: string, action: any) => void;
}

const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false,
  isClearable = true,
  onInputChange,
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable={isClearable}
      onInputChange={onInputChange}
      styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
    />
  );
};

export default AutocompleteSelect;
