import { postRequest } from './request'
import lazyLoading from './lazyLoading'

function initMenu(commit) {
  postRequest('/api/config/sysmenu').then((resp) => {
    const data = resp.data
    let fmtRouters = []
    generateMenu(fmtRouters, data)
    commit('SET_ROUTERS', fmtRouters)
  })
}

export default (commit) => {
  //这里之所以要重新遍历一下，是因为，通常我们动态路由的时候，是获取服务端数据，这个component属性是一个字符串，或者可能连字段名都是其他的key
  //所以这里要做一些转换
  initMenu(commit)
}
function generateMenu(routers, data){
  data.forEach((item)=>{
    let menu = Object.assign({},item)
    menu.component = lazyLoading(menu.component)
    if(item.children && item.children.length > 0){
      menu.children = []
      generateMenu(menu.children, item.children)
    }
    routers.push(menu)
  })
  return routers
}