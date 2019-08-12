import * as React from 'react';
import * as renderer from 'react-test-renderer';

import MainScreen from '../../src/screens/MainScreen';

it('renders without crashing', () => {
    const rendered = renderer.create(<MainScreen/>).toJSON();
    expect(rendered).toBeTruthy();
});
