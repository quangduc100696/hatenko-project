import 'Main.less';
import 'css/styles.css';
import { GlobalStyle } from 'css/global';
import { AntOverrideStyles } from 'css/antOverride';
import { useEffect, Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from 'theme';
import i18n from './i18n';
import moment from 'moment';
import { Auth } from 'auth';
import { DataProvider } from 'DataContext';
import { BrowserRouter } from 'react-router-dom';
import history from "@history";
import Authorization from 'auth/Authorization';
import MainLayout from 'layouts/MainLayout';
import MyPopup from 'routes/PopupRoute';
import Loading from 'components/Loading';
import ModalRoutes from 'routes/ModalRoutes';

const ThemeRender = () => (
  <ThemeProvider theme={theme}>
    <Auth>
      <Authorization>
        <MainLayout />
      </Authorization>
    </Auth>
    <Suspense fallback={<Loading />}>
      <ModalRoutes />
      <MyPopup />
    </Suspense>
    <GlobalStyle />
    <AntOverrideStyles />
  </ThemeProvider>
);

function App() {

  useEffect(() => {
    moment.locale(i18n.language);
  }, []);

  return (
    <DataProvider>
      <BrowserRouter location={history.location} navigator={history}>
        <ThemeRender />
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
