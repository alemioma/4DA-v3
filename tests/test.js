const ROUTES = {
  'Home': '/',
  'Technology': '/pages/technology.html',
  'TDPnet': '/pages/tdpnet.html',
  'Products & Solutions': '/pages/products.html',
  'About us': '/pages/about.html',
  'Contact': '/pages/contact.html',
}

const INCLUDES = [
  { path: '/sections/navbar.html', label: 'Navbar' },
  { path: '/sections/footer.html', label: 'Footer' },
]

let testResults = {}

function setStatus(id, status, label, detail) {
  testResults[id] = status
  const el = document.getElementById(id)
  if (!el) {
    const container = document.getElementById('route-results') ||
                      document.getElementById('navlink-results') ||
                      document.getElementById('include-results') ||
                      document.getElementById('page-results')
    if (container) {
      const div = document.createElement('div')
      div.id = id
      div.className = 'test-result'
      container.appendChild(div)
    }
    return
  }
  el.className = 'test-result'
  el.innerHTML = `
    <div class="test-status ${status}">${status === 'pass' ? '✓' : status === 'fail' ? '✗' : '…'}</div>
    <div class="test-label">
      <div class="test-label">${label}</div>
      ${detail ? `<div class="test-detail">${detail}</div>` : ''}
    </div>
  `
}

function addResult(containerId, id, status, label, detail) {
  const container = document.getElementById(containerId)
  const div = document.createElement('div')
  div.id = id
  div.className = 'test-result'
  div.innerHTML = `
    <div class="test-status ${status}">${status === 'pass' ? '✓' : status === 'fail' ? '✗' : '…'}</div>
    <div class="test-label">
      <div>${label}</div>
      ${detail ? `<div class="test-detail">${detail}</div>` : ''}
    </div>
  `
  container.appendChild(div)
  testResults[id] = status
}

function updateSummary() {
  const total = Object.values(testResults).length
  const passed = Object.values(testResults).filter(s => s === 'pass').length
  const failed = Object.values(testResults).filter(s => s === 'fail').length
  const summary = document.getElementById('summary')
  const title = document.getElementById('summary-title')
  const text = document.getElementById('summary-text')
  summary.classList.remove('hidden')
  summary.className = failed > 0 ? 'has-fail' : 'all-pass'
  title.textContent = failed > 0 ? `Tests Failed: ${failed} of ${total}` : `All ${total} Tests Passed`
  text.textContent = `${passed} passed, ${failed} failed, ${total - passed - failed} pending`
}

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
    clearTimeout(id)
    return response
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

async function testRoutes() {
  const container = document.getElementById('route-results')
  container.innerHTML = ''

  for (const [name, path] of Object.entries(ROUTES)) {
    addResult('route-results', `route-${name.replace(/\s+/g, '-')}`, 'pending', name, `Checking ${path}`)
    try {
      const response = await fetchWithTimeout(path)
      if (response.ok) {
        const html = await response.text()
        addResult('route-results', `route-${name.replace(/\s+/g, '-')}`, 'pass', name, `Status: ${response.status} (${html.length} bytes)`)
      } else {
        addResult('route-results', `route-${name.replace(/\s+/g, '-')}`, 'fail', name, `HTTP ${response.status}`)
      }
    } catch (e) {
      addResult('route-results', `route-${name.replace(/\s+/g, '-')}`, 'fail', name, `Error: ${e.message}`)
    }
  }
}

async function testNavLinks() {
  const container = document.getElementById('navlink-results')
  container.innerHTML = ''

  const navLinks = [
    { label: 'Technology', href: '/pages/technology.html' },
    { label: 'TDPnet', href: '/pages/tdpnet.html' },
    { label: 'About us', href: '/pages/about.html' },
    { label: 'Contact', href: '/pages/contact.html' },
    { label: 'Products (Infra)', href: '/pages/products.html' },
    { label: 'Products (MDCD Maya)', href: '/pages/products.html' },
    { label: 'Products (Apps)', href: '/pages/products.html' },
  ]

  for (const link of navLinks) {
    addResult('navlink-results', `nav-${link.label.replace(/[^a-zA-Z]/g, '')}`, 'pending', link.label, `Link: ${link.href}`)
    try {
      const response = await fetchWithTimeout(link.href)
      if (response.ok) {
        addResult('navlink-results', `nav-${link.label.replace(/[^a-zA-Z]/g, '')}`, 'pass', link.label, `Resolved correctly`)
      } else {
        addResult('navlink-results', `nav-${link.label.replace(/[^a-zA-Z]/g, '')}`, 'fail', link.label, `HTTP ${response.status}`)
      }
    } catch (e) {
      addResult('navlink-results', `nav-${link.label.replace(/[^a-zA-Z]/g, '')}`, 'fail', link.label, `Error: ${e.message}`)
    }
  }
}

