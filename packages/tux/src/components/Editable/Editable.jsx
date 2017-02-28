import React from 'react';
import EditableInline from './EditableInline';
import EditableModal from './EditableModal';
class Editable extends React.Component {
    render() {
        const { children, field, model, onChange, className } = this.props;
        const isEditing = this.context.tux && this.context.tux.isEditing;
        if (field) {
            return <EditableInline model={model} field={field}/>;
        }
        return (<EditableModal className={className} model={model} onChange={onChange}>
        {children}
      </EditableModal>);
    }
}
Editable.contextTypes = {
    tux: React.PropTypes.object,
};
export default Editable;
//# sourceMappingURL=Editable.jsx.map