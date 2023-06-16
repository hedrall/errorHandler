import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

class Error1 extends Error { name: 'error1' = 'error1';}
class Error2 extends Error { name: 'error2' = 'error2'; }
class Error3 extends Error { name: 'error3' = 'error3'; }
class Error4 extends Error { name: 'error4' = 'error4'; }

type ErrorType = Error1 | Error2 | Error3 | Error4;

function toThrow1(): E.Either<Error1, number> {
    return true ? E.left(new Error1('throw 1')) : E.right(1);
}
function toThrow2(): E.Either<Error2, { hoge: string }> {
    return true ? E.left(new Error2('throw 2')) : E.right({ hoge: 'test' });
}
async function toThrow3(): Promise<WithThrow<Error3>> { console.log('to throw 3')}
function toThrow4(): WithThrow<Error4> { console.log('to throw 4')}

export const main = (as: ReadonlyArray<number>): string => {
    const debug = (name: string) => <T>(v:T):T => { console.log(name + '\n', v); return v;}

    const head = <A>(as: ReadonlyArray<A>): E.Either<string, A> => {
        return as.length === 0 ? E.left('empty') : E.right(as[0])
    }

    const double = (n: number): number => 0//n * 2

    const inverse = (n: number): E.Either<string, number> => {
        console.log('in inverse', n);
        return (n === 0 ? E.left('cannot divide by zero') : E.right(1 / n))
    }

    return pipe(
        as,
        debug('init'),
        head,
        debug('after head'),
        E.map(double),
        debug('after map double'),
        E.flatMap(inverse),
        debug('after flatMapInverse'),
        // E.flatMap(inverse),
        // E.match(
        //     (err) => `Error is ${err}`, // onLeft handler
        //     (head) => `Result is ${head}` // onRight handler
        // ),
        // debug('after match'),
    )
}

console.log(main([1,2, 3]));


