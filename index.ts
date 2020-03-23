declare global {
    interface Window {
        __arkflows__:
            | {
                  version: string
                  listener: Function
                  process: Array<{
                      store: any
                      process: ArkflowsProcess
                      name: string
                  }>
              }
            | undefined
    }
}

type ArkflowsEventStore = { [key: string]: ArkflowsEvent }

interface ArkflowsEvent extends Event {
    detail?: any
}

type ArkflowsProcess = "create" | "get" | "update" | "set" | "subscribe"
type ValueOf<T> = T[keyof T]

const validate = (type: string, event: ArkflowsEventStore) => {
        if (!type) throw "type is required."
        if (typeof type !== "string") throw "type must be string."
        if (typeof event[type] === "undefined")
            throw `Store: ${type} isn't existed. Please create it with create("${type}")`
    },
    isObject = (value: any) => typeof value === "object",
    isServer = typeof window === "undefined"

var EventTargetClass =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        ? require("./polyfill")
        : !isServer
        ? class E extends EventTarget {}
        : null

export default !isServer
    ? class Arkflows extends EventTargetClass {
          event: Record<string, ArkflowsEvent>
          store: Record<string, any>

          private withDevtools: boolean | undefined
          private middleware: Function[]

          constructor() {
              super()

              this.event = {}
              this.store = {}
              this.middleware = []
              this.withDevtools = undefined
          }

          /**
           * Create store.
           * Create a collection of storage which can be used in various collection
           * @param {string} name - Store Name
           * @param initStore - Initial storage value
           * @returns {object} Storage value - Return any due to middleware.
           */
          create<T = string | number | object | {}>(
              name: string,
              initStore: T
          ): T {
              if (typeof this.store[name] !== "undefined")
                  throw `${name} is already existed.`

              this.event[name] = new Event(name)
              this.store[name] = this.useMiddleware(
                  typeof initStore !== "undefined" ? initStore : {},
                  "create",
                  name
              )

              return this.store[name]
          }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get<T extends string>(name: T): Arkflows["store"][T] {
              validate(name, this.event)
              return Object.freeze(
                  this.useMiddleware(this.store[name], "get", name)
              )
          }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {string | number | object} value - Value to change or update
           * @returns {object} Storage value
           */
          set<T>(
              name: string,
              value: T
          ): T {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = this.useMiddleware(value, "set", name)
              this.dispatchEvent(event)
              return this.store[name]
          }

          /**
           * Update store.
           * Mutate storage data, doesn't overwrite existed value if new value is not provided.
           * @param {string} name - Store Name
           * @param {string | number | object} value - Value to change or update
           * @returns Storage value
           */
          update<T>(
              name: string,
              value: T
          ) : T {
              validate(name, this.event)

              let event = this.event[name]
              event.detail = value

              this.store[name] = this.useMiddleware(
                  isObject(value)
                      ? {
                            ...this.store[name],
                            ...value
                        }
                      : value,
                  "update",
                  name
              )
              this.dispatchEvent(event)
              return this.store[name] as T
          }

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string|string[]} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe<T = string | number | object>(
              name: string | string[],
              callback: (value: T, name: string, model: any) => any
          ): {
              unsubscribe: () => void
          } {
              if (name === "*") name = [...this.list()] || []
              if (typeof name === "string") name = new Array(name)

              let events: any[] = []

              name.forEach(eachName => {
                  validate(eachName, this.event)

                  let eventCallback = () =>
                      callback(
                          this.useMiddleware(
                              this.store[eachName],
                              "subscribe",
                              eachName
                          ),
                          eachName,
                          this.model()
                      )

                  events.push(eventCallback)

                  return this.addEventListener(eachName, () => eventCallback())
              })

              return {
                  unsubscribe: () =>
                      Object.entries(this.event).forEach(([name, _], index) =>
                          this.removeEventListener(name, events[index])
                      )
              }
          }

          /**
           * Get every store name.
           * @returns {string} name - Store's name.
           * @returns {object} store - Store's value.
           */
          list(): string[] {
              return Object.keys(this.store)
          }

          /**
           * Single store model
           * @typedef StoreModel
           * @type {object}
           * @returns {string} name - Store's name.
           * @returns {object} store - Store's value.
           */

          /**
           * Retreive every store collection's model.
           * @returns {StoreModel[]} - Collection of store's model
           */
          model(): Array<{
              name: keyof Arkflows["store"]
              store: Arkflows["store"][keyof Arkflows["store"]]
          }> {
              let storeList: Array<{
                  name: keyof Arkflows["store"]
                  store: Arkflows["store"][keyof Arkflows["store"]]
              }> = []
              Object.entries(this.store).map(([name, store]) => {
                  storeList.push(
                      JSON.parse(
                          `{"name":"${name}","store":${JSON.stringify(
                              this.useMiddleware(store, "get", name)
                          )}}`
                      )
                  )
              })
              return storeList
          }

          /**
           * Middleware callback
           *
           * @callback MiddlewareCallback
           * @param store - Collection of existing store.
           * @param process - Process name which flow through middleware.
           * @param { string } name - Store name.
           */

          /**
           * Add middleware to store.
           * @param {MiddlewareCallback} callback - Callback function to manipulate data from middleware.
           */
          applyMiddleware(
              ...callbacks: Array<
                  (
                      store: Arkflows["store"][keyof Arkflows["store"]],
                      process: ArkflowsProcess,
                      name: string
                  ) => any
              >
          ): void {
              callbacks.forEach(callback => this.middleware.push(callback))
          }

          /**
           * Use middleware in an internal storage.
           * @private
           * @param @readonly store - Collection of existing store.
           * @param { "create" | "get" | "update" | "set" | "subscribe"} process - Process name which flow through middleware.
           * @param {string} name - Store Name
           */
          private useMiddleware(
              store: Arkflows["store"][keyof Arkflows["store"]],
              process: ArkflowsProcess,
              name: string
          ): any {
              let currentStore = Object.freeze(store)
              this.middleware.map(
                  runMiddleware =>
                      (currentStore = runMiddleware(
                          currentStore,
                          process,
                          name
                      ))
              )

              if (
                  this.withDevtools &&
                  typeof window.__arkflows__ === "undefined"
              ) {
                  window.__arkflows__ = {
                      version: "0.4.0",
                      listener: (callback: (value: any) => any) =>
                          this.subscribe("*", store => callback(store)),
                      process: []
                  }
                  if (process !== "subscribe")
                      window.__arkflows__.process.push({
                          name: name,
                          process: process,
                          store: store
                      })
              }

              return currentStore
          }

          /**
           * Enable Arkflows devtools in browser developer's tool.
           * @param {boolean} option - Enable devtools.
           */
          enableDevtools(option: boolean = true) {
              if (typeof this.withDevtools !== "undefined")
                  throw "Devtools can only figure at once."
              if (!option) return

              window.__arkflows__ = {
                  version: "0.4.0",
                  listener: (callback: Function = () => null) =>
                      this.subscribe("*", (store, name: string) =>
                          callback(store, name, this.model())
                      ),
                  process: []
              }

              this.withDevtools = true
          }
      }
    : class ArkflowsServer {
          event: Record<string, ArkflowsEvent>
          store: Record<string, any>

          private withDevtools: boolean | undefined
          private middleware: Function[]

          constructor() {
              this.event = {}
              this.store = {}
              this.middleware = []
              this.withDevtools = undefined
          }

          /**
           * Create store.
           * Create a collection of storage which can be used in various collection
           * @param {string} name - Store Name
           * @param initStore - Initial storage value
           * @returns {object} Storage value
           */
          create<T = string | number | object | {}>(
              name: string,
              initStore: T
          ): T {
              return initStore
          }

          /**
           * Get existing store value with given store name.
           * @param {string} name - Store Name
           * @returns {object} Storage value
           */
          get<T extends string>(name: T) {
              return this.store[name]
          }

          /**
           * Set store.
           * Overwrite a storage. Store's value will be overwriten.
           * @param {string} name - Store Name
           * @param {string | number | object} value - Value to change or update
           * @returns {object} Storage value
           */
          set<T>(name: string, value: T): T {
              return value
          }

          /**
           * Update store.
           * Mutate storage data, doesn't overwrite existed value if new value is not provided.
           * @param {string} name - Store Name
           * @param value - Value to change or update
           * @returns Storage value
           */
          update<T>(name: string, value: T): T {
              return value
          }

          /**
           *
           * Middleware callback
           * @callback MiddlewareCallback
           * @param store - Collection of existing store.
           * @param process - Process name which flow through middleware.
           */

          /**
           * Subscribe store.
           * Listen to a storage update, invoke callback when update.
           * @param {string|string[]} name - Store Name
           * @param {object} initStore - Initial storage value
           */
          subscribe<T = string | number | object>(
              name: string | string[],
              callback: (value: T, name: string, model: any) => any
          ): {
              unsubscribe: () => void
          } {
              return { unsubscribe: () => null }
          }

          /**
           * Get every store name.
           * @returns {string[]} name - Store's name.
           */
          list(): string[] {
              return []
          }

          /**
           * Single store model
           * @typedef StoreModel
           * @type {object}
           * @returns {string} name - Store's name.
           * @returns {object} store - Store's value.
           */

          /**
           * Retreive every store collection's model.
           * @returns {StoreModel[]} Store Model - Collection of store's model
           */
          model(): Array<{
              name: keyof ArkflowsServer["store"]
              store: ArkflowsServer["store"][keyof ArkflowsServer["store"]]
          }> {
              return []
          }

          /**
           * Middleware callback
           *
           * @callback MiddlewareCallback
           * @param store - Collection of existing store.
           * @param process - Process name which flow through middleware.
           * @param { string } name - Store name.
           */

          /**
           * Add middleware to store.
           * @param {MiddlewareCallback} callback - Callback function to manipulate data from middleware.
           */
          applyMiddleware(
              ...callbacks: Array<
                  (
                      store: ArkflowsServer["store"][keyof ArkflowsServer["store"]],
                      process: ArkflowsProcess,
                      name: string
                  ) => any
              >
          ) {}

          /**
           * Enable Arkflows devtools in browser developer's tool.
           * @param {boolean} option - Enable devtools.
           */
          enableDevtools(option: boolean = true) {}
      }
