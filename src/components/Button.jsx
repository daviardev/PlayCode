export default function Button ({ children, onClick, title }) {
  return (
    <button
      className='button-toolbar'
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}
