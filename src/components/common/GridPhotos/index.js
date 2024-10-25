import { useRef, useMemo } from 'react';
import { take } from 'lodash';
import EmptyData from 'components/common/EmptyData';
import ModalPreview from './ModelPreview';
import PhotoItem from './PhotoItem';
import GridPhotosWrapper from './styles';

const GridPhotos = ({
  images = [],
  picsShowing,
  isShowAll = true,
  isShowEmpty = true,
  maxWidth,
  minWidth
}) => {

  const modalPreviewRef = useRef(null);
  const onToggle = (index) => {
    modalPreviewRef.current && modalPreviewRef.current.open(images);
    setTimeout(() => {
      modalPreviewRef.current && modalPreviewRef.current.goToImage(index);
    }, 100);
  };

  const restImageObj = useMemo(() => {
    if (!isShowAll) {
      return { subCount: 0, remainImages: take(images) || [] };
    }
    if (picsShowing) {
      const cloneImage = [...(images || [])];
      const restSubImage = cloneImage?.splice(picsShowing) || [];
      return { subCount: restSubImage.length, remainImages: cloneImage };
    }
    return { subCount: 0, remainImages: images };
  }, [images, picsShowing]); // eslint-disable-line

  const { subCount, remainImages } = restImageObj;
  const lastIndexRemain = (remainImages?.length || 0) - 1;
  return (
    <>
      <GridPhotosWrapper>
        {isShowEmpty && lastIndexRemain < 0 ? (
          <EmptyData title="error.noPhoto" />
        ) : (
          remainImages?.map((image, index) => {
            if (subCount && index === lastIndexRemain)
              return (
                <PhotoItem
                  key={String(index)}
                  image={image}
                  onPreview={() => onToggle(index)}
                  subCount={subCount}
                  style={{ maxWidth, minWidth }}
                />
              );
            return (
              <PhotoItem
                key={String(index)}
                image={image}
                onPreview={() => onToggle(index)}
                style={{ maxWidth, minWidth }}
              />
            );
          })
        )}
      </GridPhotosWrapper>
      <ModalPreview ref={modalPreviewRef} />
    </>
  );
};

export default GridPhotos;
