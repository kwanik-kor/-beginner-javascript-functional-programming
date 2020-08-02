# PART 2
> JavaScript는 함수형인 동시에 객체지향 언어다. 이를 잊어서는 안된다.

### 1. 함수형 vs 객체지향 프로그래밍
> 객체지향과 함수형의 가장 중요한 차이는 데이터와 함수를 조직하는 방법에 있다.

**객체지향은 객체의 데이터와 잘게 나뉜 함수가 단단히 유착되어 응집도가 높은 반면, 함수형은 만사가 불변인 관계로 데이터와 함수가 느슨하게 결합된다.**

=> 객체지향은 잘게 나뉜 기능을 구현하기 위해 특수한 자료형을 생성한다.<br>
=> 함수형으로 개발하면 소수의 자료형에서 작동하는 독립적인, 분리된 함수를 더 많이 사용하게 된다.

```javascript
// OOP - this
get fullname() {
    return [this._firstname, this._lastname].join(' ');
}

//FP - this => param
const fullname = person => [person.firstname, person.lastname].join(' ');
```




