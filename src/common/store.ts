/**
  * ## This code is part of the Code Genome Framework.
  * ##
  * ## (C) Copyright IBM 2022-2023.
  * ## This code is licensed under the Apache License, Version 2.0. You may
  * ## obtain a copy of this license in the LICENSE.txt file in the root directory
  * ## of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
  * ##
  * ## Any modifications or derivative works of this code must retain this
  * ## copyright notice, and modified files need to carry a notice indicating
  * ## that they have been altered from the originals.
  * ##
  */
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import historyReducer from '@/store/reducers/historyReducer';
import searchReducer from '@/store/reducers/searchReducer';
import UploadReducer from '@/store/reducers/uploadReducer';
import CompareReducer from '@/store/reducers/compareReducer';
import FunctionCompareReducer from '@/store/reducers/compareFunctionReducer';
export const store = configureStore({
  reducer: {
    compare: CompareReducer,
    functionCompare: FunctionCompareReducer,
    history: historyReducer,
    search: searchReducer,
    upload: UploadReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
