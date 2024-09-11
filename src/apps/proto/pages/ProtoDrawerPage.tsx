import styled from 'styled-components';
import { DrawerV2 as Drawer } from '@pui/drawer/v2';
import { useDrawer } from '@hooks/useDrawer';
import { Button } from '@pui/button';
import { TextField } from '@pui/textfield';

const ProtoDrawerPage = () => {
  const { open, drawerOpen, drawerClose } = useDrawer();
  const handleClick = () => {
    window.alert('click!!');
  };

  return (
    <div>
      <Drawer
        open={open}
        onClose={drawerClose}
        dragging
        title={{
          label: 'Title',
        }}
      >
        <Para>daoiwdjiajwdiawo1234</Para>
        <Para>daoiwdjiajwdiawo</Para>
        <Button variant="primary" onClick={handleClick}>
          click
        </Button>
        <Para>daoiwdjiajwdiawo</Para>
        <Para>daoiwdjiajwdiawo</Para>
        <TextField placeholder="제목" />
        <Para>daoiwdjiajwdiawo</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>PRIZM IS BACK!!!</Para>
        <Para>=====================end==========</Para>
      </Drawer>
      <Button variant="primary" onClick={drawerOpen}>
        Drawer
      </Button>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Button variant="primary" onClick={drawerOpen}>
        Drawer₩
      </Button>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
      <Para>PRIZM IS BACK!!!</Para>
    </div>
  );
};

const Para = styled.p`
  height: 50px;
`;

export default ProtoDrawerPage;
