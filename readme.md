# JSCo

This is a small simple exploration into async javascript and co routines.
It was intended more as an learning exercise than as an actual JS tool 
In other words, please do not use this in any real codebase. 

# Running This Code

This code is simple to run using any localhost server. If you have npm installed
you can quickly and simply serve the JSCo directory using
[this http server](https://www.npmjs.com/package/http-server). Once the server is started
you can visit [http://localhost:8080/yielder.html](http://localhost:8080/yielder.html)
for the fast version and [http://localhost:8080/yielderSlow.html](http://localhost:8080/yielderSlow.html)
for the slow version. Remember to open the development console (F12 in most browsers) to see the output
as this project only logs output to the console.

# Using co.js In Your Project

as mentioned above you should not use this code in any serious project. However, if you're
still interested in using this code you can turn any function into a coroutine using the
following method.

        // original code
        await sleep(100);
        console.log('3: '+(Date.now()-start));

        // new coroutine code
        co((function* () {
            yield sleep(500);
            console.log('3: '+(Date.now()-start));
        })());

# Test1.js - Test4.js

test files 1-4 show the process I went through as I explored this idea and developed it.
As this idea developed I made efforts to make the library easier to use and interact with.
One of the key developments here was the decision the convert from using raw generator 
functions, to leverage the promise api. Promises are a really powerful tool for writing
async JS and their addition to this library made it much easier to use.

# Test5.js & Test5Slow.js 

test 5 is an example of the final api. I uses co.js which implements the javascript 
coroutine library. This file is designed to interact with several different slow apis,
such as making calls to remote apis, and sleeping. These interactions show how co js
can speed up these slow api calls without the use of the async or await keywords.

test 5 slow is the slow version of test 5. It uses the exact same code, however, rather
than using co.js it uses the await keyword. This essentially makes all the code synchronous
so each call must wait for the previous call to finish. The result is that this code
runs much more slowly that the co js function.

# JS Pseudo Co-Routines

Co-Routines are similar to threads in several ways but are distinctly different.
Threads are, in theory at least, operating simultaneously. They are designed to
run at the same time as one another and so achieve higher performance. Coroutines
are similar in that they allow a program to achieve higher performance. However,
with coroutines, they are not necessarily intended to be running at the same time
rather coroutines are designed to minimize cpu waiting by passing control between
each other during slow calls (such as waiting for a REST api response). 

This is how co.js is designed to function. The CO object keeps track of all the 
currently running coroutines. Slow calls are indicated by using the yield keyword.
CO then handles the process of moving between the various co-routines to try to 
maximize cpu usage.

# Co.js

This file implements the co.js library. It has 3 major parts; the yieldable object,
the co function, and the CO object.

yieldable allows the wrapping of promise objects to track their state. This allows
JSCo to quickly determine if a promise has been resolved, which in turn allows it
to swap between coroutines.

The co function is the main function exposed by this file. It converts an generator
function into a coroutine. It will automatically start the CO object to start the 
coroutine swapping.

CO is the main object that tracks all the currently running coroutines. It also keeps
the coroutine in sync, deleting co-routines that have been completed.

