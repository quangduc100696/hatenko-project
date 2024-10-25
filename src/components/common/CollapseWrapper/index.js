import { useState } from 'react';
import { Row, Col } from 'antd';

import ToggleButton from '../../RestActions/ToggleButton';
import CollapseWrapperStyles from './styles';

const CollapseWrapper = ({
  leftComponent,
  rightComponent,
  leftSpan,
  rightSpan,
}) => {
  const [ isCollapse, setIsCollapse ] = useState(false);

  const handleToggle = () => {
    setIsCollapse(!isCollapse);
  };

  return (
    <CollapseWrapperStyles>
      <Row gutter={20} className="row-collapsed-detail" wrap={false}>
        <Col
          xl={leftSpan}
          lg={leftSpan}
          md={24}
          xs={24}
          className={`col-info ${isCollapse ? 'collapsed-container' : ''}`}
        >
          { leftComponent }
        </Col>

        <Col
          xl={isCollapse ? 24 : rightSpan}
          lg={isCollapse ? 24 : rightSpan}
          md={24}
          xs={24}
          className="col-right"
        >
          { rightComponent }
        </Col>
      </Row>
      <ToggleButton isCollapse={isCollapse} handleToggle={handleToggle} />
    </CollapseWrapperStyles>
  );
};

CollapseWrapper.defaultProps = {
  leftSpan: 6,
  rightSpan: 18,
};

export default CollapseWrapper;
