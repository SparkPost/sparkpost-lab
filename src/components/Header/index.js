import React from 'react';
import './header.scss';

export default (props) => (
<div className="header">
  <div className="container clearfix">
    <div className="text--center">
      <div className="logo">
        <img className="logo__sparkpost" src="https://developers.sparkpost.com/images/logo-sparkpost-white.png" alt="SparkPost Lab"/>
        <div className="logo__lab">Lab</div>
      </div>
    </div>
  </div>
</div>);