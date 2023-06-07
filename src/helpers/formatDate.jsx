export default function formatDate(d){
    const newDate = new Date(d.split('T')[0].split('-'));
    const options ={
        weekday:'long',
        year: 'numeric',
        month:'long',
        day:'numeric'
    };
    return newDate.toLocaleDateString('en-US',options);
}