// Convert a naive datetime string from datetime-local input (Copenhagen local time)
// to a UTC ISO string for storage. Uses Intl to correctly handle DST.
export function copenhagenToUTC(naive: string): string {
	const approx = new Date(naive + ':00Z');
	const cphStr = new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Europe/Copenhagen',
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit', second: '2-digit',
		hour12: false
	}).format(approx);
	const cphAsUTC = new Date(cphStr.replace(' ', 'T') + 'Z');
	const offsetMs = cphAsUTC.getTime() - approx.getTime();
	return new Date(approx.getTime() - offsetMs).toISOString();
}

// Convert a UTC ISO string to a Copenhagen local time string for datetime-local input.
export function utcToCopenhagenInput(iso: string): string {
	const d = new Date(iso);
	const parts = new Intl.DateTimeFormat('sv-SE', {
		timeZone: 'Europe/Copenhagen',
		year: 'numeric', month: '2-digit', day: '2-digit',
		hour: '2-digit', minute: '2-digit',
		hour12: false
	}).formatToParts(d);
	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
	const hour = get('hour') === '24' ? '00' : get('hour');
	return `${get('year')}-${get('month')}-${get('day')}T${hour}:${get('minute')}`;
}

const danskDato = new Intl.DateTimeFormat('da-DK', {
	timeZone: 'Europe/Copenhagen',
	weekday: 'short',
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
});

const danskDatoKort = new Intl.DateTimeFormat('da-DK', {
	timeZone: 'Europe/Copenhagen',
	day: 'numeric',
	month: 'short',
	year: 'numeric'
});

export function formatDate(dateStr: string): string {
	return danskDato.format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
	return danskDatoKort.format(new Date(dateStr));
}

export function isFuture(dateStr: string): boolean {
	return new Date(dateStr) > new Date();
}
