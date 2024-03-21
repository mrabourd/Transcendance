

function postDummy () {
  fetch('http://127.0.0.1:8000/api/users/register/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({username: "marie", email: "coucou@g.com", password: "Mi0)miou"})
})
  // .then(res => res.json())
  // .then(res => console.log(res));
  .then((res) => {
    if (!res.ok) {
      document.getElementById("dummy").innerHTML = "A user with this email address already exists.";
    }
    else
      console.log("bravo, this person has been added")
  })
 };