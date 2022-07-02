import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvocateCard from './AdvocateCard';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <AdvocateCard advocate={{}} />
    </MemoryRouter>
  );
});

it('should render and match snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <AdvocateCard advocate={{}} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
