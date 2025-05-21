let io = null

export const setIOInstance = (instance) => {
  io = instance
}

export const getIOInstance = () => {
  if (!io) {
    throw new Error('Socket.IO instance has not been initialized')
  }
  return io
}
