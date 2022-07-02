import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SkillList from './SkillList';
import UserContext from '../UserContext';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <SkillList />
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('matches the snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <SkillList />
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
