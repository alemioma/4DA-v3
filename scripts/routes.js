const routes = {
  home: '/',
  technology: '/pages/technology.html',
  tdpnet: '/pages/tdpnet.html',
  products: '/pages/products.html',
  about: '/pages/about.html',
  contact: '/pages/contact.html',
}

function navigate(routeName) {
  const path = routes[routeName]
  if (path) {
    window.location.href = path
  }
}

function getRoute(routeName) {
  return routes[routeName] || '/'
}

if (typeof module !== 'undefined') {
  module.exports = { routes, navigate, getRoute }
}
