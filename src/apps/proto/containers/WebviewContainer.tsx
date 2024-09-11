import React from 'react';
import { Button } from '@pui/button';

export const WebviewContainer: React.FC = () => {
  const handleAlert = () => {
    window.alert('Hello from webview, Alert 테스트');
  };
  const handleConfirm = () => {
    window.confirm('Press a button! Confirm 테스트');
  };

  return (
    <>
      <Button color="tint" onClick={handleAlert}>
        Alert
      </Button>
      <Button color="black" onClick={handleConfirm}>
        Confirm
      </Button>
    </>
  );
};
