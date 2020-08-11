import request from '@/utils/request'

export function findTreeMenus(data) {
  return request({
    url: '/wash/findTreeMenus',
    method: 'post',
    data
  })
}

export function findUserRolePermission(data) {
  return request({
    url: '/wash/findUserRolePermission',
    method: 'post',
    data
  })
}

export function findRoleList(data) {
  return request({
    url: '/wash/findRoleList',
    method: 'post',
    data
  })
}

export function saveBmRolePermission(data) {
  return request({
    url: '/wash/saveBmRolePermission',
    method: 'post',
    data
  })
}

export function saveBmRole(data) {
  return request({
    url: '/wash/saveBmRole',
    method: 'post',
    data
  })
}