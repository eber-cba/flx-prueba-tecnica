import React, { useState } from "react";

// Custom hook para manejar los inputs del formulario
export function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
    setValue, // Añadir la función setValue al retorno del hook
  };
}
