const initialState = {
    userLogged: null,
}

const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case 'LOG_USER':
            console.log(action.payload)
            localStorage.setItem('userLogged', JSON.stringify({ firstName: action.payload.response.firstName, userPic: action.payload.response.img }))
            localStorage.setItem('token', action.payload.token)
            return { ...state, userLogged: action.payload }

        case 'LOGOUT_USER':
            localStorage.clear()
            return { ...state, userLogged: null }

        default:
            return state
    }
}

export default authReducer

