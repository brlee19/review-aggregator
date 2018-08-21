import React from 'react';
import { shallow } from 'enzyme';
import Search from './search.jsx';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

test('Search renders without crashing', () => {
  const searchPage = shallow(<Search />);

  expect(searchPage.length).toEqual(1)
});