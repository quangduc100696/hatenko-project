import { useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { Carousel, Modal } from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import Image from 'components/common/Image';
import { ModalContentStyles } from './styles';

const ModalPreview  = (_props, ref) => {

  const [ visible, setVisible ] = useState(false);
  const [ images, setImages ] = useState([]);
  const carouselRef = useRef();

  useImperativeHandle(ref, () => ({
    goToImage: index => {
      carouselRef.current.goTo(index);
    },
    open: images => {
      setVisible(true);
      setImages(images);
    },
  }));

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <Modal
      style={{ top: 80 }}
      open={visible}
      footer={null}
      onCancel={handleCancel}
      width={800}
    >
      <ModalContentStyles>
        {images?.length > 1 && (
          <LeftCircleFilled
            className="left-arrow"
            onClick={() => carouselRef.current.prev()}
          />
        )}
        {images?.length > 1 && (
          <RightCircleFilled
            className="right-arrow"
            onClick={() => carouselRef.current.next()}
          />
        )}
        <Carousel draggable ref={carouselRef}>
          {images &&
            images.map((data, index) => (
              <div key={String(index)}>
                <Image alt="smartos" style={{ width: '100%' }} src={data} />
              </div>
            ))}
        </Carousel>
      </ModalContentStyles>
    </Modal>
  );
};

export default forwardRef(ModalPreview);
