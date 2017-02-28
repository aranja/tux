var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import classNames from 'classnames';
class EditableModal extends React.Component {
    onEdit() {
        return __awaiter(this, void 0, void 0, function* () {
            const { onChange, model } = this.props;
            const { tux } = this.context;
            const isEditing = tux && tux.isEditing;
            const didChange = yield tux.editModel(model);
            if (isEditing && didChange && onChange) {
                onChange();
            }
        });
    }
    render() {
        const { model, children, tagName, className } = this.props;
        const isEditing = this.context.tux && this.context.tux.isEditing;
        // const RootComponent = tagName || 'div'
        return (<div className={classNames(className, 'EditableModal', isEditing && 'is-editing')} onClick={() => this.onEdit()}>
        {children}
        <style jsx>{`
          .EditableModal.is-editing {
            cursor: pointer;
          }
          .EditableModal.is-editing, .EditableModal.is-editing > * {
            outline: 1px solid aquamarine !important;
          }
        `}</style>
      </div>);
    }
}
EditableModal.contextTypes = {
    tux: React.PropTypes.object,
};
export default EditableModal;
//# sourceMappingURL=EditableModal.jsx.map