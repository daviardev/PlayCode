import packageInfo from '../../package.json'

const { version } = packageInfo

const Logo = (props) => {
  return (
    <div className='logo'>
      <div className='gradient'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='21.524'
          height='26.205'
          fill='#fff'
          viewBox='-2.4 -2.4 28.8 28.8'
          {...props}
        >
          <g fill='none' fillRule='evenodd'>
            <path fill='#F1DC50' d='M0 0h24v24H0z' />
            <path
              stroke='#333'
              strokeWidth={2}
              d='M12 11v8c0 .876-.523 2-2 2-2.385 0-2.5-2-2.5-2m13.29-5.484c-.6-1.01-1.396-1.516-2.386-1.516C16.856 12 16 13 16 14s.5 2 2.508 2.5c1.278.318 2.492 1 2.492 2.5s-1.315 2-2.5 2c-1.514 0-2.514-.667-3-2'
            />
          </g>
        </svg>
      </div>
      <h1 className='title'>JS Play Code</h1>
      <span className='version'>v.{version} <span className='badge'>BETA</span></span>
    </div>
  )
}

export default Logo
