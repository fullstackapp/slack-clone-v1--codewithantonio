import Image from 'next/image';
import { useRef } from 'react';

import { LightGallery as LightGalleryType } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';
import LightGallery from 'lightgallery/react';

interface ThumbnailProps {
  url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  const lightBoxRef = useRef<LightGalleryType | null>(null);

  if (!url) return null;

  return (
    <>
      <div className='relative aspect-square max-w-[360px] cursor-zoom-in overflow-hidden rounded-lg border'>
        <Image
          className='object-cover'
          alt='Course image'
          src={url}
          fill
          onClick={() => lightBoxRef.current?.openGallery()}
        />
      </div>
      <LightGallery
        onInit={(ref) => {
          if (ref) {
            lightBoxRef.current = ref.instance;
          }
        }}
        speed={500}
        plugins={[lgZoom]}
        dynamic
        download={false}
        dynamicEl={[{ src: url, thumb: url }]}
      />
    </>
  );
};

export default Thumbnail;
