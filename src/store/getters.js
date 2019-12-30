const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  sessionid: state => state.user.sessionid,
  avatar: state => state.user.avatar,
  usercode: state => state.user.usercode,
  name: state => state.user.name,
  roles: state => state.user.roles,
  role_no: state => state.user.role_no,
  permission_routes: state => state.permission.routes,
  menus: state => state.permission.menus
}
export default getters
