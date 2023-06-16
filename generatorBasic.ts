function * gFactory (start) {
    for (let i = start; i < start + 10; i++) {
        yield i;
    }
}

const main = async () => {

};

(async () => {
  await main();
})().catch(console.error);
