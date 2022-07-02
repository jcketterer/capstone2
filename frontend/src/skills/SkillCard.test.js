import { render } from '@testing-library/react';
import SkillCard from './SkillsCard';

it('should render without breaking', () => {
  render(<SkillCard skill={{}} />);
});

it('should match snapshot', () => {
  const { asFragment } = render(<SkillCard skill={{}} />);
  expect(asFragment()).toMatchSnapshot();
});
