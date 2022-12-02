export default function RescheduleList({ reschedules , yourReschedules=false, filter}: { reschedules: object[], yourReschedules?: boolean, filter:string }) {

	return (
		<table>
			<thead>
				<tr>
					{yourReschedules === false && 
						<th>Teacher</th>
					}
					<th>Period</th>
					<th>Class</th>
				</tr>
			</thead>
			
			<tbody>{
				// filtering reschedules for searching
				reschedules.filter(reschedule => {
					const filterQuery = filter === undefined? '': filter.toLowerCase()
					const r = Object(reschedule)
					// will only render the reschedule object if
					// it's not a undefined period i.e. unable to be rescheduled
					// and if it's one of the fields match with query
					if (r.teacherName !== undefined &&(
						r.teacherName.toLowerCase().includes(filterQuery) ||
						String(r.periodNo).toLowerCase().includes(filterQuery) ||
						r.className.toLowerCase().includes(filterQuery))) {
						return 1
					}
					return 0
			})
			//mapping over filtered reschedules to plot them
				.map(r => {
				const name = Object(r).teacherName || 'Undefined';
				return <tr style={name === 'Undefined' ? { backgroundColor: 'rgba(255,0,0,0.3)' }:{}} key={`${Object(r).teacherId}-${Object(r).periodNo}`}>
					{yourReschedules === false &&
						<td>{name}</td>
					}
					<td>{Object(r).periodNo}</td>
					<td>{Object(r).className}</td>
				</tr>
			})}</tbody>
		</table>
	);
}
