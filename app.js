import express from 'express'

import { getNotes, getNote, createNote, deleteNote } from './database.js'   

const app = express()
const port = 8080

app.get('/notes', async (req, res) => {
    const notes = await getNotes()
    res.json(notes)
})

app.get('/notes/:id', async (req, res) => {
    const note = await getNote(req.params.id)
    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ error: 'Note not found' })
    }
})

app.use(express.json())

app.post('/notes', async (req, res) => {
    const { title, content } = req.body
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' })
    }
    const newNote = await createNote(title, content)
    res.status(201).json(newNote)
})

app.delete('/notes/:id', async (req, res) => {
    const note = await getNote(req.params.id)
    if (!note) {
        return res.status(404).json({ error: 'Note not found' })
    }
    
    await deleteNote(req.params.id)
    res.json({ message: 'Note deleted' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
})