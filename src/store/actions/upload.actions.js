export const SET_UPLOAD_ERROR ='SET_UPLOAD_ERROR';
export const SET_UPLOAD_STATUS = 'SET_UPLOAD_STATUS';
export const CLEAR_UPLOAD_ERROR = 'CLEAR_UPLOAD_ERROR';
export const SET_UPLOAD_JOBID = 'SET_UPLOAD_JOBID';
export const SET_UPLOAD_SHA256 = 'SET_UPLOAD_SHA256';
export const SET_UPLOAD_ERROR2 ='SET_UPLOAD_ERROR2';
export const SET_UPLOAD_STATUS2 = 'SET_UPLOAD_STATUS2';
export const CLEAR_UPLOAD_ERROR2 = 'CLEAR_UPLOAD_ERROR2';
export const SET_UPLOAD_JOBID2 = 'SET_UPLOAD_JOBID2';
export const SET_UPLOAD_SHA2562 = 'SET_UPLOAD_SHA2562';



export function setUploadError(data) {
    return { type: SET_UPLOAD_ERROR, data};
}

export function clearUploadError() {
    return { type:CLEAR_UPLOAD_ERROR };
}

export function setUploadStatus(data) {
    return { type: SET_UPLOAD_STATUS , data};
}

export function setUploadJobID(data) {
    return { type: SET_UPLOAD_JOBID, data};
}

export function setUploadSha256(data) {
    return { type: SET_UPLOAD_SHA256, data};
}

export function setUploadError2(data) {
    return { type: SET_UPLOAD_ERROR2, data};
}

export function clearUploadError2() {
    return { type:CLEAR_UPLOAD_ERROR2 };
}

export function setUploadStatus2(data) {
    return { type: SET_UPLOAD_STATUS2 , data};
}

export function setUploadJobID2(data) {
    return { type: SET_UPLOAD_JOBID2, data};
}

export function setUploadSha2562(data) {
    return { type: SET_UPLOAD_SHA2562, data};
}