import {
    FUNCTION_COMPARE_SET_LEFT_LOADING,
    FUNCTION_COMPARE_SET_RIGHT_LOADING,
    FUNCTION_COMPARE_SET_LEFT_FAILED,
    FUNCTION_COMPARE_SET_RIGHT_FAILED,
    FUNCTION_COMPARE_SET_LEFT_START_TS,
    FUNCTION_COMPARE_SET_RIGHT_START_TS,
    FUNCTION_COMPARE_SET_LEFT_END_TS,
    FUNCTION_COMPARE_SET_RIGHT_END_TS,
    FUNCTION_COMPARE_CLEAR_LEFT_FAILED,
    FUNCTION_COMPARE_CLEAR_RIGHT_FAILED,
    FUNCTION_COMPARE_SET_LEFT_LLVMIR,
    FUNCTION_COMPARE_SET_RIGHT_LLVMIR
} from '@/store/actions/functionCompare.actions';

export const initialState = {
    leftFunctionLoading: false,
    leftFunctionFailed: false,
    leftFunctionError: {
        message: ''
    },
    left_start_ts: -1,
    left_end_ts: -1,
    left_error_ts: -1,
    leftHash: '',
    left_llvm_ir: {},

    rightFunctionLoading: false,
    rightFunctionFailed: false,
    rightFunctionError: {
        message: ''
    },
    right_start_ts: -1,
    right_end_ts: -1,
    right_error_ts: -1,
    rightHash: '',
    right_llvm_ir: {},
}

const loadState = (iState = initialState) => {
    return { ...iState}   
}

const persistedState = loadState(initialState);

const compareFunctionReducer = (iState = persistedState, action) => {
    switch (action.type) {
        case FUNCTION_COMPARE_SET_LEFT_LOADING: {
            return {
                ...iState,
                leftFunctionLoading: action.data
            }
        }
        case FUNCTION_COMPARE_SET_RIGHT_LOADING: {
            return {
                ...iState,
                rightFunctionLoading: action.data
            }
        }
        case FUNCTION_COMPARE_SET_LEFT_FAILED: {
            return {
                ...iState,
                leftFunctionLoading: false,
                leftFunctionFailed: true,
                leftFunctionError: action.data,
                left_error_ts: new Date().getTime()
            }
        }
        case FUNCTION_COMPARE_SET_RIGHT_FAILED: {
            return {
                ...iState,
                rightFunctionLoading: false,
                rightFunctionFailed: true,
                rightFunctionError: action.data,
                right_error_ts: new Date().getTime()
            }
        }
        case FUNCTION_COMPARE_CLEAR_LEFT_FAILED: {
            return {
                ...iState,
                leftFunctionLoading: false,
                leftFunctionFailed: false,
                leftFunctionError: { message: ''},
                left_error_ts: -1,
                left_start_ts: -1,
                left_end_ts: -1
            }
        }

        case FUNCTION_COMPARE_CLEAR_RIGHT_FAILED: {
            return {
                ...iState,
                rightFunctionLoading: false,
                rightFunctionFailed: false,
                rightFunctionError: { message: ''},
                right_error_ts: -1,
                right_start_ts: -1,
                right_end_ts: -1
            }
        }

        case FUNCTION_COMPARE_SET_LEFT_START_TS: {
            return {
                ...iState,
                left_start_ts: action.data,
                left_end_ts: -1,
                left_error_ts: -1
            }
        }
        case FUNCTION_COMPARE_SET_RIGHT_START_TS: {
            return {
                ...iState,
                right_start_ts: action.data,
                right_end_ts: -1,
                right_error_ts: -1
            }
        }
        case FUNCTION_COMPARE_SET_LEFT_END_TS: {
            return {
                ...iState,
                left_end_ts: action.data
            }
        }
        case FUNCTION_COMPARE_SET_RIGHT_END_TS: {
            return {
                ...iState,
                right_end_ts: action.data
            }
        }
        case FUNCTION_COMPARE_SET_LEFT_LLVMIR: {
            return {
                ...iState,
                left_llvm_ir: action.data
            }
        }
        case FUNCTION_COMPARE_SET_RIGHT_LLVMIR: {
            return {
                ...iState,
                right_llvm_ir: action.data
            }
        }
        default: {
            return { ...iState }
        }
    }
}

export default compareFunctionReducer;