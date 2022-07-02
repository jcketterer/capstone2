import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RemoveAdvocate from './RemoveAdvocate';
import UserContext from '../UserContext';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <RemoveAdvocate />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('should match the snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <RemoveAdvocate />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
