const log = console.log;

// 리스트에서 홀수를 length 만큼 뽑아서 제곱한 후 모두 더하기
// function f(list, length) {
//     let i = 0;
//     let acc = 0;
//     for(const a of list){
//         if(a % 2){
//             acc = acc+ a*a;
//             if(++i == length) break;
//         }
            
//     }
//     log(acc);
// }
// f([1, 2, 3, 4, 5], 1);
// f([1, 2, 3, 4, 5], 2);
// f([1, 2, 3, 4, 5], 3);

/**
 * --------------- 용어정리 --------------------
 * iterable: JavaScript에서 순회가 가능한 값
 * */

 
// 6. curry
// - 인자를 받아서 두 개 이상의 인자가 들어왔을 경우 받은 모든 인자를 넣어서 실행하고, 그렇지 않은 경우에는 다음 인자를 받아서 기존 일급함수 실행
const curry = f => (a, ...fns) =>
fns.length ? f(a, ...fns) : (...fns) => f(a, ...fns);

const L = {}; //지연적으로 동작하는 함수다.

L.range = function *(stop) {
    let i = -1;
    while(++i < stop) yield i;
};

// 1. 함수형 프로그래밍에서 if를 한번만 하는 경우를 filter라고 한다.
// - * : Generator Function 은 사용자의 요구에 따라 다른 시간 간격으로 여러 값을 반환할 수 있다.
//     : yield와 next를 통해 일시적으로 정지될 수도 있고 다시 시작될 수도 있다. 
//     : Generator Function 은 Generator를 반환한다.
//     : yield - 제너레이터 함수의 실행을 일시적으로 정지시키며, yield 뒤에 오는 표현시은 제너레이터의 caller에게 반환된다. (return 과 매우 유사)
//     :       - yield 는 기본적으로 지연적으로 평가되게 되있다.\
L.filter = curry(function *filter(f, iter) {
    for(const a of iter) {
        if(f(a)) yield a;
    }
});

// 2. 함수형 프로그래밍에서 어떠한 값을 다른 값으로 만드는 부분을 map이라고 한다.
L.map = curry(function *map(f, iter) {
    for(const a of iter) {
        yield f(a);
    }
});

// 3. take : 선언적으로 어떻게 함수를 처리할 것인가.
const take = curry(function take(length, iter) {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if(res.length == length) return res;
    }
    return res;
});

// 4. reduce : 어떤 iterable을 특정 값으로 축약해서 리턴시키는 역할
// - acc : 축약을 시작할 값
// - argument part : acc(출발값)이 생략됐을 경우
const reduce = curry(function reduce(f, acc, iter) {
    if(arguments.length == 2) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    } 
    for(const a of iter) {
        acc = f(acc, a);
    }
    return acc;
});

// 5. go : pipeline
// - 함수형 프로그래밍에서는 함수도 숫자나 값으로 바라보는 시각이 필요하다.
// - a라는 값으로 시작을 해서 함수 리스트를 받아서 압축쓰
// *** reduce 수정되기 전 ver.
// const go = (a, ...fns) => reduce((a, f) => f(a), a, fns);
// *** reduce parameter 두개 가능으로 수정 후 ver.
const go = (...fns) => reduce((a, f) => f(a), fns);

// 6. curry는 제일 상단으로 올라감

const add = curry((a, b) => a + b);
//함수형 프로그래밍은 맨 오른쪽부터 왼쪽으로 가면서 읽으면 된다. 
const f = (list, length) => 
    reduce(add, 0, 
        take(length, 
            L.map(a => a * a, 
                L.filter(a => a % 2, list))));

// ***** ver2. go 함수가 만들어졌다면 위에서 아래로 순차적으로 진행할 수 있음.
const f2 = (list, length) => go(
    list,
    list => L.filter(a => a % 2, list),
    list => L.map(a => a * a, list),
    list => take(length, list),
    list => reduce(add, 0, list)
);

// ***** ver3. curry 함수가 만들어졌다면 전달하고 받는 부분이 필요가 없어짐.
const f3 = (list, length) => 
     go(list,
        L.filter(a => a % 2),
        L.map(a => a * a),
        take(length),
        reduce(add));

function main() {
    log(f3([1, 2, 3, 4, 5], 1));
    log(f3([1, 2, 3, 4, 5], 2));
    log(f3(L.range(Infinity), 100));
}

main();


/**
 * 2차원 배열
 * - 함수형 프로그래밍에서는 i++과 j++이 사라진다.
 * - 1차원에서 순회하면서 뭘 할지는 위임했듯이 2차원도 동일하다.
 */
console.clear();
const arr = [
    [1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10]
];

// 1. flat
// - 순회를 하면서 더 파고 들어갈 수 있다면 더 들어가고 그렇지 않다면 안들어가고
// L.flat = function *(iter) {
//     for(const a of iter){
//         if(a && a[Symbol.iterator]) {
//             for(const b of a) 
//                 yield b;
//         }
//         else 
//             yield a;
//     }
// }

//요즘 서따일~
L.flat = function *(iter) {
    for(const a of iter){
        if(a && a[Symbol.iterator]) yield* a
        else yield a;
    }
}

var it = L.flat(arr);
// log([...L.flat(arr)]);
go(arr, 
    L.flat, 
    L.filter(a => a % 2), 
    L.map(a => a * a), 
    take(3), 
    reduce(add), 
    log);

// **************************
// 응용해봅시다!
// **************************
var users = [
    {
        name: 'a', age: 21, family: [
            { name: 'a1', age: 53 }, { name: 'a2', age: 47 },
            { name: 'a3', age: 23 }, { name: 'a4', age: 34 }
        ]
    }, {
        name: 'b', age: 21, family: [
            { name: 'b1', age: 56 }, { name: 'b2', age: 42 },
            { name: 'b3', age: 10 }, { name: 'b4', age: 7 }
        ]
    }, {
        name: 'c', age: 21, family: [
            { name: 'c1', age: 64 }, { name: 'c2', age: 62 }
        ]
    }, {
        name: 'd', age: 21, family: [
            { name: 'd1', age: 42 }, { name: 'd2', age: 47 },
            { name: 'd3', age: 21 }, { name: 'd4', age: 5 }
        ]
    }
];

go(users,
    L.map(u => u.family),
    L.flat,
    L.filter(u => u.age < 20),
    take(2),
    reduce(add),
    log);

//함수형 프로그래밍 모나드
