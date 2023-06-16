import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'

export const imperative = (as: ReadonlyArray<number>): string => {
    const head = (as: ReadonlyArray<number>): number => {
        if (as.length === 0) {
            throw new Error('empty array')
        }
        return as[0]
    }
    const double = (n: number): number => n * 2
    const inverse = (n: number): number => {
        if (n === 0) {
            throw new Error('cannot divide by zero')
        }
        return 1 / n
    }
    try {
        return `Result is ${inverse(double(head(as)))}`
    } catch (err: any) {
        return `Error is ${err.message}`
    }
}

export const functional = (as: ReadonlyArray<number>): string => {
    const debug = (name: string) => <T>(v:T):T => { console.log(name + '\n', v); return v;}

    const head = <A>(as: ReadonlyArray<A>): E.Either<string, A> => {
        return as.length === 0 ? E.left('empty') : E.right(as[0])
    }

    const double = (n: number): Task<number> => {
        return () => {
            return new Promise<number>(resolve => {
                setTimeout(() => resolve(n * 2), 1_000)
            });
        }
    }

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

console.log(functional([1,2, 3]));


