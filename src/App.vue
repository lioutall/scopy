<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {ref} from 'vue'
import {onMounted} from 'vue'
import { Notify } from 'quasar'
import { writeText } from '@tauri-apps/api/clipboard';
import { getClient, Body, ResponseType } from '@tauri-apps/api/http';



const arr = ref([])
const toSend = ref('')

onMounted(()=>{
  reloadW()
})

const reloadW =async ()=>{
  const client = await getClient();
  const response = await client.get('http://', {
    timeout: 30,
    // the expected response type
    responseType: ResponseType.JSON
  });
  
  if ((response.data as any).success == true) {
        arr.value = (response.data as any).data
  }
}

const save =async ()=>{

  const client = await getClient();
  const response = await client.post('http://', 
    Body.json({
        "context": toSend.value,
        "terminal": '1'        
    }));

  if ((response.data as any).success == true) {
    reloadW()
    toSend.value=''
  }
}


const cp =async (event: any) => {
    await writeText(event.currentTarget.innerText);
    Notify.create({
      message: '复制成功',
      position: "center",
      timeout: 2000
    })
};

</script>

<template>
<div class="q-pa-md">
  <div class="column" v-for="item in arr">
      <div class="col" v-on:dblclick="cp($event)">
        {{(item as any).context}}
      </div>
  </div>


  <div class="row">
    <div class="col-10">
      <q-input v-model="toSend" filled type="textarea" bg-color="orange" rows="2"/>
    </div>
    <div class="col" align="left" style="padding: 10px;">
      <q-btn color="primary" label="保存" @click="save"/>
      <q-btn round color="secondary" icon="navigation" @click="reloadW"/>
    </div>
    
  </div>
</div>
</template>

<style lang="sass" scoped>
.column > div
  padding: 5px 5px
  background: rgba(86, 61, 124, .15)
  border: 1px solid rgba(86, 61, 124, .2)
  margin-top: 0.5rem
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
