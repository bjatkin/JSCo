function* test(url) {
    let d = false;
    let ret = {};
    fetch(url).
    then(resp => resp.json()).
    then(resp => {
      ret = resp;
      d = true;
    });
    while(!d) {
      yield;
    }
    
    if (ret == undefined){
      return {error: "request was unsuccessful"};
    }
    return ret;
  }
  
  let jokes = [];
  jokes.push(test('http://slowwly.robertomurray.co.uk/delay/8000/url/https://api.chucknorris.io/jokes/random'));
  jokes.push(test('https://api.chucknorris.io/jokes/random'));
    
  let told = 0;
  checkThreads();

  function checkThreads(){
    jokes.forEach(joke => {
      let n = joke.next();
      if (n.done && n.value != undefined){
        console.log("joke:", n.value.value);
        told++;
      }
    });
    if (told < jokes.length) {
        setTimeout(checkThreads, 5);
    }
  }
