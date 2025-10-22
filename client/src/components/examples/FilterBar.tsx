import { useState } from 'react';
import FilterBar from '../FilterBar';

export default function FilterBarExample() {
  const [filters, setFilters] = useState([
    { id: '1', label: 'T-Shirts', category: 'product' },
    { id: '2', label: 'Screen Print', category: 'method' },
    { id: '3', label: 'Black', category: 'color' },
  ]);

  return (
    <div className="p-8">
      <FilterBar 
        activeFilters={filters}
        onRemoveFilter={(id) => {
          console.log('Remove filter:', id);
          setFilters(filters.filter(f => f.id !== id));
        }}
        onClearAll={() => {
          console.log('Clear all filters');
          setFilters([]);
        }}
      />
    </div>
  );
}
