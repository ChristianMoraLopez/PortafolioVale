import { useState } from 'react';
import Gallery from 'react-image-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';  // Ensure this is the correct import for styles

const photos = [
  { src: '/images/makeup1.jpg', width: 4, height: 3 },
  { src: '/images/photography1.jpg', width: 4, height: 3 },
  // Add more images as needed
];

const GalleryPage = () => {
  const [currentImage, setCurrentImage] = useState<number | null>(null);

  const handleGalleryClick = (event: React.MouseEvent, index: number) => {
    setCurrentImage(index);
  };

  return (
    <div>
      <Gallery
        items={photos.map((photo) => ({
          original: photo.src,
          thumbnail: photo.src,
        }))}
        onClick={(event) => {
          const imgElement = event.target as HTMLImageElement;
          const index = photos.findIndex((photo) => photo.src === imgElement.src);
          handleGalleryClick(event, index);
        }}
      />

      {currentImage !== null && (
        <Lightbox
          open={currentImage !== null}
          close={() => setCurrentImage(null)}
          slides={photos.map(photo => ({ src: photo.src }))}
          index={currentImage}
        />
      )}
    </div>
  );
};

export default GalleryPage;
