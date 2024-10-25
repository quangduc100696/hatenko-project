import { DrawerWrapper } from './styles';

const DrawerRoute = ({ width = 600, children, onClose, ...props }) => (
  <DrawerWrapper
    width={width}
    onClose={onClose}
    contentWrapperStyle={{ maxWidth: '100vw' }}
    {...props}
    destroyOnClose
    closable={false}
    footer={null}
  >
    {children}
  </DrawerWrapper>
);

export default DrawerRoute;
