import Store from "../index"

describe("Model", () => {
    it("return model", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        expect(store.model()).toEqual([
            {
                name: "store",
                store: {
                    initial: true
                }
            }
        ])
    })

    it("return multiple models", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.create("flow", {
            initial: true
        })

        expect(store.model()).toEqual([
            {
                name: "store",
                store: {
                    initial: true
                }
            },
            {
                name: "flow",
                store: {
                    initial: true
                }
            }
        ])
    })

    it("return empty model", () => {
        let store = new Store()

        expect(store.model()).toEqual([])
    })})
