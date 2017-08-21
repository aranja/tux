declare module 'slate' {
  import React, {
    Component,
    ComponentType,
    ReactNode,
    ReactElement,
    CSSProperties,
  } from 'react'
  import { List, Set, Map } from 'immutable'

  export = Slate
  type NativeNode = Node

  namespace Slate {
    // Completion 50%
    interface EditorProps {
      // Properties
      className?: string
      onChange?(state: State): void
      onDocumentChange?(document: Document, state: State): void
      onSelectionChange?(selection: Selection, state: State): void
      plugins?: Plugin[]
      readOnly?: boolean
      state?: State
      style?: CSSProperties
      tabIndex?: number
      role?: string

      // Placeholder Properties
      placeholder?: ReactNode
      placeholderClassName?: string
      placeholderStyle?: Object

      // Plugin-like Properties Properties
      onBeforeInput?: BeforeInputHandler
      onBlur?: BlurHandler
      onFocus?: FocusHandler
      onCopy?: CopyHandler
      onCut?: CutHandler
      onDrop?: DropHandler
      onKeyDown?: KeyDownHandler
      onPaste?: PasteHandler
      onSelect?: SelectHandler
      schema?: Schema
    }

    // Completion 100%
    interface Plugin {
      // Event Handler Properties
      onBeforeInput?: BeforeInputHandler
      onBlur?: BlurHandler
      onFocus?: FocusHandler
      onCopy?: CopyHandler
      onCut?: CutHandler
      onDrop?: DropHandler
      onKeyDown?: KeyDownHandler
      onPaste?: PasteHandler
      onSelect?: SelectHandler

      // Other Properties
      onChange?(state: State): State | void
      onBeforeChange?(state: State): State | void
      render?(
        props: Object,
        state: State,
        editor: Editor
      ): ReactElement<any> | void
      schema?: Schema
    }

    class Editor extends Component<EditorProps, any> {
      // Methods
      blur(): void
      focus(): void
      getSchema(): Schema
      getState(): State
      onChange(state: State): void
    }

    // Completion: 100%
    interface State {
      // Properties
      document: Document
      selection: Selection

      // Computed Properties
      anchorText: Text
      focusText: Text
      startText: Text
      endText: Text
      anchorBlock: Block
      focusBlock: Block
      startBlock: Block
      endBlock: Block
      marks: Set<Mark>
      blocks: List<Block>
      fragment: Document
      inlines: List<Inline>
      texts: List<Text>
      hasUndos: boolean
      hasRedos: boolean

      // Selection-like Properties
      anchorKey: string
      focusKey: string
      startKey: string
      endKey: string
      anchorOffset: number
      focusOffset: number
      startOffset: number
      endOffset: number
      isBackward: boolean
      isBlurred: boolean
      isCollapsed: boolean
      isExpanded: boolean
      isFocused: boolean
      isForward: boolean
      isEmpty: boolean

      // Methods
      transform(): Transform
    }

    // Completion: 40%
    interface Transform {
      // Methods
      apply(options?: { save: boolean }): State
      call(
        customTransform: (transform: Transform) => void,
        ...args: any[]
      ): Transform

      // Current State Transforms
      deleteBackward(n: number): Transform
      deleteForward(n: number): Transform
      delete(): Transform
      insertBlock(block: Block | Object | string): Transform
      insertFragment(fragment: Document): Transform
      insertInline(inline: Inline | Object): Transform
      insertText(text: string): Transform
      addMark(mark: Mark | Object | string): Transform
      setBlock(block: Object | string): Transform
      setInline(inline: Object | string): Transform
      splitBlock(depth: number): Transform
      splitInline(depth: number): Transform
      removeMark(mark: Mark | Object | string): Transform
      toggleMark(mark: Mark | Object | string): Transform
      unwrapBlock(block: string | Data): Transform
      unwrapInline(inline: string | Data): Transform
      wrapBlock(type: string, data?: Data): Transform
      wrapInline(type: string, data?: Data): Transform
      wrapText(prefix: string, suffix?: string): Transform
    }

    // Completion 40%
    class Node {
      // Properties
      key: string
      nodes: List<Node>
      data: Data

      // Computer Properties
      kind: string
      length: number
      text: string

      // Methods
      getClosest(
        key: string | Node,
        match: (node: Node) => boolean
      ): Node | void
    }

    // Completion 100%
    class Block extends Node {
      // Properties
      kind: 'block'
      type: string
      key: string
      nodes: List<Node>
      isVoid: boolean

      // Static Methods
      static create(properties: Object): Block
      static createList(blocks: Object[]): List<Block>
      static isBlock(maybeBlock: any): maybeBlock is Block
    }

    interface Inline extends Node {
      kind: 'inline'
      type: string
      isVoid: boolean
    }

    interface Document extends Node {}

    interface Selection {}

    // Completion 100%
    class Character {
      // Properties
      marks: Set<Mark>
      text: string

      // Static Methods
      static create(properties: Object): Character
      static createList(characters: Object[]): List<Character>
      static isCharacter(maybeCharacter: any): maybeCharacter is Character
    }

    // Completion 100%
    class Mark {
      kind: 'mark'
      type: string
      data: Data

      // Static Methods
      static create(properties: Object): Mark
      static createSet(marks: Object[]): Set<Mark>
      static isMark(maybeMark: any): maybeMark is Mark
    }

    interface Data extends Map<string, any> {}

    interface String {
      kind: 'string'
      text: string
    }

    namespace Html {
      interface Rule {
        deserialize?(
          el: HTMLElement,
          next: (el?: NativeNode | NativeNode[] | NodeList) => void
        ): void
        serialize?(object: Node | Mark | String, children: ReactNode): void
      }
    }

    namespace Raw {
      function deserialize(
        object: Object,
        options?: {
          terse?: boolean
          normalize?: boolean
        }
      ): State

      function serialize(
        state: State,
        options?: {
          terse?: boolean
          preserveKeys?: boolean
          preserveSelection?: boolean
          preserveStateData?: boolean
        }
      ): Object
    }

    namespace Plain {
      function deserialize(str: string): State
      function deserialize(str: string, options: { toRaw: false }): State
      function deserialize(str: string, options: { toRaw: true }): Object
      function deserialize(
        str: string,
        options?: { toRaw?: boolean }
      ): State | Object

      function serialize(state: State): string
    }

    class Html {
      constructor(options?: {
        rules?: Html.Rule[]
        defaultBlockType?: string | { type: string }
        parseHtml?(html: string): any
      })

      deserialize(
        html: string,
        options?: {
          toRaw?: boolean
        }
      ): State

      serialize(state: State): string
      serialize(state: State, options: { render: true }): string
      serialize(state: State, options: { render: false }): ReactNode
      serialize(
        state: State,
        options?: {
          render?: boolean
        }
      ): string | ReactNode
    }

    interface TextPaste {
      type: 'text'
      text: string
      isShift: boolean
    }

    interface HtmlPaste {
      type: 'html'
      text: string
      html: string
      isShift: boolean
    }

    interface FilePaste {
      type: 'files'
      files: FileList
      isShift: boolean
    }

    type PasteData = TextPaste | HtmlPaste | FilePaste

    interface TextDrop {
      type: 'text'
      target: Selection
      text: string
    }

    interface HtmlDrop {
      type: 'html'
      target: Selection
      text: string
      html: string
    }

    interface FileDrop {
      type: 'files'
      target: Selection
      files: FileList
    }

    type DropData = TextDrop | HtmlDrop | FileDrop

    interface KeyboardData {
      key: string
      code: number
      isAlt: boolean
      isCmd: boolean
      isCtrl: boolean
      isLine: boolean
      isMeta: boolean
      isMod: boolean
      isModAlt: boolean
      isShift: boolean
      isWord: boolean
    }

    interface CopyData {
      type: 'fragment'
      fragment: Document
    }

    interface SelectData {
      selection: Selection
      isNative: boolean
    }

    type Handler<Event, Data> = (
      event: Event,
      data: Data,
      state: State,
      editor: Editor
    ) => State | void
    type BeforeInputHandler = Handler<React.SyntheticEvent<any>, {}>
    type BlurHandler = Handler<React.FocusEvent<any>, {}>
    type FocusHandler = Handler<React.FocusEvent<any>, {}>
    type CopyHandler = Handler<React.ClipboardEvent<any>, CopyData>
    type CutHandler = Handler<React.ClipboardEvent<any>, CopyData>
    type DropHandler = Handler<React.DragEvent<any>, DropData>
    type KeyDownHandler = Handler<React.KeyboardEvent<any>, KeyboardData>
    type PasteHandler = Handler<React.ClipboardEvent<any>, PasteData>
    type SelectHandler = Handler<React.SyntheticEvent<any>, SelectData>

    interface NodeProps {
      attributes: Object
      editor: Editor
      parent: Node
      node: Node
      readOnly: boolean
      state: State
    }

    interface Rule<Failure = any> {
      match?(object: Node | Mark): boolean
      decorate?(text: Text, object: Node): List<Character>
      normalize?(
        transform: Transform,
        object: Node,
        failure: Failure
      ): Transform
      render?: ComponentType<NodeProps> | Object | string
      validate?(object: Node): Failure | void
    }

    interface Schema {
      nodes?: {
        [type: string]: ComponentType<NodeProps> | Rule
      }

      marks?: {
        [type: string]: ComponentType<NodeProps> | Object | string
      }

      rules?: Rule[]
    }

    namespace Schema {
      function isSchema(maybeSchema: any): maybeSchema is Schema
    }
  }
}
