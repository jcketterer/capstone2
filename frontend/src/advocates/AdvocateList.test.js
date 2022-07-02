import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdvocateList from './AdvocateList';
import UserContext from '../UserContext';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AdvocateList />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('should render and match snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AdvocateList />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
