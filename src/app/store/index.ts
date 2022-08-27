import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { dashboardReducer } from './dashboard.reducer';
import { userDataReducer } from './user-data.reducer';

export interface UserData {
    username: string;
    password: string | null;
    school: string;
    serverUrl: string;
}
export interface SubjectData {
    subjectId: string;
    presence: number;
    lessonsTotal: number;
    lessonsCancelled: number;
    lessonsMissed: number;
}

export type UserDataState = UserData | null;

export interface DashboardState {
    subjects: SubjectData[] | null;
}

export interface AppState {
    userData: UserDataState;
    dashboard: DashboardState;
}

export const reducers: ActionReducerMap<AppState> = {
    userData: userDataReducer,
    dashboard: dashboardReducer,
};

const debug = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => {
    return (state, action) => {
        console.log('action', action);
        return reducer(state, action);
    };
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
    ? [debug]
    : [];