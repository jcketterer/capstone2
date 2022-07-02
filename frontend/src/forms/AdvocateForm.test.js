import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvocateForm from './AdvocateForm';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <AdvocateForm fields={[]} />
    </MemoryRouter>
  );
});

it('matches the snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <AdvocateForm fields={[]} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
