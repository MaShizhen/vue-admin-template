import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getSessionid } from '@/utils/auth' // get sessionid from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasSessionid = getSessionid()
  if (hasSessionid) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info, roles, menus
          /** const menus = */ await store.dispatch('user/auth_info')
          const menus = [{
            menu_no: '1',
            menu_name: '看板',
            parent_no: '',
            icon: 'dashboard',
            is_show: true,
            package_url: 'dashboard'
          }, {
            menu_no: '2',
            menu_name: '示例',
            parent_no: '',
            icon: 'tree',
            is_show: true,
            package_url: null
          }, {
            menu_no: '3',
            menu_name: '表格',
            parent_no: '2',
            icon: 'table',
            is_show: true,
            package_url: 'table'
          }, {
            menu_no: '4',
            menu_name: '折叠树',
            parent_no: '2',
            icon: 'tree',
            is_show: true,
            package_url: 'tree'
          }, {
            menu_no: '5',
            menu_name: '外链',
            parent_no: '',
            icon: 'link',
            is_show: true,
            package_url: 'https://panjiachen.github.io/vue-element-admin-site/#/'
          }]
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
          console.log(accessRoutes)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove sessionid and go to login page to re-login
          await store.dispatch('user/resetSessionid')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no sessionid*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
