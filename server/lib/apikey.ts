/*
For internal API, we will generate an api Key that must be provided as
GET parameter for every API call.
*/

async function _getKey ({ storageManager }: RegisterServerOptions, key: string): Promise<string> {
  let value: string = await storageManager.getData(key)
  if (!value) {
    value = Math.random().toString(36).slice(2, 12)
    await storageManager.storeData(key, value)
  }
  return value
}

async function getAPIKey (options: RegisterServerOptions): Promise<string> {
  return _getKey(options, 'APIKEY')
}

async function getExternalComponentKey (options: RegisterServerOptions, componentName: string): Promise<string> {
  if (!/^[A-Z]+$/.test(componentName)) {
    throw new Error('Invalid component name: ' + componentName)
  }
  const key = 'EXTERNALCOMPONENTKEY_' + componentName
  return _getKey(options, key)
}

export {
  getAPIKey,
  getExternalComponentKey
}
