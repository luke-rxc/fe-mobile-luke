import { FloatingProvider } from '../contexts';
import { FloatingRoot } from '../components';

export const FloatingContainer: React.FC = ({ children }) => {
  return (
    <FloatingProvider>
      {children}
      <FloatingRoot />
    </FloatingProvider>
  );
};
