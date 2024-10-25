import FormUploadFile from 'components/form/FormUploadFile';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const UploadWrapper = styled.div`
  .upload-image-wrapper {
    display: block !important;
  }
`;

const FormUpload = ({
  tblName = "customer_order",
  label = "contracts.file"
}) => {
  const { t } = useTranslation()
  return (
    <UploadWrapper>
      <FormUploadFile
        name="files"
        multiple={true}
        accept=".xlsx, .doc, .docx, .pdf, image/*"
        placeholder={label}
        onlyShowImg={false}
        isShowName
        label={t(label)}
        tblName={tblName}
        defaultSourceKey="file" 
      />
    </UploadWrapper>
  );
};

export default FormUpload;
