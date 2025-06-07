
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 15249, hash: '8d5400b29275b1c39c6cdfb6258356a98ce3437deb8b7de50d1ea863249fe87c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 15163, hash: 'f575ed6ef15ba5172aef93e124eceb8fc087d186c07badf7451524797fd2286a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-CYQQTMFF.css': {size: 485, hash: 'iYWGnAcA8g8', text: () => import('./assets-chunks/styles-CYQQTMFF_css.mjs').then(m => m.default)}
  },
};
