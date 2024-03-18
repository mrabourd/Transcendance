
function login () {
    fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: "marie", email: "coucou@g.com", password: "Mi0)miou"})
  }).then(res => res.json())
    .then(res => console.log(res));
  };