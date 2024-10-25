import times from 'lodash/times';
import { Skeleton } from 'antd';

const SkeletonList = ({ number = 3 }) => (
  <div>
    {times(number)?.map(index => (
      <Skeleton key={String(index)} avatar />
    ))}
  </div>
);

export default SkeletonList;
