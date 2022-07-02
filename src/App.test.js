import { render, screen, cleanup } from '@testing-library/react';
import App from './App';
import React from 'react';

describe("<App />", () => {
  it("Renders <App /> component correctly", () => {
    const { getByText } = render(<App />);
    expect(getByText(/Generate Vaccination Reports/i)).toBeInTheDocument();
  });
});

afterEach(cleanup)

it('should take a snapshot', () => {
  const { asFragment } = render(<App />)
  expect(asFragment(<App />)).toMatchSnapshot()
});

/* 
jest.mock('axios')
it("renders correctly enzyme", () => {
  const wrapper = mount(<App />);
  expect(toJson(wrapper)).toMatchSnapshot();
}); 
describe('routes using memory router', () => {
  it('should show <Home /> component for "/" route', () => {
      const component = mount(<MemoryRouter initialEntries={["/"]}><Provider store={store}><App /></Provider></MemoryRouter>);
      expect(component.find(Home)).toHaveLength(1);
  });
  it('should show <Signup /> component for "/signup" route', () => {
      const component = mount(<MemoryRouter initialEntries={["/signup"]}><App /></MemoryRouter>);

      expect(component.find(Signup)).toHaveLength(1);
  });

  it('should show <Signin /> component for "/signin" route', () => {
      const component = mount(<MemoryRouter initialEntries={["/signin"]}><App /></MemoryRouter>);

      expect(component.find(Signin)).toHaveLength(1);
  });
});  */