function sleep(ms) {
    return yieldable(new Promise(resolve => setTimeout(resolve, ms)));
}

function test() {
    let start = Date.now();
    console.log('main('+start+'): start');

        co((function* () {
            let resp
            yield resp = yieldable(fetch('http://slowwly.robertomurray.co.uk/delay/3300/url/https://api.chucknorris.io/jokes/random').then(resp => resp.json()));
            console.log('1: slow joke('+(Date.now()-start)+'): '+resp.res.value);
        })());

        co((function* () {
            let a = co((function* () {
                console.log('2: test1('+(Date.now()-start)+')');
                yield sleep(100);
                console.log('2: test2('+(Date.now()-start)+')');
            })());

            let b = co((function* () {
                yield sleep(500);
                console.log('3: test3('+(Date.now()-start)+')');
            })());

            console.log('4: test4('+(Date.now()-start)+')');
        })());

        co((function* () {
            let resp;
            yield resp = yieldable(fetch('https://api.chucknorris.io/jokes/random').then(resp => resp.json()));

            console.log('2: joke('+(Date.now()-start)+'): '+resp.res.value);
        })());

    for(i = 0; i < 10; i ++){
        co((function* (i) {
            yield sleep(Math.floor(Math.random()*100)+100);
            console.log('count ('+(Date.now()-start)+')'+i);
        })(i));
    }

    console.log('main('+(Date.now()-start)+'): end');
}

test();