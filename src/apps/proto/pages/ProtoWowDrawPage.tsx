import { Button } from '@pui/button';
import { useState } from 'react';
import { RaffleUserInfoModel } from 'src/apps/live/models';
import { WinnerAnnounceContainer } from '../../live/containers/WinnerAnnounceContainer';

const ProtoWowDrawPage = () => {
  const [open, setOpen] = useState(false);
  const data: Array<RaffleUserInfoModel> = [
    { userId: 123, nickname: 'keannaemilyelizebeth' },
    { userId: 1, nickname: 'keannaemilyelizebeth' },
    { userId: 2, nickname: 'keannaemilyelizebeth' },
    { userId: 3, nickname: 'keannaemilyelizebeth' },
    { userId: 4, nickname: 'keannaemilyelizebeth' },
    { userId: 5, nickname: 'keannaemilyelizebeth' },
    { userId: 61, nickname: 'keannaemilyelizebeth' },
    { userId: 62, nickname: 'keannaemilyelizebeth' },
    { userId: 63, nickname: 'keannaemilyelizebeth' },
    { userId: 64, nickname: 'keannaemilyelizebeth' },
    { userId: 65, nickname: 'keannaemilyelizebeth' },
    { userId: 66, nickname: 'keannaemilyelizebeth' },
    { userId: 67, nickname: 'keannaemilyelizebeth' },
    { userId: 69, nickname: 'keannaemilyelizebeth' },
    { userId: 60, nickname: 'keannaemilyelizebeth' },
    { userId: 611, nickname: 'keannaemilyelizebeth' },
    { userId: 612, nickname: 'keannaemilyelizebeth' },
    { userId: 613, nickname: 'keannaemilyelizebeth' },
    { userId: 614, nickname: 'keannaemilyelizebeth' },
    { userId: 615, nickname: 'keannaemilyelizebeth' },
    { userId: 616, nickname: 'keannaemilyelizebeth' },
    { userId: 617, nickname: 'keannaemilyelizebeth' },
    { userId: 618, nickname: 'keannaemilyelizebeth' },
    { userId: 619, nickname: 'keannaemilyelizebeth' },
    { userId: 620, nickname: 'keannaemilyelizebeth' },
    { userId: 621, nickname: 'keannaemilyelizebeth' },
    { userId: 622, nickname: 'keannaemilyelizebeth' },
    { userId: 623, nickname: 'keannaemilyelizebeth' },
    { userId: 624, nickname: 'keannaemilyelizebeth' },
    { userId: 625, nickname: 'keannaemilyelizebeth' },
    { userId: 626, nickname: 'keannaemilyelizebeth' },
    { userId: 627, nickname: 'keannaemilyelizebeth' },
    { userId: 628, nickname: 'keannaemilyelizebeth' },
    { userId: 630, nickname: 'keannaemilyelizebeth' },
    { userId: 280455, nickname: 'hwan' },
  ];

  const liveRaffleWinnerItem = { winnerList: data, goodsMedia: null, goodsImage: null };
  // 'keannaemilyelizebeth', 'jeff', 'ken', 'ellie', 'freddy', 'hwan', 'kai', 'lucas', 'luke', 'end'
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button variant="primary" onClick={handleOpen}>
        WOW DRAW
      </Button>
      {open && <WinnerAnnounceContainer show liveRaffleWinnerItem={liveRaffleWinnerItem} onClose={handleClose} />}
    </>
  );
};

export default ProtoWowDrawPage;
