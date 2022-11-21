// importing all styles
import './styles/components/navbar.css'
import './styles/components/spinner.css'
import './styles/components/notification.css'

import './styles/default.css'
import './styles/typography.css'
import './styles/media.css'

import './styles/pages/reschedules.css'
import { useEffect, useState} from 'react'

// importing required components
import Spinner from './components/Spinner'
import Notification from './components/Notification'
import Navbar from './components/Navbar'
import RescheduleList from './components/RescheduleList'
import { Footer } from './components/Navbar'

export default function App() {

	const [ reschedules, setReschedules ] = useState<string | object[]>('pending')
	const [yourReschedules, setYourReschedules] = useState<string | object[]>([])
	const [name, setName] = useState('')
	const [id, setId] = useState(0)

	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	// updating debounced search
	useEffect(() => {

		const searchTimeout = setTimeout(() => {
			setDebouncedSearch(search)	
		}, 200);
		
		return () => {
			clearTimeout(searchTimeout)
		}

	},[search])
	
	// fetching the reschedules from json bin api
	useEffect(() => {
		fetch('https://api.jsonbin.io/v3/b/637385800e6a79321e4a6600?meta=false').then(r => {
			if (r.status == 200) return r.json()
			throw new Error("cannot fetch reschedules");
		}).then(r => {
			if (new Date().toISOString().slice(0, 10) === r.date) {
				setReschedules(r.reschedules)
				const teacherId = Number(localStorage.getItem('teacherId'))
				if (teacherId === 0) setYourReschedules('no')	
				if (teacherId !== 0) {
					setYourReschedules(
						r.reschedules.map((reschedule:object) => {
							const r = Object(reschedule)
							if (r.teacherId == teacherId) {
								return {
									teacherName: r.teacherName,
										className: r.className,
										periodNo: r.periodNo
								}
							}
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						}).filter((i:any) =>  Number(i!==undefined))
					)
				}
				
			}
			else {setReschedules('no')}
		}).catch(()=> setReschedules('failed'))
	},[])

	return (
		<div className='App'>
			<Navbar/>
			{ reschedules === 'pending' && <Spinner/> }
			{ reschedules === 'failed' && <Notification type='error' heading='Cannot fetch Reschedules' content='Due to some error the reschedules cannot be fetched from the server. Check your Internet connection or otherwise there can be some internal server issue with the application' />}

			{/* when no reschedules are uploaded for that day */}
			{reschedules === 'no' && 
				<h2 className='bg-notify'>Attendance is not taken yet...</h2>	
			}
			{/* The main area */}
			{!['pending', 'failed', 'no'].includes(reschedules as string) && 
				<div className='reschedules' style={{marginTop:'2em'}}>
					<h1>Your Reschedules : <span >{ localStorage.getItem('teacherName') == null?'':localStorage.getItem('teacherName')}</span></h1>
					{
						yourReschedules === 'no' ? <div className="getIdDialogue" >

							<p >View all your reschedules easily, separated from all the mess below just enter your Name and Teacher ID which you can get from the person managing the SAS server.</p>

							<input onChange={e => setName(e.target.value)} type="text" placeholder='Your Name' />

							<input onChange={e => setId(Number(e.target.value))} type="number" maxLength={5} min={0} placeholder='Teacher ID'/>

							<button  onClick={() => {
								
								localStorage.setItem('teacherId', String(id))
								localStorage.setItem('teacherName', name)
								location.reload()
							}}>OK</button>

						</div>:

					<div className="your-reschedules">
								{yourReschedules.length === 0 ? <Notification type='success' heading='Yayy... No Reschedules !' content='Relax, you do not have any reschedules assigned for today' /> :
									<RescheduleList reschedules={yourReschedules as object[]} yourReschedules={true} filter=''/>}
					</div>}
					<hr  />



					<h1>All Reschedules :</h1>
					<input className='search' type="text" placeholder='Search | Filter' onChange={e=>setSearch(e.target.value)}/>
					<div className="all-reschedules">
						<RescheduleList reschedules={reschedules as object[]} filter={debouncedSearch} />
					</div>
				</div>	
			}

			<Footer/>
		</div>
	);
}
