
'use strict';

import {
  StackNavigator,
} from 'react-navigation';
import Authentication from './Authentication';
import Registration from './Registration';
import SearchPage from './SearchPage';
import SearchResults from './SearchResults';
import PropertyView from './PropertyView';
import requestToServer from './requestToServer';

const App = StackNavigator({
	Authentication: { screen: Authentication },
	Registration: { screen: Registration },
  requestToServer: { screen: requestToServer },
  Home: { screen: SearchPage },
  Results: { screen: SearchResults },
  Property: { screen: PropertyView },
});
export default App;
