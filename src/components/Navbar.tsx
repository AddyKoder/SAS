
export default function Navbar() {
	return (
		<>
			<header>
				<h1 className="logo">SAS : <span>{new Date().toISOString().slice(0,10)}</span></h1>
			</header>
		</>
	);
}

export function Footer() {
	return (
		<div className='developer'>
			<h2>
				SAS<span> ~ School Assistant Scheduler, is a fullstack Soft-Solution developed and maintained by </span>{' '}
				<a href='https://adityatripathi.com' target='_blank'>
					Aditya Tripathi
				</a>
				<span> - addykoder@gmail.com </span>
			</h2>
		</div>
	);
}
