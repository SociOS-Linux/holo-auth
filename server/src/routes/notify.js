/* global SETTINGS, WHITELIST, fetch */

const isInternal = email => email.endsWith('@holo.host')

const handle = async req => {
  const serverToken = await SETTINGS.get('postmark_server_token')
  const val = await req.json()
  let { email, error } = val
  
  // TODO: TEMP setting alias
  const alias = 'failed-registration'
  
  const group = isInternal(email) ? 'Internal' : 'External'

  const payload = {
    From: 'Holo <no-reply@holo.host>',
    Tag: `${group} ${alias}`,
    To: email,
    TemplateAlias: alias,
    TemplateModel: {
        error
    }
  }

  return fetch('https://api.postmarkapp.com/email/withTemplate', {
    method: 'POST',
    headers: {
     accept: 'application/json',
     'x-postmark-server-token': serverToken
    },
    body: JSON.stringify(payload)
  })
}

export { handle }