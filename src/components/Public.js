import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            {/* <main className="public__main">
            </main> */}
            {/* <footer >
                <Link to="/login" style={{textDecoration: 'none',
                    color:   'white'
                }}>Login</Link>
            </footer> */}
            <button className='login-link'>
                <Link to="/login" style={{textDecoration: 'none',
                    color: 'white'
                }}>Login</Link>
            </button>
        </section>

    )
    return content
}
export default Public