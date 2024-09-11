import React from 'react';
import { Portal } from '@pui/portal';

export const SnackbarPortal: React.FC = ({ children }) => <Portal elementId="floating-root">{children}</Portal>;
