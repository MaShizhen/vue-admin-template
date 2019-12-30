/* Layout */
import Layout from '@/layout'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
function filterAsyncRoutes(routes) {
  const menu_no = routes.menu_no
  const chil = data.menus.filter((sub) => {
    return sub.parent_no === menu_no
  })
  if (chil.length > 0) {
    return {
      ...routes,
      children: chil.map((c) => {
        return filterAsyncRoutes(c)
      })
    }
  } else {
    return routes
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const data = {
  menus: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const data_router = []
      data.menus = menus
      const show_menus = menus.filter((item) => {
        if (item.package_url) {
          data_router.push({
            path: `/${item.package_url}`,
            component: Layout,
            redirect: `/${item.package_url}/index`,
            children: [{
              path: 'index',
              name: item.package_url,
              // component: import('@/views/tree/index')
              component: (resolve) => require(['@/views/' + item.package_url + '/index'], resolve)
            }]
          })
        }
        return item.parent_no === ''
      }).map((m) => {
        return filterAsyncRoutes(m)
      })
      commit('SET_ROUTES', show_menus)
      data_router.push({ path: '*', redirect: '/404', hidden: true })
      resolve(data_router)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
