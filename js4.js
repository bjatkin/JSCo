let nextYieldable = 0;
function yieldable(promise){
    let id = nextYieldable++;
    promise.yieldableID = id;
    promise.yield = () => {
        promise.
        then(res => promise.res = res).
        catch(err => promise.err = err).
        finally(() => CO.run(id))
    }
    return promise;
}

function sleep(ms) {
    return yieldable(new Promise(resolve => setTimeout(resolve, ms)));
}

function co(gen){
    let next = gen.next();

    let ret = new Promise(() => {});
    ret.gen = gen;

    if (!next.done){
        next.value.yield();
        let yid = next.value.yieldableID;
        let cid = nextCo++;
        CO.routines[cid] = ret;
        CO.yields[yid] = cid;
    }
    return yieldable(ret);
}

let nextCo = 0;
let CO = {
    routines: {},
    yields: {},
    run: (id) => {
        let cid = CO.yields[id];
        let next = CO.routines[cid].gen.next();
        if (next.done) {
            Promise.resolve(CO.routines[cid]);
            delete CO.routines[cid];
            delete CO.yields[id];
            return;
        }
        next.value.yield();
        CO.yields[next.value.yieldableID] = cid;
        delete CO.yields[id];
    }
}

console.log('main: start');

    co((function* () {
        let resp
        yield resp = yieldable(fetch('http://slowwly.robertomurray.co.uk/delay/3300/url/https://api.chucknorris.io/jokes/random').then(resp => resp.json()));
        console.log('1: slow joke: '+resp.res.value);
    })());

    co((function* () {
        let a = co((function* () {
            console.log('2: test1');
            yield sleep(100);
            console.log('2: test2');
        })());

        let b = co((function* () {
            yield sleep(500);
            console.log('3: test3');
        })());
    })());

    co((function* () {
        let resp;
        yield resp = yieldable(fetch('https://api.chucknorris.io/jokes/random').then(resp => resp.json()));

        console.log('2: joke: '+resp.res.value);
    })());

    for(i = 0; i < 10; i ++){
        co((function* (i) {
            yield sleep(Math.floor(Math.random()*100)+100);
            console.log("count "+i);
        })(i));
    }

console.log('main: end');