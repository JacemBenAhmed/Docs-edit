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

  renderHTML({ node, HTMLAttributes }) {
    const rows = node.attrs.rows
    const cols = node.attrs.cols
    const cellData = node.attrs.cellData || []
    
    const tableRows = []
    
    for (let i = 0; i < rows; i++) {
      const cells = []
      for (let j = 0; j < cols; j++) {
        const cellContent = cellData[i] && cellData[i][j] ? cellData[i][j] : ''
        cells.push([
          'div',
          {
            style: `flex: 1; padding: 10px; min-width: 120px; min-height: 40px; border-right: ${j < cols - 1 ? '1px solid #000000' : 'none'}; box-sizing: border-box;`
          },
          cellContent
        ])
      }
      
      tableRows.push([
        'div',
        {
          style: `display: flex; border-bottom: ${i < rows - 1 ? '1px solid #000000' : 'none'};`
        },
        ...cells
      ])
    }
    
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'custom-table',
        style: 'border: 2px solid #000000; width: calc(100% - 40px); margin: 16px 20px; padding: 0; background: #ffffff;',
        'data-rows': rows,
        'data-cols': cols
      }),
      ...tableRows
    ]
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
      },
      cellData: {
        default: null,
        parseHTML: element => {
          const data = element.getAttribute('data-cell-content')
          return data ? JSON.parse(data) : null
        },
        renderHTML: attributes => {
          if (attributes.cellData) {
            return {
              'data-cell-content': JSON.stringify(attributes.cellData)
            }
          }
          return {}
        }
      }
    }
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'position: relative; margin: 16px 20px; padding: 0 20px;'
      
      const dom = document.createElement('div')
      dom.className = 'custom-table'
      dom.style.cssText = 'border: 2px solid #000000; width: calc(100% - 40px); background: #ffffff; user-select: text;'
      
      const rows = node.attrs.rows
      const cols = node.attrs.cols
      const cellData = node.attrs.cellData || Array.from({ length: rows }, () => Array(cols).fill(''))
      
      const cellElements = []
      
      const updateCellData = () => {
        const newCellData = []
        for (let i = 0; i < rows; i++) {
          newCellData[i] = []
          for (let j = 0; j < cols; j++) {
            const cellElement = cellElements[i][j]
            newCellData[i][j] = cellElement.textContent || ''
          }
        }
        
        if (typeof getPos === 'function') {
          const pos = getPos()
          editor.commands.updateAttributes('tableHTML', { cellData: newCellData })
        }
      }
      
      for (let i = 0; i < rows; i++) {
        cellElements[i] = []
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
          
          cell.textContent = cellData[i] && cellData[i][j] ? cellData[i][j] : ''
          
          cellElements[i][j] = cell
          
          cell.addEventListener('focus', function(e) {
            this.style.backgroundColor = '#f0f6ff'
            e.stopPropagation()
          })
          
          cell.addEventListener('blur', function() {
            this.style.backgroundColor = '#ffffff'
            updateCellData()
          })
          
          cell.addEventListener('mousedown', function(e) {
            e.stopPropagation()
          })
          
          cell.addEventListener('keydown', function(e) {
            e.stopPropagation()
          })
          
          cell.addEventListener('input', function() {
            clearTimeout(cell.updateTimeout)
            cell.updateTimeout = setTimeout(() => {
              updateCellData()
            }, 500)
          })
          
          row.appendChild(cell)
        }
        
        dom.appendChild(row)
      }
      
      dom.addEventListener('contextmenu', function(e) {
        e.preventDefault()
        
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
