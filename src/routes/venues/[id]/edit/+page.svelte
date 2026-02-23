<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	const venue = $derived(form ?? data.venue);
</script>

<h1>Rediger koncertsted</h1>

<form method="POST" action="?/save" use:enhance>
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="name">Navn</label>
		<input id="name" name="name" type="text" required value={venue.name ?? ''} />
	</div>

	<div class="form-group">
		<label for="address">Adresse</label>
		<input id="address" name="address" type="text" required value={venue.address ?? ''} />
	</div>

	<div class="form-group">
		<label for="website_url">Hjemmeside (valgfrit)</label>
		<input id="website_url" name="website_url" type="url" value={venue.websiteUrl ?? ''} />
	</div>

	<div class="form-actions">
		<button type="submit">Gem</button>
		<a href="/venues/{data.venue.id}">Annuller</a>
	</div>
</form>

<div class="section">
	<form method="POST" action="?/delete" use:enhance>
		<button type="submit" class="danger" onclick={(e) => { if (!confirm('Er du sikker på at du vil slette dette sted?')) e.preventDefault(); }}>Slet sted</button>
	</form>
</div>
