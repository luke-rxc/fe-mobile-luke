import React, { useState } from 'react';
import { Slot } from '@pui/slot';
import { Button } from '@pui/button';

export const SlotContainer = () => {
  const [number, setNumber] = useState<number>(0);
  const price = 240000;

  const handleCountUp = () => {
    setNumber((prev) => prev + price);
  };
  const handleCountDown = () => {
    setNumber((prev) => prev - price);
  };
  return (
    <div>
      <Button variant="primary" onClick={handleCountUp}>
        +{price}원
      </Button>
      <Button variant="primary" onClick={handleCountDown}>
        -{price}원
      </Button>
      <Slot value={number} suffix="원" />
    </div>
  );
};
