import { render } from '@testing-library/react';
import TokenSetter from './TokenSetter';

it('should render without breaking', () => {
  render(<TokenSetter token="" />);
});

it('matches snapshot', () => {
  const { asFragment } = render(<TokenSetter token="" />);
  expect(asFragment()).toMatchSnapshot();
});
