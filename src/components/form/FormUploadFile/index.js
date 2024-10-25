import { useCallback, useState, useEffect, useContext } from 'react';
import { Upload, notification } from 'antd';
import xor from 'lodash/xor';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import { FormContextCustom } from 'components/context/FormContextCustom';
import { useTranslation } from 'react-i18next';
import { checkFileType, checkValidFileSize } from 'utils/fileUtils';
import { getStaticImageUrl } from 'utils/tools';
import { FormMultiUploadWrapper, ModalViewStyles } from './styles';
import UploadImageItem from './UploadImageItem';
import Axios from 'axios';
import { GATEWAY } from 'configs';
import { dataArray } from 'utils/dataUtils';
import ResourceService from 'services/ResourceService';
import { useLocation } from 'react-router-dom';

const { Dragger } = Upload;
const log = (key, val) => console.log('[component.form.FormUploadFile] ' + key, val);

export const FormUploadFile = ({
  name,
  label,
  defaultSourceKey,
  width = '100px',
  height = '100px',
  objectFit = 'cover',
  tblName,
  subPath = 'images',
  multiple = true,
  placeholder = 'common.image',
  disabled,
  accept = 'image/*',
  isShowName,
  onlyShowImg,
  children
}) => {

  const { t } = useTranslation();
  const location = useLocation();
  const { record, updateRecord } = useContext(FormContextCustom);
  const [ disabledUpload, setDisabledUpload ] = useState(false);
  const [ defaultImage, setDefaultImage ] = useState(null);
  const [ previewVisible, setPreviewVisible ] = useState(false);
  const [ previewImage, setPreviewImage ] = useState('');
  const [ fileList, setFileList ] = useState([]);

  /* Lây data từ chi tiết bảng table */
  const { state } = location;
  
  useEffect(() => {
    state?.id && ResourceService.listMedia(tblName, state.id).then(files => {
      setFileList(makeFileList(files));
    });
  }, [state, tblName]);

  useEffect( () => {
    let files = get(record, name) || [];
    setFileList(files ? makeFileList(files) : []);
    if(defaultSourceKey && record[defaultSourceKey]) {
      setDefaultImage(getStaticImageUrl(record[defaultSourceKey]));
    }
    /* eslint-disable-next-line */
  }, [record]);

  const handleCancel = () => {
    setPreviewVisible(false);
  };

  const handlePreview = (file) => {
    setPreviewVisible(true);
    setPreviewImage(file.url);
  };

  const deleteImage = (item) => {
    log('====== deleteImage ======', item)
    const results = xor(fileList, [item]);
    updateRecord({[name]: results});
  };

  const onMouseEnter = useCallback(() => {
    setDisabledUpload(true);
  }, []);

  const onMouseLeave = useCallback( () => {
    setDisabledUpload(false);
  }, []);

  const onSetDefault = useCallback( item => {
    ResourceService.updateMediaDefault(item.id, tblName);
  }, [tblName]);

  const handleBeforeUpload = async (file) => {
    let isValidFileType = checkFileType(file);
    if (accept !== 'image/*') {
      const splitFileName = file?.name.split('.');
      const typeFile = splitFileName[splitFileName.length - 1];
      isValidFileType = accept?.split(', ').includes(`.${typeFile}`);
    }
    if (isValidFileType) {
      return checkValidFileSize(file, t(placeholder));
    }
    notification.error({
      message: t('error.title'),
      description: t('error.fileInvalid'),
      duration: 2,
    });
    return Upload.LIST_IGNORE;
  };

  const requestUpFile = useCallback(({file}) => {
    const formData = new FormData();
    formData.append('files[]', file);
    formData.append('object', tblName);
    formData.append('subPath', subPath);
    formData.append('objectId', state?.id || '')
    Axios.post(GATEWAY + '/resource/uploads', formData).then(ret => ret.data).then(dataArray).then(res => {
      const images = record[name] || [];
      updateRecord({[name]: [...images, ...res]});
    });
  }, [tblName, subPath, record, state, name, updateRecord]);

  return (
    <FormMultiUploadWrapper
      className="multi-upload-wrapper"
      width={width}
      height={height}
      objectFit={objectFit}
    >
      { label && <p><strong>{label}</strong></p> }
      <Dragger
        customRequest={requestUpFile}
        accept={accept}
        multiple={multiple}
        disabled={disabled || disabledUpload}
        fileList={fileList}
        showUploadList={false}
        onPreview={handlePreview}
      > 
        <div className="selectedImage">
          { fileList.map((img, index) => (
            <UploadImageItem
              key={String(index)}
              defaultSourceKey={defaultSourceKey}
              onSetDefault={onSetDefault}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              deleteImage={deleteImage}
              handlePreview={handlePreview}
              item={img}
              isDefaultImage={defaultImage === img.url}
              isShowName={isShowName}
              onlyShowImg={onlyShowImg}
            />
          ))}
          { children || (
            <div className="uploadArea">
              <img className="image-upload" src={getStaticImageUrl('upload-image.png')} alt="upload.png" />
              <div className="ant-upload-text">
                {t('common.upload')} {t(placeholder)}
              </div>
            </div>
          )}
        </div>
      </Dragger>
      <ModalViewStyles
        open={previewVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </ModalViewStyles>
    </FormMultiUploadWrapper>
  );
};

const makeObjFile = (value) => ({
  uid: value,
  name: value,
  status: 'done',
  url: value,
  id: value,
});

const makeFileList = (values) => {
  if (isEmpty(values)) {
    return [];
  }

  if (Array.isArray(values)) {
    return values.map(value => value && value.url ? { uid: value.url, ...value } : makeObjFile(value) );
  }
  
  if (isPlainObject(values)) {
    return [{ ...makeObjFile(values.url), ...values}];
  }

  return [ makeObjFile(values) ];
};

export default FormUploadFile;
