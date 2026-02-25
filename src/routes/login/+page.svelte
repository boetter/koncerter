<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let { form } = $props();
</script>

<h1>Log ind</h1>

<form method="POST" use:enhance={() => async ({ result, update }) => {
	if (result.type === 'success') {
		goto('/');
	} else {
		await update();
	}
}}>
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="email">E-mail</label>
		<input id="email" name="email" type="email" required autocomplete="email" />
	</div>

	<div class="form-group">
		<label for="password">Adgangskode</label>
		<input id="password" name="password" type="password" required autocomplete="current-password" />
	</div>

	<div class="form-actions">
		<button type="submit">Log ind</button>
		<a href="/register">Opret konto</a>
	</div>
</form>
