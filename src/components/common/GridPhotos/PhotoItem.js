import Image from 'components/common/Image';

const PhotoItem = ({
  onPreview,
  image,
  subCount,
  className,
  style,
}) => {
  return (
    <div className={`photo-item-wrapper ${className || ''}`} style={style}>
      <div className="photo-item">
        <div className="photo-item-main">
          <Image
            src={image}
            alt=""
            className="image-photo-item"
            role="presentation"
            onClick={onPreview}
          />
          { subCount && (
            <div
              className="photo-overlay"
              role="presentation"
              onClick={onPreview}
            >
              <span className="pics-number">{`+ ${subCount}`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PhotoItem.defaultProps = {
  onPreview: () => null,
};

export default PhotoItem;
