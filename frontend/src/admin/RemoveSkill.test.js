import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RemoveSkill from './RemoveSkill';
import UserContext from '../UserContext';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <RemoveSkill />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('should match the snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <RemoveSkill />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
