

function register () {
    fetch('http://127.0.0.1:8000/api/users/register/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username: "marifgegg", email: "coucou@gfgdfsfgfddfgg.com", password: "Mi0)miou"})
  }).then(res => res.json())
    .then(res => console.log(res));
};

// recuperer les elements renvoyes par le formulaire et les envyer dans stringify
// si elements ok (code reponse bonne) envoyer "successfull ou un truc du genre"