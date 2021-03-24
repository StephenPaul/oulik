# OLIK #

![Version](https://img.shields.io/npm/v/olik.svg)
[![Build Status](https://travis-ci.org/Memeplexx/olik.svg?branch=master)](https://travis-ci.org/Memeplexx/olik.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Memeplexx/Olik/badge.svg?branch=master)](https://coveralls.io/github/Memeplexx/Olik?branch=master)
![Package Size](https://badgen.net/bundlephobia/minzip/olik)
![Dependency count](https://badgen.net/bundlephobia/dependency-count/olik)

## Manage state **in-line** using a **curated**, **consistent** set of state-update APIs.  
With bindings for ***[Vanilla](https://memeplexx.github.io/olik/docs/vanilla-js)***,
***[React](https://memeplexx.github.io/olik/docs/read)***, and
***[Angular](https://memeplexx.github.io/olik/docs/angular)***

---

#### 🌈 **SET UP**
Initializing your store couldn't be simpler and integration with the Redux Devtools extension is automatic.
```ts
const select = set({
  username: '',
  favorite: {
    foods: new Array<string>(),
    hobbies: new Array<{ id: number, name: string }>(),
  },
});
```  
#### ✍️ **WRITE STATE** 
Writes consist of a **selection** from the store, followed by an **action** allowing Olik to describe your state-updates for you. 
```ts
select(s => s.username)            // type: 'select(username).replace()'
  .replace('Terence');             // replacement: 'Terence'

select(s => s.favorite.foods)      // type: 'select(favorite.foods).insert()'
  .insert(['Indian', 'Sushi']);    // insertion: ['Indian', 'Sushi']

select(s => s.favorite.hobbies)    // type: 'select(favorite.hobbies).whereOne(id).eq(3).patch()'
  .whereOne(s => s.id).eq(3)       // query: 'id === 3',
  .patch({ name: 'coding' });      // patch: { name: 'coding' }
```
#### 🔍 **READ STATE**
State can be read, listened to, or memoised.
```ts
select(s => s.favorite.hobbies)
  .read()

select(s => s.favorite.hobbies)
  .onChange(e => console.log(e));

const derivation = derive(
  select(s => s.foods),
  select(s => s.hobbies),
).usingExpensiveCalc(
  (foods, hobbies) => {
    // some calculation we don't want to repeat unnecessarily
  }
)
```
#### 🥚 **NEST STORES**
Manage each component's state and debug with or without your application store.
```ts
class TodoComponent {
  select = setNested({
    title: '',
    description: '',
    done: false,
  }, { storeName: 'TodoComponent' });
  onClickDone(done: boolean) {
    this.select(s => s.done)
      .replace(done);
  }
}
```