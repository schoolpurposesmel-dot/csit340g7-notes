import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import NoteCard from './NoteCard.jsx'

const API_URL = import.meta.env.VITE_API_URL

function Notes() {

const [notes, setNotes] = useState([])

const [note, setNote] = useState(() => {
  const saved = localStorage.getItem('draft')
  return saved ? JSON.parse(saved) : { title: '', body: '' }
})

const [search, setSearch] = useState('')

const titleRef = useRef(null)

useEffect(() => {
    async function loadNotes() {
      const res = await fetch(API_URL + '/notes')
      const data = await res.json()
     setNotes(data)
    }

    loadNotes()
  }, [])


  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem('draft', JSON.stringify(note))
      console.log('draft saved:', note.title)
    }, 1000)
    return () => clearTimeout(id)
  }, [note])

const filteredNotes = useMemo(() => {

   return notes.filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
 )
  }, [notes, search])

function handleChange(event) {
  const { name, value } = event.target

  setNote({
    ...note,
    [name]: value,
  })
}

function handleSubmit(event) {
  event.preventDefault()

  const title = note.title.trim()
  const body = note.body.trim()

  if (!title || !body) {
    return
  }

 

  const newNote = {
    id: Date.now(),
    title: title,
    body: body,
  }

  setNotes([...notes, newNote])

  setNote({
    title: '',
    body: '',
  })
  titleRef.current.focus()
}

 const handleDelete = useCallback((id) => {
  setNotes(notes.filter((note) => note.id !== id))
}, [notes])

  return (
    <div className="grid min-h-screen grid-cols-[420px_1fr]">
    <aside className="sticky top-0 flex h-screen flex-col gap-5 bg-white px-8 py-9 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]">
        <h1 className="text-[72px] leading-none font-extralight text-[#b83f45]">
          notes
        </h1>
        <div>
          <p className="mb-2 text-[13px] font-normal tracking-wide text-[#949494]">SEARCH</p>
         <input
           placeholder="Search by title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
          />
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <p className="text-[13px] font-normal tracking-wide text-[#949494]">NEW NOTE</p>
          <input
            ref={titleRef}
            name="title"
            value={note.title}
            onChange={handleChange}
            placeholder="Title"
            className="h-[52px] w-full border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
            />
          <textarea
            name="body"
            value={note.body}
            onChange={handleChange}
            placeholder="Write your note"
            className="h-[120px] w-full resize-none py-3 border border-[#e6e6e6] px-4 text-lg outline-none placeholder:text-black/40 placeholder:italic focus:border-[#cf7d7d]"
            />

            <button
            type="submit"
            className="h-[52px] cursor-pointer bg-[#b83f45] text-lg text-white hover:bg-[#a5363c]"
            >
            Add note
            </button>
                    
        </form>
      </aside>

      <section className="px-12 py-11">
        <h2 className="mb-6 text-3xl">All notes</h2>
      <ul className="grid grid-cols-3 items-start gap-5">
          {filteredNotes.map((note) => (
                <li
                    key={note.id}
                    className="relative min-h-32 bg-white px-6 py-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]"
                >
                    <NoteCard
                id={note.id}
                title={note.title}
                body={note.body}
                onDelete={handleDelete}
              />
                </li>
          ))}
        </ul>

        {filteredNotes.length === 0 && (
        <p className="text-lg text-[#949494]">No notes found</p>
        )}
      </section>
    </div>
  )
}
 
export default Notes