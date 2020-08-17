# JSCo

this is a small simple exploration into async javascript and co routines.
It was inteded more as an learning exersize than as an actual JS tool 
In other words, please do not use this in any real codbase. 

# Running This Code

# Using co.js In Your Project

as mentioned above you should not use this code in any serious project. However, if you're
still interested in using this code you can turn any function into a co-routine using the
following method.

        // original code
        await sleep(100);
        console.log('3: '+(Date.now()-start));

        // new co-routine code
        co((function* () {
            yield sleep(500);
            console.log('3: '+(Date.now()-start));
        })());

# Test1.js - Test4.js

test files 1-4 show the process I went through as I explored this idea and developed it.
As this idea developed I made efforts to make the library easier to use and interact with.
One of the key developments here was the desision the convert from using raw generator 
functions, to leveraging the promise api. Promises are a really powerful tool for writing
async JS and their addition to this library made it much easier to use.

# Test5.js & Test5Slow.js 

test 5 is an example of the final api. I uses co.js which implements the javascript 
co-routine library. This file is designed to interact with several different slow apis,
such as making calls to remote apis, and sleeping. These interactions show how co js
can speed up these slow api calls without the use of the async or await keywords.

test 5 slow is the slow version of test 5. It uses the exact same code, however, rather
than using co.js it uses the await keyword. This essentially makes all the code syncronous
so each call must wait for the previous call to finish. The result is that this code
runs much more slowly that the co js function.

# JS Pseudo Co-Routines

Co-Routines are similar to threads in several ways but are distinctly different.
Threads are, in theory at least, operating simultaniously. They are designed to
run at the same time as one another and so achieve higher performance. Co-routines
are similar in that they allow a program to achieve higher performance. However,
with co-routines, they are not nessisarily intended to be running at the same time
rather co-routines are designed to minimize cpu waiting by passing controll between
each other durruing slow calls (such as waiting for a REST api response). 

This is how co.js is designed to function. The CO object keeps track of all the 
currently running co routines. Slow calls are indicated by using the yield keyword.
CO then handles the process of moving between the various co-routines to try to 
maximize cpu usage.

# Co.js

This file implements the co.js library.
