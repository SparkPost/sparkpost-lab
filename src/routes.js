import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import App from './pages/App';
import Main from './pages/Main';
import CampaignHome from './pages/Campaign/Home';
import CampaignPlayer from './pages/Campaign/Player';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Main} />
    <Redirect from="campaign/" to="/" />
    <Route path='/campaign/:campaign_id' component={CampaignHome} />
    <Redirect path='/campaign/:campaign_id/player/' to="/campaign/:campaign_id" />
    <Route path='/campaign/:campaign_id/player/:player_id' component={CampaignPlayer} />
    <Route path='/admin' component={Admin} />
    <Route path='*' component={NotFound} />
  </Route>
);
