// 함수형 프로그래밍은 애플리케이션, 함수의 구성요소, 더 나아가서 언어 자체를 함수처럼 여기도록 만들고,
// 이러한 함수 개념을 가장 우선순위에 놓는다.
// 함수형 사고방식은 문제의 해결 방법을 동사들로 구성하는 것.

// 함수를 구성하고 함수에 맞게 데이터를 구성하게 됨

/**
 * 함수형으로 전환하기
 */
var users = [
    {id: 1, name: 'AB', age: 36},
    {id: 2, name: 'CD', age: 37},
    {id: 3, name: 'EF', age: 28},
    {id: 4, name: 'GH', age: 39},
    {id: 5, name: 'IJ', age: 20},
]

//1. 명령형 코드
//1) 30세 이상인 users를 거른다.
var tmp_users = [];
for(var i = 0; i<users.length; i++) {
    if(users[i].age >= 30)
        tmp_users.push(users[i]);
}
// console.log(tmp_users);

//2) 30세 이상인 user의 이름 수집
var names = [];
for(var i = 0; i<tmp_users.length; i++) {
    names.push(tmp_users[i].name);
}
// console.log(names);

//3) 30세 미만인 users를 거른다.
var tmp_users = [];
for(var i = 0; i<users.length; i++) {
    if(users[i].age < 30)
        tmp_users.push(users[i]);
}
// console.log(tmp_users);
    
//4) 30세 미만인 user의 이름 수집
var names = [];
for(var i = 0; i<tmp_users.length; i++) {
    names.push(tmp_users[i].name);
}
// console.log(names);

// 2. _filter, _map
let _filter = (list, predi) => { //응용형
    let new_list = [];
    for(let i = 0; i < list.length; i++) {
        if(predi(list[i])){
            new_list.push(list[i]);
        }
    }
    return new_list;
}
// 데이터 형이 어떻게 생겼는지 절!대! 오!픈! 안!함!
// 관심사의 철저한 분리
let _map = (list, mapper) => {
    var new_list = [];
    for(var i = 0; i<list.length; i++) {
        new_list.push(mapper(list[i]));
    }
    return new_list;
}

//함수를 인자로 받는다. 함수를 인자로 받는다. 함수를 인자로 받는다. 함수를 인자로 받는다. 함수를 인자로 받는다.
var over_30 = _filter(users, (user) => {return user.age >= 30})
console.log(over_30);

var names = _map(over_30, (user) => {
    return user.name;
});
console.log(names);

var under_30 = _filter(users, (user) => {return user.age < 30})
console.log(under_30);

var ages = _map(under_30, (user) => {
    return user.age;
});
console.log(ages);

//users일 필요가 없다 이말이야.
// console.log(
//     _filter([1,2,3,4], (num) => {return num % 2})
// )
// console.log(
//     _map([1, 2, 3], (num) => {return num % 2})
// )
console.log(
_map(
    _filter(users, (user) => {return user.age >= 30}),
    function(user) { return user.name })
)

//3. each
let _filter = (list, predi) => { 
    let new_list = [];
    _each(list, (val) => {
        if(predi(val))
            new_list.push(val);
    });
    return new_list;
}

let _map = (list, mapper) => {
    var new_list = [];
    _each(list, (val) => {
            new_list.push(mapper(val));
        });
    return new_list;
}

let _each = (list, iter) => {
    for(var i = 0; i < list.length; i++){
        iter(list[i]);
    }
    return list;
}

//4. 커링
// - 함수와 인자를 다루는 기법
// - 함수의 인자를 하나씩 적용해나가다가 다 채워진다면 본체를 실행하는 방식

//5. _reduce 만들기(list, iter, memo)
// - reduce 함수는 축약하는 함수로, 받은 데이터에서 출발해서 iter 함수를 통해 원하는 새로운 데이터를 만들 때 사용
// - array로 객체를 만들거나 할 때 사용
// - _rest : Array 객체에서 제공하는 메소드를 array_like에도 적용하기 위해 만드는 함수

//6. 파이프라인
// - 들어오는 함수들을 연속적으로 실행하기 위한 것
// - 함수만을 받는 함수