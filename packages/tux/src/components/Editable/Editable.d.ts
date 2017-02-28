/// <reference types="react" />
import React from 'react';
export interface EditableProps {
    model: any;
    field: string | Array<string>;
    onChange: Function;
    children: any;
    className: string;
}
declare class Editable extends React.Component<EditableProps, any> {
    static contextTypes: {
        tux: React.Requireable<any>;
    };
    render(): JSX.Element;
}
export default Editable;
