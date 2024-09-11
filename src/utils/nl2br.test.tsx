import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import nl2br from '@utils/nl2br';

describe('nl2br', () => {
  const str = '한 끗 차이로 완성하는\n요즘 남자들의 그루밍\n그라펜을 만나보세요.';

  it('문자열내 개행문자를 br태그로 변환한다.', () => {
    const replaceStr = nl2br(str);
    let count = 0;
    replaceStr.forEach(({ props }) => {
      const { children } = props;
      children.forEach((value: ReactElement) => {
        if (value?.type === 'br') {
          count += 1;
        }
      });
    });
    expect(count).toBe(2);
  });

  /*
  // render 함수 dom으로 생성하여 테스트 진행
  it('문자열내 개행문자를 br태그로 변환한다.', () => {
    const { container } = render(<>{nl2br(str)}</>);
    const count = container.innerHTML.match(/<br\s*[\/]?>/gi)?.length || 0;
    expect(count).toBe(2);
  });

  it('문자열내 개행문자를 br태그로 변환한다.', () => {
    const { container } = render(<>{nl2br(str)}</>);
    expect(container.innerHTML).toBe(`한 끗 차이로 완성하는<br>요즘 남자들의 그루밍<br>그라펜을 만나보세요.`);
  });
  */
});
