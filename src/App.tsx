import { ThemeProvider } from 'styled-components';
import { useTheme } from '@hooks/useTheme';
import { useDeviceDetect } from '@hooks/useDeviceDetect';
import { ModalModule } from '@modules/ModalModule';
import { ToastModule } from '@modules/ToastModule';
import { SnackbarProvider } from '@pui/snackbar';
import { AuthProvider } from '@contexts/AuthContext';
import { LoadingModule } from '@modules/LoadingModule';
import { WebInterfaceProvider } from '@contexts/WebInterfaceContext';
// import { ThrowErrorBoundary } from '@features/exception/components';
import { WebEventProvider } from '@contexts/WebEventContext';
import { FeatureFlagWebProvider } from '@contexts/FeatureFlagWebContext';
import { GlobalStyle, AppGlobalStyle } from './styles/global';
import Pages from './pages/Pages';

const App = () => {
  const { theme } = useTheme();
  const { isApp } = useDeviceDetect();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {isApp && <AppGlobalStyle />}
      <SnackbarProvider>
        <AuthProvider>
          <WebInterfaceProvider>
            <FeatureFlagWebProvider>
              <WebEventProvider>
                <ModalModule />
                {/* ErrorBoundary UI 간헐적 이슈로 일시적 제거 */}
                {/* <ThrowErrorBoundary>
                        <Pages />
                      </ThrowErrorBoundary> */}
                <Pages />
              </WebEventProvider>
            </FeatureFlagWebProvider>
          </WebInterfaceProvider>
        </AuthProvider>
      </SnackbarProvider>
      <ToastModule />
      <LoadingModule />
    </ThemeProvider>
  );
};

export default App;
