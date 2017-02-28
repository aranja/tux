/// <reference types="react" />
import React from 'react';
export interface State {
    user: null | {
        name: string;
        avatarUrl: string;
        spaceName: string;
    };
}
declare class TuxSidebar extends React.Component<any, State> {
    static contextTypes: {
        tux: React.Requireable<any>;
    };
    state: State;
    componentDidMount(): Promise<void>;
    login: () => void;
    render(): JSX.Element;
}
export default TuxSidebar;
