const apiToken = process.env.API_TOKEN
let currentLink

const shortLink = document.getElementById('short-link-1')
const shortLink2 = document.getElementById('short-link-2')
const shortLink3 = document.getElementById('short-link-3')
const originalLink = document.getElementById('long-link-1')
const link2 = document.getElementById('long-link-2')
const link3 = document.getElementById('long-link-3')

const hamburgerBtn = document.getElementById('menu-btn')
const menu = document.getElementById('menu')

const input = document.getElementById('link-input')
const linkForm = document.getElementById('link-form')
const errMsg = document.getElementById('err-msg')

hamburgerBtn.addEventListener('click', navToggle)
linkForm.addEventListener('submit', formSubmit)

// Toggle Mobile Menu
function navToggle() {
  hamburgerBtn.classList.toggle('open')
  menu.classList.toggle('flex')
  menu.classList.toggle('hidden')
}

// Validate a URL
function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i',
  )
  return !!pattern.test(str)
}

async function formSubmit(e) {
  e.preventDefault()

  if (input.value === '') {
    errMsg.innerHTML = `Please enter something`
    input.classList.add('border-red')
  } else if (!validURL(input.value)) {
    errMsg.innerHTML = `Please enter a valid URL`
    input.classList.add('border-red')
  } else {
    errMsg.innerHTML = ``
    input.classList.remove('border-red')
    let longLink

    if (input.value.includes('https://')) {
      longLink = input.value
    } else {
      longLink = `https://${input.value}`
    }

    const link = await fetchShortLink(longLink)

    if (link !== 'error') {
      errMsg.classList.add('text-green-500')
      errMsg.classList.remove('text-red')
      errMsg.innerHTML = `Copied!`
      input.classList.add('border-green-500')

      input.value = `${link}`

      link3.innerHTML = link2.innerHTML
      shortLink3.innerHTML = shortLink2.innerHTML
      link2.innerHTML = originalLink.innerHTML
      shortLink2.innerHTML = shortLink.innerHTML

      originalLink.innerHTML = currentLink
      shortLink.innerHTML = link
    } else {
      errMsg.innerHTML = 'Link is already shortened!'
    }
  }
}

async function fetchShortLink(longLink) {
  currentLink = longLink
  const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'long_url': longLink,
    }),
  })

  const data = await res.json()

  if (!data.errors) {
    const link = data.link.slice(8)

    return link
  } else {
    return 'error'
  }
}
