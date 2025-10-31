import { Node, mergeAttributes } from '@tiptap/core'

export const TableHTML = Node.create({
  name: 'tableHTML',

  group: 'block',

  atom: true,
  
  selectable: true,
  
  draggable: false,

  parseHTML() {
    return [
      {
        tag: 'div.custom-table',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'custom-table' })]
  },

  addAttributes() {
    return {
      rows: {
        default: 3,
        parseHTML: element => parseInt(element.getAttribute('data-rows')) || 3,
        renderHTML: attributes => {
          return {
            'data-rows': attributes.rows
          }
        }
      },
      cols: {
        default: 3,
        parseHTML: element => parseInt(element.getAttribute('data-cols')) || 3,
        renderHTML: attributes => {
          return {
            'data-cols': attributes.cols
          }
        }
      }
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'position: relative; margin: 16px 0;'
      
      const dom = document.createElement('div')
      dom.className = 'custom-table'
      dom.style.cssText = 'border: 2px solid #000000; width: 100%; background: #ffffff; user-select: text;'
      
      const rows = node.attrs.rows
      const cols = node.attrs.cols
      
      // Create table structure
      for (let i = 0; i < rows; i++) {
        const row = document.createElement('div')
        row.style.cssText = 'display: flex;'
        if (i < rows - 1) {
          row.style.borderBottom = '1px solid #000000'
        }
        
        for (let j = 0; j < cols; j++) {
          const cell = document.createElement('div')
          cell.className = 'table-cell'
          cell.style.cssText = `flex: 1; padding: 10px; min-width: 120px; min-height: 40px; cursor: text; outline: none; box-sizing: border-box;`
          
          if (j < cols - 1) {
            cell.style.borderRight = '1px solid #000000'
          }
          
          cell.contentEditable = 'true'
          cell.spellcheck = false
          
          // Prevent editor selection when typing in cells
          cell.addEventListener('focus', function(e) {
            this.style.backgroundColor = '#f0f6ff'
            e.stopPropagation()
          })
          
          cell.addEventListener('blur', function() {
            this.style.backgroundColor = '#ffffff'
          })
          
          // Prevent table deletion when clicking cells
          cell.addEventListener('mousedown', function(e) {
            e.stopPropagation()
          })
          
          // Prevent keydown from propagating to editor
          cell.addEventListener('keydown', function(e) {
            e.stopPropagation()
          })
          
          row.appendChild(cell)
        }
        
        dom.appendChild(row)
      }
      
      // Context menu functionality
      dom.addEventListener('contextmenu', function(e) {
        e.preventDefault()
        
        // Remove any existing context menus
        document.querySelectorAll('.table-context-menu').forEach(menu => menu.remove())
        
        const menu = document.createElement('div')
        menu.className = 'table-context-menu'
        menu.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          background: #ffffff;
          border: 1px solid #dadce0;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          z-index: 10003;
          padding: 6px 0;
          min-width: 160px;
        `
        
        const deleteOption = document.createElement('div')
        deleteOption.className = 'context-menu-item'
        deleteOption.innerHTML = '🗑️ Delete Table'
        deleteOption.style.cssText = `
          padding: 10px 16px;
          cursor: pointer;
          font-size: 14px;
          color: #d32f2f;
          font-weight: 500;
        `
        
        deleteOption.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f1f3f4'
        })
        
        deleteOption.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'transparent'
        })
        
        deleteOption.addEventListener('click', function() {
          if (typeof getPos === 'function') {
            const pos = getPos()
            editor.commands.deleteRange({ from: pos, to: pos + node.nodeSize })
          }
          menu.remove()
        })
        
        menu.appendChild(deleteOption)
        document.body.appendChild(menu)
        
        // Close menu on outside click
        setTimeout(() => {
          document.addEventListener('click', function closeMenu() {
            menu.remove()
            document.removeEventListener('click', closeMenu)
          })
        }, 0)
      })
      
      wrapper.appendChild(dom)
      
      return {
        dom: wrapper,
        contentDOM: null,
        ignoreMutation: () => true,
        stopEvent: (event) => {
          // Allow events inside cells to work normally
          const target = event.target
          return target.classList.contains('table-cell') || target.closest('.table-cell')
        },
      }
    }
  },
  
  addKeyboardShortcuts() {
    return {
      'Backspace': ({ editor }) => {
        // Only delete table if it's selected, not when editing cells
        const { selection } = editor.state
        const { $from } = selection
        const node = $from.node()
        
        if (node.type.name === this.name && selection.empty) {
          return editor.commands.deleteNode(this.name)
        }
        
        return false
      },
      'Delete': ({ editor }) => {
        // Only delete table if it's selected, not when editing cells
        const { selection } = editor.state
        const { $from } = selection
        const node = $from.node()
        
        if (node.type.name === this.name && selection.empty) {
          return editor.commands.deleteNode(this.name)
        }
        
        return false
      },
    }
  },
})

export default TableHTML
