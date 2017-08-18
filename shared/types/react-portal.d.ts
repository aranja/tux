// Delete after PR is merged:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/19041

declare module 'react-portal' {
  interface CallBackProps extends React.Props<any> {
    closePortal(): void
  }

  interface ReactPortalProps {
    isOpened?: boolean
    openByClickOn?: React.ReactElement<CallBackProps>
    closeOnEsc?: boolean
    closeOnOutsideClick?: boolean
    onOpen?(node: HTMLDivElement): void
    beforeClose?(node: HTMLDivElement, resetPortalState: () => void): void
    onClose?(): void
    onUpdate?(): void
  }

  const ReactPortal: React.ComponentClass<ReactPortalProps>
  export = ReactPortal
}
