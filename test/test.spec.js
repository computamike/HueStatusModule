/* eslint-disable no-unused-expressions */

const chai = require('chai')
chai.use(require('sinon-chai'))
const expect = chai.expect
const sinon = require('sinon')
const HueStatusModule = require('../')

let mockConfig
let changeStub

describe('HueStatusModule Class', function () {
  beforeEach(() => {
    mockConfig = {
      name: 'HueStatusModule',
      myConfigVariable: '3abxxxxxxxxxxxxxxxxx0f5',
      pollInterval: 5000,
      light: 'Hue color lamp 2'
    }
  })

  it('It should set status to ok', async () => {
    const moduleInstance = new HueStatusModule(mockConfig, {})
    moduleInstance._setUpConfig()
    changeStub = sinon.stub(moduleInstance, 'change').resolves(true)

    await moduleInstance._poll()

    expect(changeStub).to.be.calledWith('ok', 'Everything is Ok')

    changeStub.restore()
  })

  it('Should generate instance name', () => {
    const moduleInstance = new HueStatusModule(mockConfig, {})
    expect(moduleInstance.instanceName).to.equal('Some clever string built from config variables')
  })

  it('Should throw when config variable is missing', () => {
    mockConfig.myConfigVariable = undefined
    const hueTimeRobot = new HueStatusModule(mockConfig, {})
    expect(() => { hueTimeRobot._setUpConfig() }).to.throw('HueStatusModule myConfigVariable config value not set')
  })

  it('Should poll every x seconds', async () => {
    this.clock = sinon.useFakeTimers()
    const moduleInstance = new HueStatusModule(mockConfig, {})
    moduleInstance._setUpConfig()

    sinon.stub(moduleInstance, '_poll')

    await moduleInstance.start()

    this.clock.tick(3000)

    expect(moduleInstance._poll).to.not.be.called

    this.clock.tick(3000)

    expect(moduleInstance._poll).to.be.calledOnce

    this.clock.tick(3000)

    expect(moduleInstance._poll).to.be.calledOnce

    this.clock.tick(3000)

    expect(moduleInstance._poll).to.be.calledTwice

    this.clock.restore()
  })

  it('Poll every 2 seconds by default', async () => {
    this.clock = sinon.useFakeTimers()
    mockConfig.pollInterval = undefined
    const moduleInstance = new HueStatusModule(mockConfig, {})
    moduleInstance._setUpConfig()

    sinon.stub(moduleInstance, '_poll')

    await moduleInstance.start()

    this.clock.tick(1200)

    expect(moduleInstance._poll).to.not.be.called

    this.clock.tick(1200)

    expect(moduleInstance._poll).to.be.calledOnce

    this.clock.tick(1200)

    expect(moduleInstance._poll).to.be.calledOnce

    this.clock.tick(1200)

    expect(moduleInstance._poll).to.be.calledTwice

    this.clock.restore()
  })

  it('Should throw an error when HueStatus is not found', () => {
    delete require.cache[require.resolve('requireg')]
    delete require.cache[require.resolve('../')]
    const requiregStub = sinon.stub(require('requireg'), 'resolve').throws('Not found')

    expect(() => { require('../') }).to.throw('A HueStatus installation is required -- npm install -g huestatus')

    requiregStub.restore()
  })
})
