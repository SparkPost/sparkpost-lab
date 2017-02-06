import React from 'react';
import { Link } from 'react-router';

export default (props) => (
<div className="margin-xl padding--xl text--center">
  <img src="https://www.sparkpost.com/wp-content/themes/jolteon/images/sparky.svg" alt=""/>
  <h1>Make your peace, none of this is real.</h1>
  <p>Let us show you the way back <Link to={`/`}>home</Link></p>
</div>
);
