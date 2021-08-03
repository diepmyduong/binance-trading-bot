import React, { useState } from "react";

export function TagsDiscount() {
  return (
    <div className="flex flex-wrap gap-1">
      {distcountTag.map((item, index) => (
        <div
          key={index}
          className="bg-danger text-white font-semibold text-xs sm:text:sm px-1 rounded-sm"
        >
          {item}
        </div>
      ))}
    </div>
  );
}
const distcountTag = ["-20%", "Giảm món"];
