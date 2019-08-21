function yieldable(y) {
    this.wait = y;
    this.waited = y;
    this.done = !y;
    this.ready = () => {
        this.wait = false;
        this.done = true;
    }
}

function request(url) {
    this.yieldable = new yieldable(true);
    this.resp = '';
    let me = this;
    fetch(url).
    then(resp => resp.json()).
    then(resp => {
        me.resp = resp;
    }).
    catch(err => {
        me.resp = err;
    }).finally(() => {
        me.yieldable.ready();
    });
}

let CO = {
    routines: [],
    running: false,
    new: (...r) => {
        r.forEach(r => CO.routines.push({yieldable: null, routine: r()}));
        if (CO.running === false){
            CO.run();
        }
    },
    run: () => {
        CO.running = true;
        let i = 0;
        r = CO.routines;
        while(i < r.length){
            let y = r[i].yieldable;
            if(y != null && y.wait){
                i++
                continue;
            }
            let n = r[i].routine.next();
            if (n.value !== undefined){
                r[i].yieldable = n.value.yieldable;
            }
            if(n.done){
                r.splice(i, 1);
                i--;
            }
            i++;
        }
        if (r.length > 0) {
            setTimeout(CO.run, 5);
            return;
        } 
        CO.running = false;
    }
}

console.log('main: start');

CO.new(
    function* () {
        let resp
        yield resp = new request('http://slowwly.robertomurray.co.uk/delay/8000/url/https://api.chucknorris.io/jokes/random');
        console.log('1: slow joke: '+resp.resp.value);
    },
    function* () {
        console.log('2: test1');
        yield;
        console.log('2: test2');
        yield;
        let resp = new request('https://api.chucknorris.io/jokes/random');
        //Do something else really quick
        yield resp;

        console.log('2: joke: '+resp.resp.value);
    }
);

console.log('main: end')