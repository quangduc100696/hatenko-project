import { getStaticImageUrl } from 'utils/tools';

const Image = props => {
  const onError = (e) => {
    e.currentTarget.src = getStaticImageUrl();
  };
  return <img {...props} alt="" onError={onError} />;
};

export default Image;
