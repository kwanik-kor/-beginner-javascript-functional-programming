# PART 1

> "객체지향(OO)은 가동부를 캡슐화하여 코드의 이해를 돕는다.<br/>
 "함수형 프로그래밍(FP)은 가동부를 최소화하여 코드의 이해를 돕는다.

1. Application 설계 시 나는 아래의 원칙을 지키고 있는가?
    1) **확장성** : 추가 기능을 지원하기 위해 계속 코드를 리팩토링 해야하는가?
    2) **모듈화 용이성** : 파일 하나를 고치면 다른 파일도 영향을 받는가?/
    3) **재사용성** : 중복이 많은가?
    4) **테스트성** : 함수를 단위 테스트하기 어려운가?
    5) **헤아리기 쉬움** : 체계도 없고 따라가기 어려운 코드인가?

    ~~아니오.....~~

2. 용이한 유지보수를 위해 함수형 프로그래밍(FP)을 익혀보자!

*****

### 1. 함수형 프로그래밍이란?
> "**부수효과(side effect)**를 방지하고 상태 변이(mutation of state)를 감소하기 위해 데이터의 제어흐름과 연산을 추상(abstract) 하는 것"

```javascript
var printMessage = run(addToDom('msg'), h1, echo);

printMessage('Hello World');
```

**재사용성과 믿음성이 좋고 이해하기 쉬운, 더 작은 조각들로 프로그램을 나눈 후, 전체적으로 더 헤아리기 쉬운 형태의 프로그램으로 다시 조합하는 과정**

```javascript
//재사용성의 확대
var printMessage = run(console.log, repeat(2), h2, echo);

printMessage('Hello World');
```

#### 1.1 선언적 프로그래밍(Declarative Programming)
> 내부적으로 코드를 어떻게 구현한지, 데이터는 어떻게 흘러가는지 밝히지 않은 채 연산/작업을 표현

```javascript
//명령형
var array = [0, 1, 2, 3, 4, 5, 6, 7];
for(let i = 0; i < array.length; i++){
    array[i] = Math.pow(array[i], 2);
}

//함수형
[0, 1, 2, 3, 4, 5, 6, 7].map(num => Math.pow(num, 2));
```

#### 1.2 순수함수
> FP는 순수함수로 구성된 불변 프로그램 구축을 전제로 함
>> 1) 주어진 입력에만 의존, 숨겨진 값이나 외부상태와 무관하게 작동
>> 2) 전역 객체나 레퍼런스로 전달된 매개변수를 수정하는 것과 같은 스코프 밖의 변경을 일절 발생시키지 않음

```javascript
function showStudent(ssn) {
    let student = db.find(ssn);
    if(student != null){
        document
            .querySelector(`#${elementId}`)
            .innerHTML = `${student.ssn}${student.firstName}${student.lastName}`;
    } else {
        throw new Error('학생을 찾을 수 없습니다');
    }
}
```

**!! HTML 문서(DOM)는 그 자체로 가변적인, 전역 공유 자원이다.**<br>
**!! db나 elementID 역시 전역 변수라 무결성이 깨진다.**<br>
**!! 예외를 직접 handling 하지않고 던지고 있다.**

```javascript
var find = curry((db, id) => {
    let obj = db.find(id);
    if(obj == null){
        throw new Error('객체를 찾을 수 없슴다');
    }
    return obj;
});

var csv = student => `${student.ssn} ${studnet.firstName} ${student.lastName}`;

var append = curry((selector, info) => {
    document.querySelector(selector).innerHTML = info;
});
```

**!! 커링과 함수의 분할로 순수하지 않은 함수의 순수함수화**

#### 1.3 참조 투명성과 치환성
> 동일한 입력에 대한 동일한 결과 : 참조 투명한 함수

#### 1.4 불변 데이터 유지하기
<br>

### 2. 함수형 프로그래밍의 장점
#### 2.1 복잡한 작업을 분해
> FP는 분해와 합성의 상호작용이다.
- 이로 인해 모듈적으로, 효율적으로 동작한다.<br>
- 이 때, 모듈성의 단위(작업 단위)는 함수 자신이다.<br>
- 모름지기 함수는 저마다 한 가지의 목표만 바라봐야한다.

```javascript
// f ㆍg = f(g(x))
// 함수 합성을 이용한 compose는 오른쪽에서 왼쪽으로 해석
var showStudent = compose(append('#student-info'), csv, find(db));
```
#### 2.2 데이터를 매끄럽게 체이닝하여 처리
> 체인(chain) : 같은 객체를 반환하는 순차적인 함수 호출
```javascript
// 명령형 코드: 복수 과목 수강한 학생들의 평균 점수
let enrollment = [
    {enrolled: 2, grade: 100},
    {enrolled: 2, grade: 80},
    {enrolled: 1, grade: 85}
];

var totalGrade = 0;
var totalStudentFound = 0;
for(let i = 0; i < enrollment.length; i++) {
    let student = enrollment[i];
    if(student != null && student.enrolled > 1){
        totalGrade += student.grade;
        totalStudentFound++;
    }
}
var avg = totalGrade / totalStudentFound;

// 함수형 코드(Lodash)
_.chain(enrollment)
    .filter(student => student.enrolled > 1)
    .pluck('grade')
    .average()
    .value()
```

**!! 함수 체인은 필요한 시점까지 실행을 미루는 느긋한 평가(lazy evaluation)을 수행**

#### 2.3 복잡한 비동기 Application 에서도 신속하게 반응
> Reactive Paradigm의 가장 큰 장점은, Boilerplate 코드는 아예 잊고 비즈니스 로직에만 전념할 수 있게 해준다는 것이다.

> Reactive Paradigm은 Observable이라는 중요한 장치를 매개로 움직임<br>
    >> 어떤 요소의 컬렉션이든 사용자 입력이든 모두 정확히 동일한 수법으로 추상하여 처리<br>
    >> 수행하는 모든 연산은 불변 / 비즈니스 로직은 모두 분할