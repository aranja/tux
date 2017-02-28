/// <reference types="react" />
import React from 'react';
export interface State {
    fullModel: any | null;
    typeMeta: any | null;
}
declare class TuxModal extends React.Component<any, State> {
    static contextTypes: {
        tux: React.Requireable<any>;
    };
    state: State;
    componentDidMount(): Promise<void>;
    onChange(event: React.ChangeEvent<any>, type: {
        id: string;
    }): void;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent<any>) => Promise<void>;
    renderField: (type: any) => JSX.Element | null;
    render(): JSX.Element;
}
export default TuxModal;
