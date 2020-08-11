import request from '@/utils/request'

export function findYuyueUserAll(data) {
  return request({
    url: '/wash/user/findYuyueUserAll',
    method: 'post',
    data
  })
}

export function updateYuyueUserByuId(data) {
    return request({
      url: '/wash/user/updateYuyueUserByuId',
      method: 'post',
      data
    })
}

// 以下是新改版接口
export function findUserRolePermission(data) {
  return request({
    url: '/wash/findUserRolePermission',
    method: 'post',
    data
  })
}

export function findBmRoleList(data) {
  return request({
    url: '/wash/findBmRoleList',
    method: 'post',
    data
  })
}

export function saveBmUserRole(data) {
  return request({
    url: '/wash/saveBmUserRole',
    method: 'post',
    data
  })
}

export function saveYuyueUser(data) {
  return request({
    url: '/wash/user/saveYuyueUser',
    method: 'post',
    data
  })
}

export function delYuyueByuId(data) {
  return request({
    url: '/wash/user/delYuyueByuId',
    method: 'post',
    data
  })
}