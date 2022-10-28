import Nav from './Nav.js'
import NewsList from './NewsList.js'

class PubSub {
  constructor () {
    this.events = {}
  }

  subscribe (event, callback) {
    const self = this

    if (!Object.prototype.hasOwnProperty.call(self.events, event)) {
      self.events[event] = []
    }

    return self.events[event].push(callback)
  }

  publish (event, data = {}) {
    const self = this

    if (!Object.prototype.hasOwnProperty.call(self.events, event)) {
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
    self.state = new Proxy((params.state || {}), {
      get: function (state, key) {
        return state[key]
      },
      set: function (state, key, value) {
        state[key] = value
        self.events.publish('categoryChange', self.state.category)

        return true
      }
    })
  }
}
const store = new Store({ state: { category: 'all' } })
export { Nav, NewsList, store }
