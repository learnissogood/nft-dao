import React from "react";

const AmountIn = ({
  value,
  disabled,
  token,
  onChange,
  required,
}) => {
  return (
    <div className="flex justify-between bg-[#3a3a43] items-center flex-row lg:w-[400px] w-full min-w-full border-transparent min-h-[50px] lg:min-h-[96px] sm:p-8 p-4 rounded-[20px]">
      <input
        type="number"
        min="0.1"
        max="1"
        step="0.0001"
        value={value}
        placeholder="0.0"
        className="w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white"
        disabled={disabled}
        onChange={(e) => typeof onChange === "function" && onChange(e.target.value)}
        required={required}
      />

      <div className="py-2 px-4 rounded-xl font-poppins font-bold text-white">
        {token}
      </div>
    </div>
  );
};

export default AmountIn;
