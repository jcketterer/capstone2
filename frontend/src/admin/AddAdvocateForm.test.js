import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AddAdvocateForm from './AddAdvocateForm';
import UserContext from '../UserContext';
import AlertContext from '../AlertContext.js';

it('should render without breaking', () => {
  render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AlertContext.Provider value={{ setMessage: {} }}>
          <AddAdvocateForm />
        </AlertContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
});

it('should match the snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <UserContext.Provider value={{ username: 'test' }}>
        <AlertContext.Provider value={{ setMessage: {} }}>
          <AddAdvocateForm />
        </AlertContext.Provider>
      </UserContext.Provider>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
