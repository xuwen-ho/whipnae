import React from 'react';

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
  );
};

export default SectionHeader;
