<script lang="ts">
	let username: string = '';
	let password: string = '';
	let confirmPassword: string = '';
	let errorElement: HTMLParagraphElement;
	let registerForm: HTMLFormElement;
	let submitButton: HTMLButtonElement;

	async function submitForm() {
		if (password !== confirmPassword) {
			errorElement.textContent = 'Пароли не совпадают';
		} else {
			submitButton.disabled = true;
			errorElement.textContent = '';
			if (
				username.replace(/['"`;%|]/g, '').trim().length < 4 ||
				password.replace(/['"`;%|]/g, '').trim().length < 8
			) {
				errorElement.textContent = 'Некоррекные данные. Попробуйте снова через 5 секунд';
				setTimeout(() => {
					window.location.reload();
				}, 5000);
			} else {
				const response = await fetch('/v1/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						username,
						password
					})
				});

				if (response.ok) {
					errorElement.classList.add('text-green-500');
					errorElement.textContent =
						'Учетная запись создана успешно. Вы будете перенаправлены на страницу входа';
					setTimeout(() => {
						window.location.href = '/login';
					}, 2000);
				} else if (response.status == 409) {
					errorElement.textContent = 'Пользователь уже существует. Если это вы, попробуйте войти.';
					submitButton.disabled = false;
				} else if (response.status == 400) {
					errorElement.textContent =
						'Имя пользователя должно быть от 4 символов. Пароль должен быть от 8 символов.';
					submitButton.disabled = false;
				} else {
					errorElement.textContent = 'Произошла ошибка. Попробуйте снова.';
					submitButton.disabled = false;
				}
			}
		}
	}
</script>

<section
	class="w-[700px] bg-white justify-center flex rounded-3xl mx-auto mt-12 mb-12 shadow-lg box-content p-5 flex-col"
>
	<form
		method="POST"
		class="w-full flex flex-col p-4 gap-y-8 h-full items-center justify-center"
		on:submit|preventDefault={submitForm}
		bind:this={registerForm}
	>
		<h1 class="h-max text-3xl text-gray-700 font-bold">Регистрация</h1>
		<section class="flex flex-col justify-center w-full gap-y-2 items-center">
			<label for="username"> Логин </label>
			<input
				type="text"
				name="username"
				class="w-7/12 box-content py-2 px-5 rounded-lg shadow-md border border-gray-300"
				bind:value={username}
				minlength="4"
				required
			/>
		</section>
		<section class="flex flex-col justify-center w-full gap-y-2 items-center">
			<label for="password"> Пароль </label>
			<input
				type="password"
				name="password"
				class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 pr-8"
				bind:value={password}
				required
			/>
		</section>
		<section class="flex flex-col justify-center w-full gap-y-2 items-center">
			<label for="confirmPassword"> Подтвердите пароль </label>
			<input
				type="password"
				name="confirmPassword"
				class="w-7/12 box-content py-2 px-2 rounded-lg shadow-md border border-gray-300 pr-8"
				bind:value={confirmPassword}
				required
			/>
		</section>
		<section class="h-max w-7/12 p-2 box-content text-center text-red-500 text-3xl">
			<p bind:this={errorElement} class="text-sm" />
		</section>
		<button
			bind:this={submitButton}
			type="submit"
			class="bg-white py-3 rounded-xl px-10 hover:bg-blue-500 hover:text-white shadow-md border border-gray-200 disabled:bg-gray-300 disabled:text-white"
			>Регистрация</button
		>
	</form>
	<span class="flex w-full justify-center items-center p-4 gap-x-2">
		Уже есть учетная запись?
		<a href="/login" class="text-blue-600 text-lg">Войти</a>
	</span>
</section>
