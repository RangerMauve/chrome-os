/* global chrome */

var platformMap = {
  mac: 'darwin',
  win: 'win32',
  android: 'android',
  cros: 'cros',
  linux: 'linux',
  openbsd: 'openbsd',
  notsupported: 'Not Supported'
}

const IS_IPV4 = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/

const KNOWN_INTERNAL = ['lo']

let cachedCPUs = null
let cachedPlatform = null
let cachedInterfaces = null

exports.endianness = function () { return 'LE' }

exports.hostname = function () {
  var location = window.location
  if (typeof location !== 'undefined') {
    return location.hostname
  } else return ''
}

exports.loadavg = function () { return [] }

exports.uptime = function () { return 0 }

exports.freemem = function () {
  return Number.MAX_VALUE
}

exports.totalmem = function () {
  return Number.MAX_VALUE
}

exports.cpus = function (cb) {
  if (cachedCPUs) return cachedCPUs
  if (typeof cb !== 'function') {
    console.warn('The Synchronious cpu call is not supported on Browsers. Consider the Async call by passing a function')
    return []
  }
  chrome.system.cpu.getInfo(({ modelName, processors }) => {
    cachedCPUs = processors.map(({ user, kernel, idle, total }) => {
      return {
        model: modelName,
        speed: 420,
        times: { user, sys: kernel, idle, total, irq: 0, nice: 0 }
      }
    })
    cb(cachedCPUs)
})  // eslint-disable-line

  return []
}

exports.type = function () { return 'Chrome Packaged Application' }

exports.release = function () {
  if (typeof navigator !== 'undefined') {
    return navigator.appVersion
  }
  return ''
}

exports.networkInterfaces =
exports.getNetworkInterfaces =
function (cb) {
  if (cachedInterfaces) return cachedInterfaces
  if (typeof cb !== 'function') {
    console.warn('The Synchornous networkInterfaces call is no supported in Browsers. Consider the Async call by passing a function')
    return []
  }
  chrome.system.network.getNetworkInterfaces((interfaces) => {
    cachedInterfaces = interfaces.reduce((result, { name, address }) => {
      const family = address.match(IS_IPV4) ? 'IPv4' : 'IPv6'
      const isKnown = KNOWN_INTERNAL.includes(name)
      const is127 = address === '127.0.0.1'
      const is1 = address === '::1'
      const isCalledLoopback = name.startsWith('Loopback')
      const internal = isKnown || is127 || is1 || isCalledLoopback

      let list = result[name]
      if (!list) {
        list = []
        result[name] = list
      }

      list.push({
        address,
        internal,
        family,
        mac: '00:00:00:00:00:00'
      })

      return result
    }, {})

    cb(cachedInterfaces)
  })

  return []
}

exports.arch = function () { return 'Not Supported' }

exports.platform = function (cb) {
  if (cachedPlatform) return cachedPlatform
  if (typeof cb !== 'function') {
    console.warn('The Synchronious platform call is not supported on Browserify CPA. Consider the Async call by passing a function')
    return platformMap.notsupported
  }
  chrome.runtime.getPlatformInfo(function (info) { // eslint-disable-line
    cachedPlatform = platformMap[info.os]
    cb(cachedPlatform)
  })

  return platformMap.notsupported
}

exports.tmpdir = exports.tmpDir = function () {
  return '/tmp'
}

exports.EOL = '\n'
