/*
  let data = Request("test_api"); //Request is of type yieldable
  while(data.notReady) {yield data;}
  */

 let Threads = {
    threads: [],
    new: function(...t) {
      t.forEach(t => Threads.threads.push(t()));
    },
    run: function() {
      remove = [];
      Threads.threads.forEach((t,i) => {
        let status = t.next();
        if (status.done) {
          //mark the thread for removal
          remove.push(i);
        }
      });
      //remove the thread from the thread pool
      remove.forEach(i => Threads.threads.splice(i, 1));
      if (Threads.threads.length > 0){
        setTimeout(Threads.run());
      }
    },
  }
  
  Threads.new(function* (){
    console.log("test1");
    yield;
    console.log("test2");
    return true;
  },
  function* (){
    console.log("test3");
    yield;
    console.log("test4");
    Threads.new(function* () {
      console.log("test5");
      yield;
      console.log("test6");
      return true;
    });
    yield;
    yield;
    return true;
  });
  Threads.run();

  console.log("main thread");