import storage from 'good-storage'

function insertArray(items, item, compare, maxLen) {
  const index = items.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    items.splice(index, 1)
  }
  items.unshift(item)
  if (maxLen && items.length > maxLen) {
    items.pop()
  }
}

function deleteFromArray(items, compare) {
  const index = items.findIndex(compare)
  if (index > -1) {
    // remove 
    items.splice(index, 1)
  }
}

export function save(item, key, compare, maxLen) {
  /* 如果没有存储过则返回空数组 */
  const items = storage.get(key, [])
  insertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}
