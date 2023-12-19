// enum

export enum StoryTag {
  'founding' = 'Founding',
  'coding' = 'Coding',
  'music' = 'Music',
  'ideas' = 'Ideas',
  'random' = 'Random',
}

export class EmailExistsError extends Error {
  name: string
  message: string
  
  constructor() {
    super("Email already exists")
    this.name = 'EmailExistsError'
    this.message = 'Email already exists'
  }
}