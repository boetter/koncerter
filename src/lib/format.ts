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
