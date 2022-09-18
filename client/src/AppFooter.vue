<template>
	<div class="layout-footer">
		<img alt="Logo" src="images/IMAicon.jpg" height="20" class="mr-2" />
		by
		<span class="font-medium ml-2">jeremielodi@gmail.com</span>
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
		computed: {
			darkTheme() {
				return this.$appState.theme.startsWith('saga');
			}
		}
	}
</script>

<style scoped>

</style>