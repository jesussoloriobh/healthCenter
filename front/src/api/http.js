const API_URL = 'http://localhost:3000/'

export const GET = async (endpoint) => {
    let requestEndpoint = endpoint;
  
    console.log(`${API_URL}${requestEndpoint}`);
  
    let response = await fetch(`${API_URL}${requestEndpoint}`);
  
    if (!response.ok){
       throw new Error(`HTTP_NOT_OK: ${await response.text()}`);
    }
  
    let json = await response.json();
    return json;
  }
  
  export const POST = async (endpoint, postData) => {
    let url = `${API_URL}${endpoint}`;
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP_NOT_OK, ${url}, ${JSON.stringify(postData)}, ${await response.text()}`);
    }
  
    let json = response.json();
  
    return json;
  }

  export const PUT = async (endpoint, postData) => {
    let url = `${API_URL}${endpoint}`;
  
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
  
    if (!response.ok) {
      throw new Error(`HTTP_NOT_OK, ${url}, ${JSON.stringify(postData)}, ${await response.text()}`);
    }
  
    let json = response.json();
  
    return json;
  }

  export const DELETE = async (endpoint) => {
    let url = `${API_URL}${endpoint}`;
  
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP_NOT_OK, ${url}, ${await response.text()}`);
    }
  
    let json = response.json();
  
    return json;
  }