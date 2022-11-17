

export default function Notification({type, heading, content}:{type:'error' | 'success', heading: string, content:string}) {
	
	return <div className={ `notification ${type}` }>
		<h2>{heading}</h2>
		<p>{content}</p>
	</div>

}