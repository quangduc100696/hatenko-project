import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { downloadFileByURL, getFileName, splitFile } from 'utils/fileUtils';

import { CsvIcon, DownloadIcon, PdfIcon } from '../Icons/SVGIcons';
import { FileAction, FileIcon, FileText, FileWrapper } from './styles';

export const FileName = ({ url, icon }) => {
  const { fileType, fileName } = splitFile(url);
  return (
    <Tooltip title={url}>
      <FileText>
        {icon && <span>{icon}</span>}
        <div>
          <span>{fileName}</span>
          <span>.{fileType}</span>
        </div>
      </FileText>
    </Tooltip>
  );
};

const File = ({ url }) => {

  const { t } = useTranslation();
  const { fileType } = splitFile(url);
  const icon = fileType === 'pdf' ? <PdfIcon /> : <CsvIcon />;

  return (
    <FileWrapper>
      <FileIcon>{icon}</FileIcon>
      <FileName url={url} />
      <FileAction>
        <Tooltip title={t('button.download')}>
          <DownloadIcon
            onClick={() => downloadFileByURL({ fileName: getFileName(url), url }) }
          />
        </Tooltip>
      </FileAction>
    </FileWrapper>
  );
};

export default File;
