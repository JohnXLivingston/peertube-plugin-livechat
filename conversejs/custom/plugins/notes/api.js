// SPDX-FileCopyrightText: 2024 John Livingston <https://www.john-livingston.fr/>
//
// SPDX-License-Identifier: AGPL-3.0-only

async function openNotes () {
  const appElement = document.querySelector('livechat-converse-muc-note-app')
  if (!appElement) {
    throw new Error('Cant find Note App Element')
  }
  await appElement.showApp()
  await appElement.updateComplete // waiting for the app to be open

  const notesElement = appElement.querySelector('livechat-converse-muc-notes')
  if (!notesElement) {
    throw new Error('Cant find Notes Element')
  }
  await notesElement.updateComplete
  return notesElement
}

async function openCreateNoteForm (occupant) {
  const notesElement = await openNotes()
  await notesElement.openCreateNoteForm(undefined, occupant)
}

async function searchNotesAbout (occupant) {
  const notesElement = await openNotes()
  await notesElement.filterNotes({ occupant })
}

export default {
  openNotes,
  openCreateNoteForm,
  searchNotesAbout
}
