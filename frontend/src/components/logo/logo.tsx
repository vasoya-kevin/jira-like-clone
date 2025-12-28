import clsx from 'clsx'
import { Link } from 'react-router-dom'

const Logo = ({ className }: any) => {
    return (
        <h1 className={clsx("text-neutral-800 ppercase col-span-2 px-4 text-3xl font-bold font-Staatliches tracking-widest", className)}>
            <Link to='/'>
                JIRA CLONE
            </Link>
        </h1>
    )
}

export default Logo