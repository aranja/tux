/// <reference types="react" />
import React, { Component } from 'react';
export interface TuxProviderProps {
    adapter: Object;
}
declare class TuxProvider extends Component<TuxProviderProps, any> {
    static childContextTypes: {
        tux: React.Requireable<any>;
    };
    state: {
        isEditing: boolean;
        overlayIsActive: boolean;
    };
    getChildContext(): {
        tux: {
            isEditing: boolean;
            editModel: (model: any) => Promise<void>;
            adapter: Object;
        };
    };
    editModel: (model: any) => Promise<void>;
    onClickEdit: () => void;
    render(): JSX.Element;
}
export default TuxProvider;
