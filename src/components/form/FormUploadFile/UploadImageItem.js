import { useMemo } from 'react';
import { DeleteOutlined, EyeOutlined, LoadingOutlined, ExclamationCircleOutlined, FileOutlined } from '@ant-design/icons';
import { isImageFile } from 'utils/fileUtils';
import { useTranslation } from 'react-i18next';

const UploadImageItem = ({
  defaultSourceKey,
  onSetDefault,
  onMouseEnter,
  onMouseLeave,
  item,
  handlePreview,
  deleteImage,
  isDefaultImage,
  isShowName,
  onlyShowImg = true,
}) => {

  const { t } = useTranslation();
  const isImage = useMemo(
    () =>
      onlyShowImg ||
      (typeof item?.type === 'string' && item.type.includes('image')) ||
      isImageFile(item.name),
    [onlyShowImg, item],
  );

  const fileResult = useMemo(() => {
    if (item.status === 'error')
      return <ExclamationCircleOutlined className="loading error" />;
    if (item.status === 'uploading')
      return <LoadingOutlined className="loading" />;

    return isImage ? (
      <img className="image" src={item.url || item?.response} alt="" />
    ) : (
      <div className="file-item">
        <FileOutlined className="icon-file" />
      </div>
    );
  }, [item, isImage]);

  return (
    <div className="upload-image-wrapper">
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="uploadImage"
      >
        { fileResult }
        <div className="overlay">
          { isImage && (
            <EyeOutlined
              onClick={() =>
                handlePreview({ ...item, url: item.url || item.response })
              }
            />
          )}
          <DeleteOutlined onClick={() => deleteImage(item)} />
        </div>
        { defaultSourceKey && (
          <div
            role="presentation"
            onClick={() => onSetDefault(item)}
            className={`lbSetDefault  ${isDefaultImage ? 'active' : ''}`}
          >
            {t('button.setDefault')}
          </div>
        )}
      </div>
      { isShowName ? (
        <div className="file-name">{item.fileName || item.name || ''}</div>
      ) : null}
    </div>
  );
};

export default UploadImageItem;