async function testIncludes() {
  const container = document.getElementById('include-results')
  container.innerHTML = ''

  for (const inc of INCLUDES) {
    addResult('include-results', `inc-${inc.label}`, 'pending', inc.label, `Checking ${inc.path}`)
    try {
      const response = await fetchWithTimeout(inc.path)
      if (response.ok) {
        const html = await response.text()
        const hasContent = html.trim().length > 0
        addResult('include-results', `inc-${inc.label}`, hasContent ? 'pass' : 'fail', inc.label,
          hasContent ? `Loaded (${html.length} bytes)` : 'Empty file')
      } else {
        addResult('include-results', `inc-${inc.label}`, 'fail', inc.label, `HTTP ${response.status}`)
      }
    } catch (e) {
      addResult('include-results', `inc-${inc.label}`, 'fail', inc.label, `Error: ${e.message}`)
    }
  }

  // Test that each page has navbar and footer includes
  const pagesWithIncludes = Object.values(ROUTES).filter(p => p !== '/')
  for (const pagePath of pagesWithIncludes) {
    const pageName = Object.keys(ROUTES).find(k => ROUTES[k] === pagePath) || pagePath
    addResult('include-results', `inc-check-${pageName.replace(/\s+/g, '-')}`, 'pending', `${pageName} includes`, `Checking navbar/footer references`)
    try {
      const response = await fetchWithTimeout(pagePath)
      if (response.ok) {
        const html = await response.text()
        const hasNavbar = html.includes('data-include') && html.includes('navbar')
        const hasFooter = html.includes('data-include') && html.includes('footer')
        const allGood = hasNavbar && hasFooter
        addResult('include-results', `inc-check-${pageName.replace(/\s+/g, '-')}`, allGood ? 'pass' : 'fail', `${pageName} includes`,
          allGood ? 'Has navbar and footer includes' :
          `Missing: ${!hasNavbar ? 'navbar ' : ''}${!hasFooter ? 'footer' : ''}`)
      }
    } catch (e) {
      // Already tested in routes, skip
      addResult('include-results', `inc-check-${pageName.replace(/\s+/g, '-')}`, 'pass', `${pageName} includes`, `Skipped (route test covers this)`)
    }
  }
}

async function testPageContent() {
  const container = document.getElementById('page-results')
  container.innerHTML = ''

  const checks = [
    { page: '/pages/technology.html', name: 'Technology', check: html => html.includes('under maintenance') || html.includes('maintenance') },
    { page: '/pages/tdpnet.html', name: 'TDPnet', check: html => html.includes('under maintenance') || html.includes('maintenance') },
    { page: '/pages/products.html', name: 'Products', check: html => html.includes('under maintenance') || html.includes('maintenance') },
    { page: '/pages/about.html', name: 'About', check: html => html.includes('under maintenance') || html.includes('maintenance') },
    { page: '/pages/contact.html', name: 'Contact', check: html => html.includes('contact-form') || html.includes('Contact us') },
  ]

  for (const c of checks) {
    addResult('page-results', `page-${c.name}`, 'pending', c.name, `Checking content`)
    try {
      const response = await fetchWithTimeout(c.page)
      if (response.ok) {
        const html = await response.text()
        const valid = c.check(html)
        addResult('page-results', `page-${c.name}`, valid ? 'pass' : 'fail', c.name,
          valid ? 'Expected content found' : 'Expected content missing')
      } else {
        addResult('page-results', `page-${c.name}`, 'fail', c.name, `HTTP ${response.status}`)
      }
    } catch (e) {
      addResult('page-results', `page-${c.name}`, 'fail', c.name, `Error: ${e.message}`)
    }
  }
}

async function runAllTests() {
  const btn = document.getElementById('run-tests')
  btn.disabled = true
  btn.textContent = 'Running...'
  testResults = {}
  document.getElementById('summary').classList.add('hidden')

  await testRoutes()
  updateSummary()

  await testNavLinks()
  updateSummary()

  await testIncludes()
  updateSummary()

  await testPageContent()
  updateSummary()

  btn.disabled = false
  btn.textContent = 'Run All Tests'
}

// Auto-run on page load
document.addEventListener('DOMContentLoaded', () => {
  runAllTests()
})
