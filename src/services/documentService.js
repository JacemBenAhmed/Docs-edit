const API_BASE = import.meta.env.VITE_API_BASE

class DocumentService {

  async getAllDocuments() {
    const res = await fetch(`${API_BASE}/Document`, { method: 'GET' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    
    const data = await res.json()
    console.log('Fetched documents:', data)
    return data
  }

}

export default new DocumentService()

