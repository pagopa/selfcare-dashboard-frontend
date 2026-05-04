/* eslint-disable functional/immutable-data */
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { initAnalytics } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { ENV } from './utils/env';

CONFIG.ANALYTCS.ENABLE = ENV.ANALYTCS.ENABLE;
CONFIG.ANALYTCS.MOCK = ENV.ANALYTCS.MOCK;
CONFIG.ANALYTCS.DEBUG = ENV.ANALYTCS.DEBUG;
CONFIG.ANALYTCS.TOKEN = ENV.ANALYTCS.TOKEN;
CONFIG.ANALYTCS.API_HOST = ENV.ANALYTCS.API_HOST;
CONFIG.ANALYTCS.ADDITIONAL_PROPERTIES_IMPORTANT = { env: ENV.ENV };

declare const OneTrust: any;
declare const OnetrustActiveGroups: string;
declare const window: any;

// target cookies (Mixpanel)
const targCookiesGroup = CONFIG.CONSENT.COOKIE_GROUP_ANALYTICS;

// OneTrust callback at first time
// eslint-disable-next-line functional/immutable-data
window.OptanonWrapper = function () {
  OneTrust.OnConsentChanged(function () {
    const activeGroups = OnetrustActiveGroups;
    if (activeGroups.indexOf(targCookiesGroup) > -1) {
      initAnalytics();
    }
  });
};
// check mixpanel cookie consent in cookie
const OTCookieValue: string =
  document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || '';
const checkValue = `${targCookiesGroup}%3A1`;
if (OTCookieValue.indexOf(checkValue) > -1) {
  initAnalytics();
}
