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
			{reschedules === 'no' && 
				<h2 style={{fontSize:'2rem', opacity:'.5', textAlign:'center', fontWeight:'200'}}>Attendence is not take yet</h2>	
			}

			{!['pending', 'failed', 'no'].includes(reschedules as string) && 
				<div className='reschedules' style={{marginTop:'2em'}}>
					<h1>Your Reschedules : <span style={{opacity:'.5'}}>{ localStorage.getItem('teacherName') == null?'':localStorage.getItem('teacherName')}</span></h1>
					{
						yourReschedules === 'no' ? <div className="getIdDialogue" style={{padding:'2em', border:'1px solid var(--color-accent)', backgroundColor:'rgba(0, 153, 255, 0.3)', borderRadius:'2em', margin: '2em 1em'}}>

							<p style={{fontSize: '1.2rem', opacity:'0.7'}}>View all your reschedules easily, separated from all the mess below just enter your Name and Teacher ID which you can get from the person managing the SAS server</p>

							<input onChange={e => setName(e.target.value)} type="text" placeholder='Your Name' style={{ width: '100%', boxSizing:'border-box', backgroundColor:'var(--color-bg)', border:'none', padding:'.5em 1em', borderRadius:'1em', marginBlock:'.5em'}}/>

							<input onChange={e => setId(Number(e.target.value))} type="number" maxLength={5} min={0} placeholder='Teacher ID'style={{ width: '100%', boxSizing:'border-box', backgroundColor:'var(--color-bg)', border:'none', padding:'.5em 1em', borderRadius:'1em', marginBlock:'.5em'}}/>
							<button style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--color-accent)', border: 'none', padding: '.5em 1em', borderRadius: '1em', marginBlock: '.5em' }} onClick={() => {
								
								localStorage.setItem('teacherId', String(id))
								localStorage.setItem('teacherName', name)
								location.reload()
							}}>OK</button>
						</div>:
					<div className="your-reschedules">
								{yourReschedules.length === 0 ? <Notification type='success' heading='Yayy... No Reschedules !' content='Relax, you do not have any reschedules assigned for today' /> :
									<RescheduleList reschedules={yourReschedules as object[]} yourReschedules={true} />}
					</div>}
					<hr style={{opacity:'.5', borderBottom:'none'}} />
					<h1>All Reschedules :</h1>
					<div className="all-reschedules">
						<RescheduleList reschedules={reschedules as object[]}/>
					</div>
				</div>	
			}
			<Footer/>
		</div>
	);
}
