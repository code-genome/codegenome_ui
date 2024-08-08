import { 
    SET_UPLOAD_ERROR, CLEAR_UPLOAD_ERROR, SET_UPLOAD_STATUS, SET_UPLOAD_JOBID, SET_UPLOAD_SHA256,
    SET_UPLOAD_ERROR2, CLEAR_UPLOAD_ERROR2, SET_UPLOAD_STATUS2, SET_UPLOAD_JOBID2, SET_UPLOAD_SHA2562
} from '../actions/upload.actions';

export const initialState = {
    error: '',
    errorCode: 200,
    jobid: '',
    sha256: '',
    status: '',
    error2: '',
    errorCode2: 200,
    jobid2: '',
    sha2562: '',
    status2: '',

}

const UploadReducer = (state = initialState, action) => {
        switch (action.type) {
        case CLEAR_UPLOAD_ERROR:
            return {
                ...state,
                status: '',
                error: '',
                errorCode: 200
            }
        case CLEAR_UPLOAD_ERROR2:
            return {
                ...state,
                status2: '',
                error2: '',
                errorCode2: 200
            }
        case SET_UPLOAD_ERROR: 
          return {
            ...state,
            error: action.data.message,
            errorCode: action.data.response ? action.data.response.status : action.data.code === 'ERR_NETWORK' ? 403 : 500
          }
        case SET_UPLOAD_ERROR2: 
          return {
            ...state,
            error2: action.data.message,
            errorCode2: action.data.response ? action.data.response.status : action.data.code === 'ERR_NETWORK' ? 403 : 500
          }
        case SET_UPLOAD_JOBID:
            return {
                ...state,
                jobid: action.data
            }
        case SET_UPLOAD_JOBID2:
            return {
                ...state,
                jobid2: action.data
            }
    
        case SET_UPLOAD_SHA256: 
            return {
                ...state,
                sha256: action.data
            }
        case SET_UPLOAD_SHA2562: 
            return {
                ...state,
                sha2562: action.data
            }
        case SET_UPLOAD_STATUS:
            return {
                ...state,
                status: action.data
            }
        case SET_UPLOAD_STATUS2:
            return {
                ...state,
                status2: action.data
            }
    
       default:
        return state;
    }
}

export default UploadReducer;