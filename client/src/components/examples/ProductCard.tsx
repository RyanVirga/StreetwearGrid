import ProductCard from '../ProductCard';
import teeImage from '@assets/generated_images/White_oversized_tee_flat_lay_bc01806a.png';

export default function ProductCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ProductCard 
        image={teeImage}
        name="Premium T-Shirt"
        specs="100% cotton, screen print ready"
        turnaround="5-7 days"
        minQuantity={50}
        onAddToRequest={() => console.log('Added to request')}
      />
    </div>
  );
}
