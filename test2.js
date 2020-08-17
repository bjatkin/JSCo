// First idea of what the api for this project might look like

 let Threads = {
    threads: [],
    new: function(...t) {
      t.forEach(t => Threads.threads.push(t()));
    },
    run: function() {
      remove = [];

      // Run each generator function
      Threads.threads.forEach((t,i) => {
        let status = t.next();
        if (status.done) {
          //mark the thread for removal
          remove.push(i);
        }
      });

      //remove the thread from the thread pool
      remove.forEach(i => Threads.threads.splice(i, 1));

      // Set a timeout to re-check the thread pool
      if (Threads.threads.length > 0){
        setTimeout(Threads.run());
      }
    },
  }
  
  // Add two example threads to the thread runner
  Threads.new(
    function* (){
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