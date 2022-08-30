<template>
<div class="grid card pageDisposition">
    <div class="col-12">
         <Message severity="info" :sticky='true' :key="$t('PRF.WELCOME')">
        {{ $t("PRF.WELCOME") }}
      </Message>
    </div>
</div>

</template>
<style scoped>
 .pageDisposition {
   margin:10px !important;
   margin-top:0px !important;
 }
</style>

