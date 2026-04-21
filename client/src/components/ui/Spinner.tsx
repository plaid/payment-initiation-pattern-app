import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
  </div>
);

Spinner.displayName = 'Spinner';
export default Spinner;
