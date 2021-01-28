const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    role_id: state => state.user.role_id,
    email: state => state.user.email,
    username: state => state.user.username,
    organ_id: state => state.user.organ_id,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    permission_routes: state => state.permission.routes
}
export default getters
