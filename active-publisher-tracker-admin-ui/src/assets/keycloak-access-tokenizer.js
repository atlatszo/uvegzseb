;(function () {

  var FRONTEND_KEY = 'active-publisher-tracker-admin-frontend';
  var BACKEND_SUFFIX = '/active-publisher-tracker-backend';

  function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  var urlBase64Decode = function (str) {
    var output = str;
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return b64DecodeUnicode(output);
  };

  var req = new XMLHttpRequest();
  req.open('GET', document.location.href, false);
  req.send(null);
  var headers = req.getResponseHeader('KEYCLOAK-ACCESS-TOKEN') || req.getResponseHeader('KEYCLOAK_ACCESS_TOKEN') || req.getResponseHeader('keycloak_access_token') || '';
  localStorage.setItem('token', headers);
  var parts = headers.split('.');
  parts.pop();
  parts = parts.map(function (b64) {
    return urlBase64Decode(b64);
  });

  window['config'] = window['config'] || {};
  window['config']['frontendKey'] = FRONTEND_KEY;
  window['config']['audience'] = (parts[1] && JSON.parse(parts[1])['aud']) || '';
  window['config']['base'] = '/' + window['config']['audience'];
  window['config']['backend'] = document.location.origin + window['config']['base'] + BACKEND_SUFFIX;
  window['config']['base_href'] = (window['config']['audience'] !== '')
    ? window['config']['base'] + '/' + window['config']['frontendKey'] + '/' : '/';
  window['config']['jwt'] = {
    header: parts[0] && JSON.parse(parts[0]),
    payload: parts[1] && JSON.parse(parts[1])
  };
  window['config']['email'] = parts[1] && JSON.parse(parts[1])['email'] || '';

  var baseTag = document.createElement('base');
  baseTag.href = window['config']['base_href'];
  var titleTag = document.getElementsByTagName('title')[0];
  titleTag.parentNode.insertBefore(baseTag, titleTag.nextSibling);
})();
