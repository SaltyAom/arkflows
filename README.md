# Arkflows
Light-weight state container for JavaScript app.
  
## Store which doesn't hurt.
Arkflows is very light-weight state container for JavaScript app. It contain shared state for JavaScript create( to access on any piece of code.  
Arkflows is inspired by Redux but with only a simple and handy logic. Under the hood, it use a simple collection of JavaScript API which supported since IE 9.
  
  Arkflows feature:
  * A very light-weight storage: 0.7KB (gzipped).
  * Very high performance operation.
  * Middleware support.
  * Readable error message, easier to debug.
  * As simple as LocalStorage.
  * Get realtime storage change.
  * TypeScript support.
  * Support on every browser even IE 10.

## Readable error
One thing people most hate about, `unreadable error` by human. It's very annoying yet not productive to anyone.  
Arkflows error is readable by human and suggested a way to resolve.
```javascript
let store = new Store()

// Create "sugar" store with initial value of { amount: 0 }

store.create("sugar", { amount: 0 }) // { amount: 0 }
store.create("sugar", { amount: 0 }) // sugar is already existed.
```
## A simple way to create store
Arkflows is very easy to be created, maintained, and debugged. It's just a collection of simple API under the hood.

### Create Store
Let's create a simple store with Arkflows.  
Arkflows is created with class to contain reusable collection of function.
```javascript
import Store from "arkflows"

let store = new Store()
```
`create()` will handle storage creation. It require `name` and `initial storage value`.
```javascript
let store = new Store()

store.create("sugar", { amount: 0 })
```
This will create a store name "sugar" with initial value of `{ amount: 0 }`.
  
### Get data
`get()` is introduced here, to retrieve data in the storage.
```javascript
let store = new Store()

store.create("sugar", { amount: 0 })

store.get("sugar")         // { amount: 0 }
store.get("sugar").amount  // 0
```
If you get data from storage which isn't existed, it'll return error.
```javascript
let store = new Store()

store.get("sugar") // sugar isn't existed. Please create it with create("sugar")

store.create("sugar", { amount: 0 })
store.get("sugar") // { amount: 0 }

store.get("salt") // salt isn't existed. Please create it with create("sugar")
```
  
## Update store
Mutate storage data, doesn't overwrite existed value if new value is not provided.
```javascript
let store = new Store()

store.create("sugar", { amount: 0 })
store.get("sugar") // { amount: 0 }

store.update("sugar", { amount: 1 })
store.get("sugar") // { amount: 1 }
```

## Set store
Overwrite a storage. Store's value will be overwriten. It take `store name` and `value`.
```javascript
let store = new Store()

store.create("sugar", { ingredient: "sugar", amount: 0 })
store.get("sugar") // { ingredient: "sugar", amount: 0 }

store.set("sugar", { amount: 0 })
store.get("sugar") // { amount: 0 }
```
  
## Subscribe to the storage
Arkflows is able to subscribe to the storage change in real-time.
```javascript
import Store from "arkflows"

let store = new Store()

store.create("sugar", { amount: 0 })

// Trigger when store is updated.
store.subscribe("sugar", data => {
    console.log(data) // Get current value of sugar. eg. { amount: 1 }
})

store.update("sugar", { amount: 1 })

// Support multiple listener at once.
store.subscribe(["sugar", "milk"], data => {
    console.log(data) // Get current value of sugar. eg. { amount: 1 }
})
```

## Middleware
A function which invoked before operation succeed.
Mutate store data is recommended here.
```javascript
import Store from "./purple.ts"

let store = new Store()

store.applyMiddleware((store, process) => {
  console.log(store, `Process: ${process}`) // { amount: 0 } Process: create(
  return store
})

store.create("sugar", { amount: 0 })
```

* list - Get every store name.
  ```typescript
  store.create("sugar", {})
  store.list() // ["sugar"]
  ```

* model - Get collection of store's model. An equivalent to `Object.entries()`
  ```typescript
  store.create("sugar", {
    amount: 0
  })
  store.model() // [
    [
      0: "sugar",
      1: { amount: 0 }
    ]
  ]
  ```