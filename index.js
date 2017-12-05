let BaseModule

try {
  BaseModule = require(require('requireg').resolve('huestatus/src/Module'))
} catch (e) {
  throw new Error('A HueStatus installation is required -- npm install -g huestatus')
}

class HueTry extends BaseModule {
  /**
   * Generate instance name based on project and organisation
   * @return {String}
   */
  generateInstanceName () {
    return 'Some clever string built from config variables'
  }

  /**
   * Start method, called on huestatus start. Loops through _poll method
   */
  async start () {
    this._setUpConfig()
    setInterval(this._poll.bind(this), this.config.pollInterval || 2000)
  }

  /**
   * Check for config variables and any other module set up (registering API clients etc)
   * @throws error when required config value is not set
   */
  _setUpConfig () {
    ['myConfigVariable'].map(configItem => {
      if (!this.config[configItem]) {
        throw new Error(`HueStatusModule ${configItem} config value not set`)
      }
    })
  }

  /**
   * Make a request to the sentry API, check for unresolved issues, then filter out already assigned issues
   * @return {Promise}
   */
  async _poll () {
    // Do some polling, then call this.change() to update the status
    return this.change('ok', 'Everything is Ok')
  }
}

module.exports = HueTry
