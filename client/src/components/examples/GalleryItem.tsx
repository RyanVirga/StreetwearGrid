import GalleryItem from '../GalleryItem';
import hoodieImage from '@assets/generated_images/Navy_hoodie_hanging_shot_04240cfe.png';

export default function GalleryItemExample() {
  return (
    <div className="p-8 max-w-sm">
      <GalleryItem 
        image={hoodieImage}
        title="Minimalist Hoodie"
        method="Screen Print"
        productType="Hoodie"
        onClick={() => console.log('Gallery item clicked')}
      />
    </div>
  );
}
