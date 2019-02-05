import * as actionTypes  from './Types';

export const setUser = user => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            currentUser: user
        }
    }
}


export const clearUser = user => {
    return {
        type: actionTypes.CLEAR_USER,

    }
}

export const getGroups = groups => {
    return {
        type: actionTypes.GET_GROUPS,
        payload: {
            allGroups: groups
        }
    }
}


export const setCompany = company => {
    return {
        type: actionTypes.SET_COMPANY,
        payload: {
            company: company
        }
    }
}
