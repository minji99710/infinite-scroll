import Nav from './Nav.js'
import NewsList from './NewsList.js'

class PubSub {
  constructor () {
    this.events = {}
  }

  subscribe (event, callback) {
    const self = this

    if (!self.events.hasOwnProperty(event)) {
      self.events[event] = []
    }

    return self.events[event].push(callback)
  }

  publish (event, data = {}) {
    const self = this

    if (!self.events.hasOwnProperty(event)) {
      return []
    }

    return self.events[event].map(callback => callback(data))
  }
}

class Store {
  constructor (params) {
    const self = this
    self.actions = {}
    self.mutations = {}
    self.state = {}
    self.status = 'resting'
    self.events = new PubSub()

    if (params.hasOwnProperty('actions')) {
      self.actions = params.actions
    }

    if (params.hasOwnProperty('mutations')) {
      self.mutations = params.mutations
    }

    self.state = new Proxy((params.state || {}), {
      get: function (state, key) {
        return state[key]
      },
      set: function (state, key, value) {
        state[key] = value

        console.log(`categoryChange: ${key}: ${value}`)
        // console.log('self.state: ', self.state.category)
        self.events.publish('categoryChange', self.state.category)

        // if (self.status !== 'mutation') {
        //   console.warn(`You should use a mutation to set ${key}`)
        // }

        self.status = 'resting'

        return true
      }
    })
  }
}
const store = new Store({ state: { category: 'all' } })
export { Nav, NewsList, store }
