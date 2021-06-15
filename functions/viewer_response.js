function handler(event) {
    var response = event.response;    
    // Set HTTP security headers
    response.headers['strict-transport-security'] = { value: 'max-age=63072000'}; 
    response.headers['x-content-type-options'] = { value: 'nosniff'}; 
    response.headers['x-frame-options'] = {value: 'SAMEORIGIN'}; 
    response.headers['x-xss-protection'] = {value: '1; mode=block'}; 
    return response;
  }