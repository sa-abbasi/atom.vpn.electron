import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';

const CSelect = observer(({ label, items, selectedValue, OnSelected }) => {
  const lablelWidth = 220;
  const [defaultValue, setDefaultValue] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const onItemChange = (e) => {
    OnSelected(e.target.value);
    setDefaultValue(e.target.value);
    // const sprotocol = protocols.filter((item) => item.name === e.target.value);
    // const rr = sprotocol;
  };

  const Initialize = () => {
    if (isInitialized) return;

    setDefaultValue(selectedValue);

    setIsInitialized(true);
  };

  Initialize();

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <div className="input-group mb-2 mx-auto" style={{ width: 'auto-fit' }}>
      <label
        className="input-group-text"
        style={{ minWidth: `${lablelWidth}px` }}
      >
        {label}
      </label>
      <select
        className="form-select form-select-sm"
        style={{ maxWidth: '150px', width: '110px' }}
        onChange={onItemChange}
        value={defaultValue}
      >
        {items.map((item) => (
          <option value={item.value}>{item.name}</option>
        ))}
      </select>
    </div>
  );
});

export default CSelect;
