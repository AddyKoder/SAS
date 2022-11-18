
export default function RescheduleList({ reschedules , yourReschedules=false}: { reschedules: object[], yourReschedules?: boolean }) {


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
			<tbody>{reschedules.map(r => {
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
