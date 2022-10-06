<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {ref} from 'vue'
import {onMounted} from 'vue'
import axios from 'axios'
import { Notify } from 'quasar'

const arr = ref([])
const toSend = ref('')
const chooseStr = ref('')

onMounted(()=>{
  reloadW()
})

const reloadW = ()=>{
  axios.get("/api/list")
    .then((response) => {
      if (response.data.success == true) {
        arr.value = response.data.data
      }
  })
}

const save = ()=>{
  axios
      .post('/api/copy', {
        context: toSend.value,
        terminal: '1'
      })
      .then(response => {
        if (response.data.success == true) {
          reloadW()
          toSend.value=''
        }
      })
      .catch(function (error) {
        console.log(error);
      });
}


const handleCopy = (e: ClipboardEvent) => {
    // clipboardData 可能是 null
    e.clipboardData && e.clipboardData.setData('text/plain', chooseStr.value);
    e.preventDefault();
    // removeEventListener 要传入第二个参数
    document.removeEventListener('copy', handleCopy);
    Notify.create({
      message: '复制成功',
      position: "center",
      timeout: 2000
    })

};

const cp = (event: any) => {
    chooseStr.value = event.currentTarget.innerText;
    document.addEventListener('copy', handleCopy);
    document.execCommand('copy');
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
