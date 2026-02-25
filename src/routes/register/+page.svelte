<script lang="ts">
	let { form } = $props();
</script>

<h1>Opret konto</h1>

<form method="POST">
	{#if form?.error}
		<p class="form-error">{form.error}</p>
	{/if}

	<div class="form-group">
		<label for="username">Brugernavn</label>
		<input id="username" name="username" type="text" required autocomplete="username" value={form?.username ?? ''} />
	</div>

	<div class="form-group">
		<label for="email">E-mail</label>
		<input id="email" name="email" type="email" required autocomplete="email" value={form?.email ?? ''} />
	</div>

	<div class="form-group">
		<label for="password">Adgangskode</label>
		<input id="password" name="password" type="password" required autocomplete="new-password" minlength="8" />
	</div>

	<div class="form-group">
		<label for="confirm">Bekræft adgangskode</label>
		<input id="confirm" name="confirm" type="password" required autocomplete="new-password" />
	</div>

	<div class="form-actions">
		<button type="submit">Opret konto</button>
		<a href="/login">Har du allerede en konto? Log ind</a>
	</div>
</form>
