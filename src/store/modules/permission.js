import * as router from '@/router'
import MenuUtils from '@/utils/MenuUtils'

const permission = {
  state: {
    routers: router.constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = router.constantRouterMap.concat(routers)
      router.default.addRoutes(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        MenuUtils(commit)
        resolve()
      })
    }
  }
}

export default permission
