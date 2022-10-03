<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {ref} from 'vue'
import {onMounted} from 'vue'
import axios from 'axios'

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
        }
      })
      .catch(function (error) { // 请求失败处理
        console.log(error);
      });
}


const handleCopy = (e: ClipboardEvent) => {
    // clipboardData 可能是 null
    e.clipboardData && e.clipboardData.setData('text/plain', chooseStr.value);
    e.preventDefault();
    // removeEventListener 要传入第二个参数
    document.removeEventListener('copy', handleCopy);
    this.$notify({
      title:'成功',
      message:'...成功',
      type:'seccess',
      duration:2000
    })
};

const cp = (event) => {
    chooseStr.value = event.currentTarget.innerText;
    document.addEventListener('copy', handleCopy);
    document.execCommand('copy');
};

</script>

<template>
  <div>
    <ul v-for="item in arr">
      <li v-on:click="cp($event)">{{item.context}}</li>
    </ul>
  </div>
  
  <div>
    <input type="textarea" v-model="toSend">
    <button v-on:click="save">提交</button>
  </div>
</template>

<style scoped>
.list {
  height: 200px;
  overflow-y: auto;
  background: #12312j;
}
</style>
