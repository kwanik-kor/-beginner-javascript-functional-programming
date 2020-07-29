var users = [
    {id: 1, name: 'AB', age: 36},
    {id: 2, name: 'CD', age: 37},
    {id: 3, name: 'EF', age: 28},
    {id: 4, name: 'GH', age: 39},
    {id: 5, name: 'IJ', age: 20},
]

//조건에 따른 데이터 반환
let _filter = (list, predi) => { 
    let new_list = [];
    _each(list, (val) => {
        if(predi(val))
            new_list.push(val);
    });
    return new_list;
}

//객체 필드 매핑
let _map = (list, mapper) => {
    var new_list = [];
    _each(list, (val) => {
            new_list.push(mapper(val));
        });
    return new_list;
}

//반복문
let _each = (list, iter) => {
    for(var i = 0; i < list.length; i++){
        iter(list[i]);
    }
    return list;
}

console.log(
    _map(
        _filter(users, (user) => { return user.age >= 30 }),
        (user) => { return user.name })
)

//자바 스크립트 내장 함수는 'method'다.
// - 메소드는 OOP로 해당 클래스의 instance에서만 사용할 수 있다. 즉 내장 map 메소드는 Array에서만 사용할 수 있다.
// - 
// console.log(
//     [1, 2, 3].map((val) => {
//         return val * 2 ;
//     })
// )

// console.log(
//     [1, 2, 3, 4].filter((val) => {
//         return val % 2;
//     })
// )

//콜백함수는 맨 끝에서 다시 돌려주는 것을 의미한다.
//하지만 특정 조건을 리턴하거나, 매핑하고, 반복하는 것과 같은 보좌함수의 이름을 따로 불러 주는 것이 좋다.
// 내부다형성 -> predi, iter, mapper
_map([1, 2, 3, 4], (v) => {
    return v + 10;
});

//커링
// const _curry = (fn) => {
//     return (a, ...args) => {
//         return args.length == 1 ? fn(a, args[0]) : (b) => fn(a, b);
//     }
// }
// Curry Right
// const _curryr = (fn) => {
//     return (a, ...args) => {
//         return args.length == 1 ? fn(a, args[0]) : (b) => fn(b, a);
//     }
// }
const _curry = (fn) => (a, ...args) => args.length == 1 ? fn(a, args[0]) : (b) => fn(a, b);
const _curryr = (fn) => (a, ...args) => args.length == 1 ? fn(a, args[0]) : (b) => fn(b, a);

var add = _curry((a, b) => {
    return a + b;
})
add10 = add(10);
// console.log(add10(5));
// console.log(add(10)(10));
// console.log( add(1, 3) );

var sub = _curryr((a, b) => {
    return a - b;
});
var sub10 = sub(10);

console.log('sub-------------------------')
console.log(sub10(5));
console.log(sub(10, 3));

// _get
// 없는 객체에서 값을 참조하려할 경우 오류가 나지만, _get 메소드를 만들어서 사용함으로써 안전하게 사용가능하다.
// const _get = _curryr((obj, key) => {
//     return obj == null ? undefined : obj[key];
// });
const _get = _curryr((obj, key) => obj == null ? undefined : obj[key] );
var user1 = users[0];

console.log("get-------------------------")
console.log(_get(user1, 'name'));
console.log(_get(users[10], 'name'));

const get_name = _get('name');

console.log(get_name(user1));

console.log(
    _map(
        _filter(users, (user) => { return user.age >= 30 }),
        _get('name')
    )
)

// _reduce 만들기(pipe의 보다 특화된 버전이라고 볼 수 있다)
const slice = Array.prototype.slice;

const _rest = (list, num) => {
    return slice.call(list, num || 1);
}

const _reduce = (list, iter, memo = list[0]) => {
    if(memo == list[0])
        list = _rest(list, 1);

    _each(list, (val) => {
        memo = iter(memo, val);
    });

    return memo;
}

console.log(
    _reduce([1, 2, 3, 4], add, 0)
);

console.log(
    _reduce([1, 2, 3, 4], add)
)

//_pipe
// function _pipe() {
//     var fns = arguments;
//     return function(arg) {
//         return _reduce(fns, function(arg, fn){
//             return fn(arg);
//         }, arg);
//     }
// }

const _pipe = (...fns) => (arg) => _reduce(fns, (arg, fn) => fn(arg), arg); 

var f1 = _pipe(
    (a) => { return a + 1; },
    (a) => { return a * 2; },
    (a) => { return a * a; },
    (a) => { return a + 4; });

console.log(f1(1));

var a = 1;

    // return _reduce(fns, function(arg, fn){ return fn(1); }, 1);

    // _reduce = function(fns, iter, arg){
    //     _each(fns, (val) => {
    //         arg = iter(arg, val);
    //     })
    // }