/// <reference types="react" />
import React from 'react';
export interface EditableModalProps {
    model: any;
    children?: any;
    onChange: Function;
    className: string;
}
declare class EditableModal extends React.Component<EditableModalProps, any> {
    static contextTypes: {
        tux: React.Requireable<any>;
    };
    onEdit(): Promise<void>;
    render(): JSX.Element;
}
export default EditableModal;
