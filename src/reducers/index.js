import { combineReducers } from 'redux'
import * as actionTypes from '../action/Types';

const initialGroupsState = {
    allGroups: null,

}

const groups_reducer = (state = initialGroupsState, action) => {
    switch (action.type){
        case actionTypes.GET_GROUPS:
            return {
                allGroups: action.payload.allGroups
            }
        default:
            return state;

    }

}


const initialUserState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = (state = initialUserState, action) => {
    switch (action.type){
        case actionTypes.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false
            }
        case actionTypes.CLEAR_USER:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;

    }

}



const rootReducer = combineReducers({
    groups: groups_reducer,
    user: user_reducer,

})

export default rootReducer;