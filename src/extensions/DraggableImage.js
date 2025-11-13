import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const DraggableImage = Image.extend({
  name: 'draggableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.style.width || element.getAttribute('width'),
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { style: `width: ${attributes.width}` }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.style.height || element.getAttribute('height'),
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { style: `height: ${attributes.height}` }
        },
      },
      draggable: {
        default: true,
        parseHTML: element => element.getAttribute('draggable'),
        renderHTML: attributes => {
          return { draggable: attributes.draggable }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: 'editor-image draggable-image',
      draggable: 'true',
    })]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageResize'),
        props: {
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target
              
              if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
                const pos = view.posAtDOM(target, 0)
                const { tr } = view.state
                const resolvedPos = tr.doc.resolve(pos)
                
                const selection = view.state.selection
                tr.setSelection(view.state.selection.constructor.create(
                  view.state.doc,
                  resolvedPos.pos
                ))
                view.dispatch(tr)
                
                return false
              }
            },
            
            dragstart(view, event) {
              const target = event.target
              
              if (target.tagName === 'IMG' && target.classList.contains('editor-image')) {
                const pos = view.posAtDOM(target, 0)
                const node = view.state.doc.nodeAt(pos)
                
                if (node) {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/html', target.outerHTML)
                  
                  const imageData = {
                    src: node.attrs.src,
                    alt: node.attrs.alt,
                    title: node.attrs.title,
                    width: node.attrs.width,
                    height: node.attrs.height,
                  }
                  event.dataTransfer.setData('application/json', JSON.stringify(imageData))
                }
              }
            },
            
            dragover(view, event) {
              event.preventDefault()
              return false
            },
            
            drop(view, event) {
              const imageData = event.dataTransfer.getData('application/json')
              
              if (imageData) {
                event.preventDefault()
                
                const coords = { left: event.clientX, top: event.clientY }
                const pos = view.posAtCoords(coords)
                
                if (pos) {
                  const data = JSON.parse(imageData)
                  const { tr } = view.state
                  
                  const node = view.state.schema.nodes.draggableImage.create(data)
                  tr.insert(pos.pos, node)
                  view.dispatch(tr)
                  
                  return true
                }
              }
              
              return false
            },
          },
        },
      }),
    ]
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setImageSize: (options) => ({ commands }) => {
        return commands.updateAttributes(this.name, options)
      },
    }
  },
})

export default DraggableImage
