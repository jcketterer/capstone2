import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvocateDetail from './AdvocateDetail';
import UserContext from '../UserContext';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AdvocateDetail />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('should render and match snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AdvocateDetail />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
