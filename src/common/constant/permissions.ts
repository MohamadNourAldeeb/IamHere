let permissions_db = [

    { mode: 'language', description: 'create language' },
    { mode: 'language', description: 'update language' },
    { mode: 'language', description: 'change state language' },
    { mode: 'language', description: 'delete language' },
    { mode: 'language', description: 'getAll language' },

    { mode: 'user', description: 'create user' },
    { mode: 'user', description: 'update user' },
    { mode: 'user', description: 'delete user' },
    { mode: 'user', description: 'getAll user' },

    { mode: 'gallery', description: 'upload gallery' },
    { mode: 'gallery', description: 'delete gallery' },
    { mode: 'gallery', description: 'getAll gallery' },
]

let permissions = {
  
    language: {
        create: { value: 27, name: 'create language' },
        update: { value: 28, name: 'update language ' },
        change_state: { value: 29, name: 'change state language' },
        delete: { value: 30, name: 'delete language' },
        getAll: { value: 31, name: 'getAll language' },
    },
    user: {
        create: { value: 32, name: 'create user' },
        update: { value: 33, name: 'update user ' },
        delete: { value: 34, name: 'delete user' },
        getAll: { value: 35, name: 'getAll user' },
    },
    gallery: {
        upload: { value: 36, name: 'upload gallery' },
        delete: { value: 37, name: 'delete gallery' },
        getAll: { value: 38, name: 'getAll gallery' },
    },
}

let admin_permissions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
]
let user_permissions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 18, 19, 20, 25, 26, 28,
    36, 37, 38,
]

export {
    permissions,
    permissions_db,
    admin_permissions,
    user_permissions,
}
