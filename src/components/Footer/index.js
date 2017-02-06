import React from 'react';
import config from '../../config';
import './footer.scss';

export default (props) => (
<div className='footer'>
  <div className='container'>

    <div className='flex paddingTop--xxl paddingBottom--xxl'>
      <div className='col-xs-12 col-md-8'>
        <h1>Start sending email in minutes!</h1>
        <p className='marginBottom--lg'>The world’s most powerful email delivery solution is now yours in a developer-friendly, quick to set up cloud service. Open a SparkPost account today and send up to <b>100,000 emails per month for free.</b></p>
        <a href={`http://app.sparkpost.com/sign-up?${config.tracking_code}`} title='SparkPost' className='button button--l button--blue'>Send 100K Emails/Month for free</a>
      </div>
    </div>

    <nav className='footer__nav'>
      <a href='http://sparkpost.com' className='footer__logoLink' title='SparkPost'>
        <img src="https://www.sparkpost.com/wp-content/themes/jolteon/images/sparkpost-logo.png" alt="" className="logo"/>
      </a>
      <div className="float--right">
        <a href={`${config.api_base}/auth`} title="Admin" className="footer__link">Admin</a>
        <a href="https://www.sparkpost.com/features" title="Features" className="footer__link">Features</a>
        <a href="https://www.sparkpost.com/pricing" title="Pricing" className="footer__link">Pricing</a>
        <a href="https://www.sparkpost.com/blog" title="Blog" className="footer__link">Blog</a>
      </div>
    </nav>
  </div>
</div>);
