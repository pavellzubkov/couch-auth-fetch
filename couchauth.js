const dbAdr = 'http//localhost:5984'


  export async function couch_login(credintials) {
    //   credintials = {
    //     "name": "root",
    //     "password": "relax"
    // }
    return await dbReqResp('POST', '/_session', credintials)
  }
  
  export async function couch_logout() {
    return await dbReqResp('DELETE', '/_session')
  }
  
  export async function couch_getsession() {
    return await dbReqResp('GET', '/_session')
  }
  
  export async function couch_changepass(usId, newpass) {
    const myUsDoc = await dbReqResp('GET', `/_users/org.couchdb.user:${usId}`)
    delete myUsDoc.password_scheme
    delete myUsDoc.iterations
    delete myUsDoc.derived_key
    delete myUsDoc.salt
    myUsDoc.password = newpass
    return await dbReqResp('PUT', `/_users/org.couchdb.user:${usId}`, myUsDoc)
  }
  
  export async function couch_createuser(usId, newpass) {
    const myUsDoc = {}
    // {"name": "jan", "password": "apple", "roles": [], "type": "user"}
    myUsDoc.name = usId
    myUsDoc.password = newpass
    myUsDoc.roles = ['user']
    myUsDoc.type = 'user'
    return await dbReqResp('PUT', `/_users/org.couchdb.user:${usId}`, myUsDoc)
  }

  async function dbReqResp(method, uri, data) {
    return await commonFetchReq(dbAdr, method, uri, data)
  }

  async function commonFetchReq(apiAdr, method, uri, data, returnUrl) {
    const init = {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'include', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getJwtToken()}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: data ? JSON.stringify(data) : undefined // body data type must match "Content-Type" header
    }
    try {
      const resp = await fetch(apiAdr + uri, init)
  
      const json = returnUrl ? await resp.blob() : await resp.json()
      console.log('commonFetchReq method -', method, ' uri -', uri, ' data -', data, 'resp - ', json)
      if (json.error) {
        // await checkErrType(json)
      } else {
        return returnUrl ? URL.createObjectURL(json) : json
      }
    } catch (e) {
      console.warn('commonFetchReq method error -', e)
      //await checkErrType(e)
      throw e
    }
  }