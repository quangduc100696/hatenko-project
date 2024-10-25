import { FileListWrapper } from './styles';
import File from './index';
import { arrayNotEmpty } from 'utils/dataUtils';

const FileList = ({ files }) => {
  return arrayNotEmpty(files) ? (
    <FileListWrapper>
      {files.map((file, index) => (
        <File url={file} key={index} />
      ))}
    </FileListWrapper>
  ) : ('');
};

export default FileList;
